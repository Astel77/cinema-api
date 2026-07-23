import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';

const MOVIES_LIST_CACHE_KEY = 'movies:all';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  async create(dto: CreateMovieDto) {
    const movie = this.moviesRepository.create(dto);
    const saved = await this.moviesRepository.save(movie);
    await this.invalidateListCache();
    return saved;
  }

  /**
   * Liste publique des films — mise en cache (Redis si disponible, sinon
   * mémoire) car c'est l'endpoint le plus consulté et les films changent peu.
   */
  async findAll() {
    const cached = await this.cache.get<Movie[]>(MOVIES_LIST_CACHE_KEY);
    if (cached) {
      return cached;
    }

    const movies = await this.moviesRepository.find({
      relations: ['sessions', 'sessions.cinema'],
      order: { createdAt: 'DESC' },
    });

    await this.cache.set(MOVIES_LIST_CACHE_KEY, movies);
    return movies;
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findOne({
      where: { id },
      relations: ['sessions', 'sessions.cinema'],
    });
    if (!movie) {
      throw new NotFoundException('Film introuvable');
    }
    return movie;
  }

  async update(id: string, dto: UpdateMovieDto) {
    const movie = await this.findOne(id);
    Object.assign(movie, dto);
    const saved = await this.moviesRepository.save(movie);
    await this.invalidateListCache();
    return saved;
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
    await this.invalidateListCache();
    return { message: 'Film supprimé' };
  }

  countAll() {
    return this.moviesRepository.count();
  }

  /** Invalide le cache dès qu'un film est créé/modifié/supprimé (admin) */
  private async invalidateListCache() {
    await this.cache.del(MOVIES_LIST_CACHE_KEY);
  }
}
