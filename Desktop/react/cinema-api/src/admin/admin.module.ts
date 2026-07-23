import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { MoviesModule } from '../movies/movies.module';
import { CinemasModule } from '../cinemas/cinemas.module';
import { SessionsModule } from '../sessions/sessions.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [UsersModule, MoviesModule, CinemasModule, SessionsModule, ReservationsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
