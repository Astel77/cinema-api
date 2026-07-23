import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
import { CinemasService } from '../cinemas/cinemas.service';
import { SessionsService } from '../sessions/sessions.service';
import { ReservationsService } from '../reservations/reservations.service';
export declare class AdminService {
    private usersService;
    private moviesService;
    private cinemasService;
    private sessionsService;
    private reservationsService;
    constructor(usersService: UsersService, moviesService: MoviesService, cinemasService: CinemasService, sessionsService: SessionsService, reservationsService: ReservationsService);
    getDashboardStats(): Promise<{
        totalUsers: number;
        totalCustomers: number;
        totalMovies: number;
        totalCinemas: number;
        totalSessions: number;
        totalReservations: number;
        totalRevenue: number;
        topMovies: any[];
    }>;
}
