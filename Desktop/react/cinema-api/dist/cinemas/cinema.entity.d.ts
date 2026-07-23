import { Session } from '../sessions/session.entity';
export declare class Cinema {
    id: string;
    name: string;
    address: string;
    rooms: number;
    sessions: Session[];
    createdAt: Date;
    updatedAt: Date;
}
