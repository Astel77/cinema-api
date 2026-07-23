import { UsersService } from './users.service';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
import { JwtPayload } from '../auth/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: JwtPayload): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMe(user: JwtPayload, dto: UpdateUserDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateRole(id: string, dto: UpdateUserRoleDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, dto: UpdateUserStatusDto): Promise<{
        id: string;
        fullName: string;
        email: string;
        role: Role;
        isActive: boolean;
        reservations: import("../reservations/reservation.entity").Reservation[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
