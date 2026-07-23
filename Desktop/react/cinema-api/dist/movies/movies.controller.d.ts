import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';
export declare class MoviesController {
    private readonly moviesService;
    constructor(moviesService: MoviesService);
    findAll(): Promise<import("./movie.entity").Movie[]>;
    findOne(id: string): Promise<import("./movie.entity").Movie>;
    create(dto: CreateMovieDto): Promise<import("./movie.entity").Movie>;
    update(id: string, dto: UpdateMovieDto): Promise<import("./movie.entity").Movie>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
