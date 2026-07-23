import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
import { CinemasService } from '../cinemas/cinemas.service';
import { SessionsService } from '../sessions/sessions.service';
import { ReservationsService } from '../reservations/reservations.service';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    private usersService: UsersService,
    private moviesService: MoviesService,
    private cinemasService: CinemasService,
    private sessionsService: SessionsService,
    private reservationsService: ReservationsService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalCustomers,
      totalMovies,
      totalCinemas,
      totalSessions,
      totalReservations,
      totalRevenue,
      topMovies,
    ] = await Promise.all([
      this.usersService.countAll(),
      this.usersService.countByRole(Role.USER),
      this.moviesService.countAll(),
      this.cinemasService.countAll(),
      this.sessionsService.countAll(),
      this.reservationsService.countAll(),
      this.reservationsService.totalRevenue(),
      this.reservationsService.topMovies(5),
    ]);

    return {
      totalUsers,
      totalCustomers,
      totalMovies,
      totalCinemas,
      totalSessions,
      totalReservations,
      totalRevenue,
      topMovies,
    };
  }
}
