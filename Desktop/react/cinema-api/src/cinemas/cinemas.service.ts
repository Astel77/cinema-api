import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cinema } from './cinema.entity';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinema.dto';

@Injectable()
export class CinemasService {
  constructor(@InjectRepository(Cinema) private cinemasRepository: Repository<Cinema>) {}

  create(dto: CreateCinemaDto) {
    const cinema = this.cinemasRepository.create(dto);
    return this.cinemasRepository.save(cinema);
  }

  findAll() {
    return this.cinemasRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const cinema = await this.cinemasRepository.findOne({ where: { id } });
    if (!cinema) {
      throw new NotFoundException('Cinéma introuvable');
    }
    return cinema;
  }

  async update(id: string, dto: UpdateCinemaDto) {
    const cinema = await this.findOne(id);
    Object.assign(cinema, dto);
    return this.cinemasRepository.save(cinema);
  }

  async remove(id: string) {
    const cinema = await this.findOne(id);
    await this.cinemasRepository.remove(cinema);
    return { message: 'Cinéma supprimé' };
  }

  countAll() {
    return this.cinemasRepository.count();
  }
}
