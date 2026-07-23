import { Role } from '../common/enums/role.enum';
import { Reservation } from '../reservations/reservation.entity';
export declare class User {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: Role;
    isActive: boolean;
    reservations: Reservation[];
    createdAt: Date;
    updatedAt: Date;
}
