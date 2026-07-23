import { Repository } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Session } from '../sessions/session.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Role } from '../common/enums/role.enum';
export declare class ReservationsService {
    private reservationsRepository;
    private sessionsRepository;
    constructor(reservationsRepository: Repository<Reservation>, sessionsRepository: Repository<Session>);
    getOccupiedSeats(sessionId: string): Promise<number[]>;
    create(userId: string, dto: CreateReservationDto): Promise<Reservation>;
    findMine(userId: string): Promise<Reservation[]>;
    findAll(): Promise<Reservation[]>;
    findOne(id: string, requester: {
        sub: string;
        role: Role;
    }): Promise<Reservation>;
    cancel(id: string, requester: {
        sub: string;
        role: Role;
    }): Promise<{
        message: string;
    }>;
    countAll(): Promise<number>;
    totalRevenue(): Promise<number>;
    topMovies(limit?: number): Promise<any[]>;
}
