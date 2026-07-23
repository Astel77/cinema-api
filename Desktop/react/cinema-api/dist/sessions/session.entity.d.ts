import { Movie } from '../movies/movie.entity';
import { Cinema } from '../cinemas/cinema.entity';
import { Reservation } from '../reservations/reservation.entity';
export declare class Session {
    id: string;
    day: string;
    time: string;
    room: string;
    price: number;
    totalSeats: number;
    movie: Movie;
    movieId: string;
    cinema: Cinema;
    cinemaId: string;
    reservations: Reservation[];
    createdAt: Date;
    updatedAt: Date;
}
