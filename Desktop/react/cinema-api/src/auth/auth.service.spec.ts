import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let repo: { findOne: jest.Mock; create: jest.Mock; save: jest.Mock };
  let jwt: { sign: jest.Mock; verify: jest.Mock };

  const mockUser: User = {
    id: 'uuid-1',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'hashed-password',
    role: Role.USER,
    isActive: true,
    reservations: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    repo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };
    jwt = { sign: jest.fn().mockReturnValue('signed-jwt-token'), verify: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: repo },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('crée un nouvel utilisateur et renvoie un token', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue(mockUser);
      repo.save.mockResolvedValue(mockUser);

      const result = await service.register({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(repo.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result.accessToken).toBe('signed-jwt-token');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('test@example.com');
    });

    it('rejette si un compte existe déjà avec cet email', async () => {
      repo.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it("connecte l'utilisateur avec les bons identifiants", async () => {
      const hashed = await bcrypt.hash('Password123!', 10);
      repo.findOne.mockResolvedValue({ ...mockUser, password: hashed });

      const result = await service.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBe('signed-jwt-token');
    });

    it('rejette un mauvais mot de passe', async () => {
      const hashed = await bcrypt.hash('Password123!', 10);
      repo.findOne.mockResolvedValue({ ...mockUser, password: hashed });

      await expect(
        service.login({ email: 'test@example.com', password: 'WrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejette un email inconnu', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'inconnu@example.com', password: 'whatever' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rejette un compte désactivé', async () => {
      repo.findOne.mockResolvedValue({ ...mockUser, isActive: false });

      await expect(
        service.login({ email: 'test@example.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
