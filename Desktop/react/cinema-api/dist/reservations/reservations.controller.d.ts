import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtPayload } from '../auth/jwt-payload.interface';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    getOccupiedSeats(sessionId: string): Promise<number[]>;
    create(user: JwtPayload, dto: CreateReservationDto): Promise<import("./reservation.entity").Reservation>;
    findMine(user: JwtPayload): Promise<import("./reservation.entity").Reservation[]>;
    findOne(user: JwtPayload, id: string): Promise<import("./reservation.entity").Reservation>;
    cancel(user: JwtPayload, id: string): Promise<{
        message: string;
    }>;
    findAll(): Promise<import("./reservation.entity").Reservation[]>;
}
