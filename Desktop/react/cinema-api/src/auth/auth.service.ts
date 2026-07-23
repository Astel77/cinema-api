import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private buildToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    return this.jwtService.sign(payload);
  }

  private sanitize(user: User) {
    const { password, ...safe } = user;
    return safe;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({ where: { email: dto.email } });

    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cet email');
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
      role: Role.USER,
    });

    const saved = await this.usersRepository.save(user);

    return {
      user: this.sanitize(saved),
      accessToken: this.buildToken(saved),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const match = await bcrypt.compare(dto.password, user.password);

    if (!match) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return {
      user: this.sanitize(user),
      accessToken: this.buildToken(user),
    };
  }

  async me(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.sanitize(user);
  }

  /**
   * Génère un jeton de réinitialisation signé (courte durée de vie, 15 min).
   * Dans une vraie application, ce jeton serait envoyé par email ;
   * ici il est retourné directement dans la réponse pour simplifier la démo.
   */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      // On ne révèle pas si l'email existe ou non, pour des raisons de sécurité
      return { message: 'Si ce compte existe, un lien de réinitialisation a été généré.' };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password-reset' },
      { expiresIn: '15m' },
    );

    return {
      message: 'Si ce compte existe, un lien de réinitialisation a été généré.',
      resetToken, // exposé pour la démo/soutenance : en prod, on l'enverrait par email
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    let payload: any;

    try {
      payload = this.jwtService.verify(dto.resetToken);
    } catch {
      throw new BadRequestException('Jeton de réinitialisation invalide ou expiré');
    }

    if (payload.purpose !== 'password-reset') {
      throw new BadRequestException('Jeton de réinitialisation invalide');
    }

    const user = await this.usersRepository.findOne({ where: { id: payload.sub } });

    if (!user || user.email !== dto.email) {
      throw new BadRequestException('Jeton de réinitialisation invalide');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Mot de passe réinitialisé avec succès' };
  }
}
