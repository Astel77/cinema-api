import { Session } from '../sessions/session.entity';
export declare class Movie {
    id: string;
    title: string;
    genre: string;
    description: string;
    image: string;
    durationMinutes: number;
    isNew: boolean;
    sessions: Session[];
    createdAt: Date;
    updatedAt: Date;
}
