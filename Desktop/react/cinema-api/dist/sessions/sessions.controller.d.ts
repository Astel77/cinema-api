import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    findAll(movieId?: string): Promise<import("./session.entity").Session[]>;
    findOne(id: string): Promise<import("./session.entity").Session>;
    create(dto: CreateSessionDto): Promise<import("./session.entity").Session>;
    update(id: string, dto: UpdateSessionDto): Promise<import("./session.entity").Session>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
