import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  genre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  image: string;

  @Column({ type: 'int', default: 0 })
  durationMinutes: number;

  @Column({ default: false })
  isNew: boolean;

  @OneToMany(() => Session, (session) => session.movie, { cascade: true })
  sessions: Session[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
