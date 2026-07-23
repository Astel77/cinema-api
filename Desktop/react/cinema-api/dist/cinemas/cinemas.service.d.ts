import { Repository } from 'typeorm';
import { Cinema } from './cinema.entity';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinema.dto';
export declare class CinemasService {
    private cinemasRepository;
    constructor(cinemasRepository: Repository<Cinema>);
    create(dto: CreateCinemaDto): Promise<Cinema>;
    findAll(): Promise<Cinema[]>;
    findOne(id: string): Promise<Cinema>;
    update(id: string, dto: UpdateCinemaDto): Promise<Cinema>;
    remove(id: string): Promise<{
        message: string;
    }>;
    countAll(): Promise<number>;
}
