import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(@InjectRepository(Session) private sessionsRepository: Repository<Session>) {}

  create(dto: CreateSessionDto) {
    const session = this.sessionsRepository.create(dto);
    return this.sessionsRepository.save(session);
  }

  findAll(movieId?: string) {
    return this.sessionsRepository.find({
      where: movieId ? { movieId } : {},
      relations: ['movie', 'cinema'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const session = await this.sessionsRepository.findOne({
      where: { id },
      relations: ['movie', 'cinema'],
    });
    if (!session) {
      throw new NotFoundException('Séance introuvable');
    }
    return session;
  }

  async update(id: string, dto: UpdateSessionDto) {
    const session = await this.findOne(id);
    Object.assign(session, dto);
    return this.sessionsRepository.save(session);
  }

  async remove(id: string) {
    const session = await this.findOne(id);
    await this.sessionsRepository.remove(session);
    return { message: 'Séance supprimée' };
  }

  countAll() {
    return this.sessionsRepository.count();
  }
}
