import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from './reservation.entity';
import { Session } from '../sessions/session.entity';
import { Role } from '../common/enums/role.enum';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepo: {
    find: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
    save: jest.Mock;
  };
  let sessionRepo: { findOne: jest.Mock };

  const sampleSession = {
    id: 'session-1',
    price: 5000,
    totalSeats: 50,
    movie: { title: 'Test Movie' },
  } as Session;

  beforeEach(async () => {
    reservationRepo = { find: jest.fn(), findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    sessionRepo = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: getRepositoryToken(Reservation), useValue: reservationRepo },
        { provide: getRepositoryToken(Session), useValue: sessionRepo },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getOccupiedSeats', () => {
    it('retourne la liste à plat des sièges déjà réservés', async () => {
      reservationRepo.find.mockResolvedValue([
        { seats: [1, 2] },
        { seats: [5] },
      ]);

      const result = await service.getOccupiedSeats('session-1');

      expect(result).toEqual([1, 2, 5]);
    });
  });

  describe('create', () => {
    it('rejette si la séance est introuvable', async () => {
      sessionRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create('user-1', { sessionId: 'unknown', seats: [1] }),
      ).rejects.toThrow(NotFoundException);
    });

    it('rejette si un siège demandé est déjà occupé', async () => {
      sessionRepo.findOne.mockResolvedValue(sampleSession);
      reservationRepo.find.mockResolvedValue([{ seats: [3] }]);

      await expect(
        service.create('user-1', { sessionId: 'session-1', seats: [3] }),
      ).rejects.toThrow(BadRequestException);
    });

    it("rejette un numéro de siège au-delà de la capacité de la salle", async () => {
      sessionRepo.findOne.mockResolvedValue(sampleSession);
      reservationRepo.find.mockResolvedValue([]);

      await expect(
        service.create('user-1', { sessionId: 'session-1', seats: [999] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('crée la réservation et calcule le bon total', async () => {
      sessionRepo.findOne.mockResolvedValue(sampleSession);
      reservationRepo.find.mockResolvedValue([]);
      reservationRepo.create.mockImplementation((data) => data);
      reservationRepo.save.mockImplementation((data) => Promise.resolve({ id: 'res-1', ...data }));
      reservationRepo.findOne.mockResolvedValue({ id: 'res-1', total: 10000 });

      await service.create('user-1', { sessionId: 'session-1', seats: [1, 2] });

      expect(reservationRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ total: 10000, status: ReservationStatus.CONFIRMED }),
      );
    });
  });

  describe('findOne', () => {
    const reservation = { id: 'res-1', userId: 'owner-id' } as Reservation;

    it("lève une ForbiddenException si un autre utilisateur tente d'accéder à la réservation", async () => {
      reservationRepo.findOne.mockResolvedValue(reservation);

      await expect(
        service.findOne('res-1', { sub: 'someone-else', role: Role.USER }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('autorise le propriétaire de la réservation', async () => {
      reservationRepo.findOne.mockResolvedValue(reservation);

      const result = await service.findOne('res-1', { sub: 'owner-id', role: Role.USER });

      expect(result).toEqual(reservation);
    });

    it("autorise un admin même s'il n'est pas le propriétaire", async () => {
      reservationRepo.findOne.mockResolvedValue(reservation);

      const result = await service.findOne('res-1', { sub: 'someone-else', role: Role.ADMIN });

      expect(result).toEqual(reservation);
    });
  });
});
