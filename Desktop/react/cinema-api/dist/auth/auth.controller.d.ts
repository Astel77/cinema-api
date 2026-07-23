import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { JwtPayload } from './jwt-payload.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            fullName: string;
            email: string;
            role: import("../common/enums/role.enum").Role;
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
            role: import("../common/enums/role.enum").Role;
            isActive: boolean;
            reservations: import("../reservations/reservation.entity").Reservation[];
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
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
    me(user: JwtPayload): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: import("../common/enums/role.enum").Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
}
