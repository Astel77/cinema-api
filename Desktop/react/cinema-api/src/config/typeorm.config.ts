import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Movie } from '../movies/movie.entity';
import { Session } from '../sessions/session.entity';
import { Cinema } from '../cinemas/cinema.entity';
import { Reservation } from '../reservations/reservation.entity';

export const getTypeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => {
  const entities = [User, Movie, Session, Cinema, Reservation];
  const dbType = config.get<string>('DB_TYPE', 'sqlite');

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: config.get<string>('DB_HOST'),
      port: config.get<number>('DB_PORT'),
      username: config.get<string>('DB_USER'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      entities,
      synchronize: true, // OK pour un projet académique ; utiliser des migrations en prod
      autoLoadEntities: true,
    };
  }

  return {
    type: 'sqlite',
    database: config.get<string>('DB_SQLITE_PATH', 'cinema.sqlite'),
    entities,
    synchronize: true,
    autoLoadEntities: true,
  };
};
