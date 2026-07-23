"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./reservation.entity");
const session_entity_1 = require("../sessions/session.entity");
const role_enum_1 = require("../common/enums/role.enum");
let ReservationsService = class ReservationsService {
    constructor(reservationsRepository, sessionsRepository) {
        this.reservationsRepository = reservationsRepository;
        this.sessionsRepository = sessionsRepository;
    }
    async getOccupiedSeats(sessionId) {
        const reservations = await this.reservationsRepository.find({
            where: { sessionId, status: reservation_entity_1.ReservationStatus.CONFIRMED },
        });
        return reservations.flatMap((r) => r.seats);
    }
    async create(userId, dto) {
        const session = await this.sessionsRepository.findOne({
            where: { id: dto.sessionId },
            relations: ['movie'],
        });
        if (!session) {
            throw new common_1.NotFoundException('Séance introuvable');
        }
        const occupied = await this.getOccupiedSeats(dto.sessionId);
        const conflict = dto.seats.find((s) => occupied.includes(s));
        if (conflict) {
            throw new common_1.BadRequestException(`Le siège ${conflict} est déjà réservé`);
        }
        const invalidSeat = dto.seats.find((s) => s > session.totalSeats);
        if (invalidSeat) {
            throw new common_1.BadRequestException(`Le siège ${invalidSeat} n'existe pas (capacité: ${session.totalSeats})`);
        }
        const total = dto.seats.length * session.price;
        const ticketId = `CINE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const reservation = this.reservationsRepository.create({
            userId,
            sessionId: dto.sessionId,
            seats: dto.seats,
            total,
            ticketId,
            status: reservation_entity_1.ReservationStatus.CONFIRMED,
        });
        const saved = await this.reservationsRepository.save(reservation);
        return this.reservationsRepository.findOne({
            where: { id: saved.id },
            relations: ['session', 'session.movie', 'session.cinema', 'user'],
        });
    }
    findMine(userId) {
        return this.reservationsRepository.find({
            where: { userId },
            relations: ['session', 'session.movie', 'session.cinema'],
            order: { createdAt: 'DESC' },
        });
    }
    findAll() {
        return this.reservationsRepository.find({
            relations: ['session', 'session.movie', 'session.cinema', 'user'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, requester) {
        const reservation = await this.reservationsRepository.findOne({
            where: { id },
            relations: ['session', 'session.movie', 'session.cinema', 'user'],
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Réservation introuvable');
        }
        if (requester.role !== role_enum_1.Role.ADMIN && reservation.userId !== requester.sub) {
            throw new common_1.ForbiddenException("Vous n'avez pas accès à cette réservation");
        }
        return reservation;
    }
    async cancel(id, requester) {
        const reservation = await this.findOne(id, requester);
        reservation.status = reservation_entity_1.ReservationStatus.CANCELLED;
        await this.reservationsRepository.save(reservation);
        return { message: 'Réservation annulée' };
    }
    async countAll() {
        return this.reservationsRepository.count();
    }
    async totalRevenue() {
        const result = await this.reservationsRepository
            .createQueryBuilder('r')
            .where('r.status = :status', { status: reservation_entity_1.ReservationStatus.CONFIRMED })
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
            .where('r.status = :status', { status: reservation_entity_1.ReservationStatus.CONFIRMED })
            .groupBy('movie.id')
            .addGroupBy('movie.title')
            .orderBy('reservationsCount', 'DESC')
            .limit(limit)
            .getRawMany();
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map