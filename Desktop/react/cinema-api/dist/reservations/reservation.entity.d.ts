import { User } from '../users/user.entity';
import { Session } from '../sessions/session.entity';
export declare enum ReservationStatus {
    CONFIRMED = "confirmed",
    CANCELLED = "cancelled"
}
export declare class Reservation {
    id: string;
    user: User;
    userId: string;
    session: Session;
    sessionId: string;
    seats: number[];
    total: number;
    status: ReservationStatus;
    ticketId: string;
    createdAt: Date;
    updatedAt: Date;
}
