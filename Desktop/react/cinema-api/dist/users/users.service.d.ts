import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto, UpdateUserRoleDto, UpdateUserStatusDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    private sanitize;
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
    private findEntity;
    updateProfile(id: string, dto: UpdateUserDto): Promise<{
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
    countByRole(role: Role): Promise<number>;
    countAll(): Promise<number>;
}
