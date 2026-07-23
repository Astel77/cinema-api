import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Role } from '../common/enums/role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    private buildToken;
    private sanitize;
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            role: Role;
            isActive: boolean;
            reservations: import("../reservations/reservation.entity").Reservation[];
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            role: Role;
            isActive: boolean;
            reservations: import("../reservations/reservation.entity").Reservation[];
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    me(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        resetToken?: undefined;
    } | {
        message: string;
        resetToken: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
