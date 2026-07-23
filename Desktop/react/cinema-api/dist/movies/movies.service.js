"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("./movie.entity");
const MOVIES_LIST_CACHE_KEY = 'movies:all';
let MoviesService = class MoviesService {
    constructor(moviesRepository, cache) {
        this.moviesRepository = moviesRepository;
        this.cache = cache;
    }
    async create(dto) {
        const movie = this.moviesRepository.create(dto);
        const saved = await this.moviesRepository.save(movie);
        await this.invalidateListCache();
        return saved;
    }
    async findAll() {
        const cached = await this.cache.get(MOVIES_LIST_CACHE_KEY);
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
    async findOne(id) {
        const movie = await this.moviesRepository.findOne({
            where: { id },
            relations: ['sessions', 'sessions.cinema'],
        });
        if (!movie) {
            throw new common_1.NotFoundException('Film introuvable');
        }
        return movie;
    }
    async update(id, dto) {
        const movie = await this.findOne(id);
        Object.assign(movie, dto);
        const saved = await this.moviesRepository.save(movie);
        await this.invalidateListCache();
        return saved;
    }
    async remove(id) {
        const movie = await this.findOne(id);
        await this.moviesRepository.remove(movie);
        await this.invalidateListCache();
        return { message: 'Film supprimé' };
    }
    countAll() {
        return this.moviesRepository.count();
    }
    async invalidateListCache() {
        await this.cache.del(MOVIES_LIST_CACHE_KEY);
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [typeorm_2.Repository, Object])
], MoviesService);
//# sourceMappingURL=movies.service.js.map