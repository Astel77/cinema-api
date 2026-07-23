import { CinemasService } from './cinemas.service';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinema.dto';
export declare class CinemasController {
    private readonly cinemasService;
    constructor(cinemasService: CinemasService);
    findAll(): Promise<import("./cinema.entity").Cinema[]>;
    findOne(id: string): Promise<import("./cinema.entity").Cinema>;
    create(dto: CreateCinemaDto): Promise<import("./cinema.entity").Cinema>;
    update(id: string, dto: UpdateCinemaDto): Promise<import("./cinema.entity").Cinema>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
