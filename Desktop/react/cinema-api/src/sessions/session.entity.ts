import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Movie } from '../movies/movie.entity';
import { Cinema } from '../cinemas/cinema.entity';
import { Reservation } from '../reservations/reservation.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  day: string;

  @Column()
  time: string;

  @Column()
  room: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int', default: 50 })
  totalSeats: number;

  @ManyToOne(() => Movie, (movie) => movie.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movieId' })
  movie: Movie;

  @Column()
  movieId: string;

  @ManyToOne(() => Cinema, (cinema) => cinema.sessions, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'cinemaId' })
  cinema: Cinema;

  @Column({ nullable: true })
  cinemaId: string;

  @OneToMany(() => Reservation, (reservation) => reservation.session)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
