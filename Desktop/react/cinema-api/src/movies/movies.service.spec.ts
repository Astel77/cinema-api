import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './movie.entity';

describe('MoviesService', () => {
  let service: MoviesService;
  let repo: { find: jest.Mock; findOne: jest.Mock; create: jest.Mock; save: jest.Mock; remove: jest.Mock };
  let cache: { get: jest.Mock; set: jest.Mock; del: jest.Mock };

  const sampleMovies = [{ id: '1', title: 'Test Movie' }] as Movie[];

  beforeEach(async () => {
    repo = {
      find: jest.fn().mockResolvedValue(sampleMovies),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };
    cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: repo },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findAll', () => {
    it('interroge la base de données quand le cache est vide', async () => {
      cache.get.mockResolvedValue(undefined);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalledTimes(1);
      expect(cache.set).toHaveBeenCalledWith('movies:all', sampleMovies);
      expect(result).toEqual(sampleMovies);
    });

    it('retourne le cache sans interroger la base de données si présent', async () => {
      cache.get.mockResolvedValue(sampleMovies);

      const result = await service.findAll();

      expect(repo.find).not.toHaveBeenCalled();
      expect(result).toEqual(sampleMovies);
    });
  });

  describe('findOne', () => {
    it('lève une NotFoundException si le film n\'existe pas', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('invalide le cache de la liste après création', async () => {
      repo.create.mockReturnValue(sampleMovies[0]);
      repo.save.mockResolvedValue(sampleMovies[0]);

      await service.create({ title: 'New Movie', genre: 'Action', image: 'x.jpg' });

      expect(cache.del).toHaveBeenCalledWith('movies:all');
    });
  });

  describe('remove', () => {
    it('invalide le cache de la liste après suppression', async () => {
      repo.findOne.mockResolvedValue(sampleMovies[0]);
      repo.remove.mockResolvedValue(sampleMovies[0]);

      await service.remove('1');

      expect(cache.del).toHaveBeenCalledWith('movies:all');
    });
  });
});
