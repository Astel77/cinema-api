import { Repository } from 'typeorm';
import { Session } from './session.entity';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
export declare class SessionsService {
    private sessionsRepository;
    constructor(sessionsRepository: Repository<Session>);
    create(dto: CreateSessionDto): Promise<Session>;
    findAll(movieId?: string): Promise<Session[]>;
    findOne(id: string): Promise<Session>;
    update(id: string, dto: UpdateSessionDto): Promise<Session>;
    remove(id: string): Promise<{
        message: string;
    }>;
    countAll(): Promise<number>;
}
