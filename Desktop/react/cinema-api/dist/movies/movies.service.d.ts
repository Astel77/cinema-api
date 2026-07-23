import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';
export declare class MoviesService {
    private moviesRepository;
    private cache;
    constructor(moviesRepository: Repository<Movie>, cache: Cache);
    create(dto: CreateMovieDto): Promise<Movie>;
    findAll(): Promise<Movie[]>;
    findOne(id: string): Promise<Movie>;
    update(id: string, dto: UpdateMovieDto): Promise<Movie>;
    remove(id: string): Promise<{
        message: string;
    }>;
    countAll(): Promise<number>;
    private invalidateListCache;
}
