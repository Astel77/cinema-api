import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './reservation.entity';
import { Session } from '../sessions/session.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Session) private sessionsRepository: Repository<Session>,
  ) {}

  /** Sièges déjà occupés (réservations confirmées) pour une séance donnée */
  async getOccupiedSeats(sessionId: string): Promise<number[]> {
    const reservations = await this.reservationsRepository.find({
      where: { sessionId, status: ReservationStatus.CONFIRMED },
    });
    return reservations.flatMap((r) => r.seats);
  }

  async create(userId: string, dto: CreateReservationDto) {
    const session = await this.sessionsRepository.findOne({
      where: { id: dto.sessionId },
      relations: ['movie'],
    });

    if (!session) {
      throw new NotFoundException('Séance introuvable');
    }

    const occupied = await this.getOccupiedSeats(dto.sessionId);
    const conflict = dto.seats.find((s) => occupied.includes(s));

    if (conflict) {
      throw new BadRequestException(`Le siège ${conflict} est déjà réservé`);
    }

    const invalidSeat = dto.seats.find((s) => s > session.totalSeats);
    if (invalidSeat) {
      throw new BadRequestException(
        `Le siège ${invalidSeat} n'existe pas (capacité: ${session.totalSeats})`,
      );
    }

    const total = dto.seats.length * session.price;
    const ticketId = `CINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const reservation = this.reservationsRepository.create({
      userId,
      sessionId: dto.sessionId,
      seats: dto.seats,
      total,
      ticketId,
      status: ReservationStatus.CONFIRMED,
    });

    const saved = await this.reservationsRepository.save(reservation);

    return this.reservationsRepository.findOne({
      where: { id: saved.id },
      relations: ['session', 'session.movie', 'session.cinema', 'user'],
    });
  }

  findMine(userId: string) {
    return this.reservationsRepository.find({
      where: { userId },
      relations: ['session', 'session.movie', 'session.cinema'],
      order: { createdAt: 'DESC' },
    });
  }

  /** [Admin] toutes les réservations */
  findAll() {
    return this.reservationsRepository.find({
      relations: ['session', 'session.movie', 'session.cinema', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, requester: { sub: string; role: Role }) {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['session', 'session.movie', 'session.cinema', 'user'],
    });

    if (!reservation) {
      throw new NotFoundException('Réservation introuvable');
    }

    if (requester.role !== Role.ADMIN && reservation.userId !== requester.sub) {
      throw new ForbiddenException("Vous n'avez pas accès à cette réservation");
    }

    return reservation;
  }

  async cancel(id: string, requester: { sub: string; role: Role }) {
    const reservation = await this.findOne(id, requester);
    reservation.status = ReservationStatus.CANCELLED;
    await this.reservationsRepository.save(reservation);
    return { message: 'Réservation annulée' };
  }

  async countAll() {
    return this.reservationsRepository.count();
  }

  async totalRevenue() {
    const result = await this.reservationsRepository
      .createQueryBuilder('r')
      .where('r.status = :status', { status: ReservationStatus.CONFIRMED })
      .select('SUM(r.total)', 'sum')
      .getRawOne();
    return Number(result?.sum) || 0;
  }

  async topMovies(limit = 5) {
    return this.reservationsRepository
      .createQueryBuilder('r')
      .leftJoin('r.session', 'session')
      .leftJoin('session.movie', 'movie')
      .select('movie.id', 'movieId')
      .addSelect('movie.title', 'title')
      .addSelect('COUNT(r.id)', 'reservationsCount')
      .addSelect('SUM(r.total)', 'revenue')
      .where('r.status = :status', { status: ReservationStatus.CONFIRMED })
      .groupBy('movie.id')
      .addGroupBy('movie.title')
      .orderBy('reservationsCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
