import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { JwtPayload } from '../jwt-payload.interface';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersRepository;
    constructor(config: ConfigService, usersRepository: Repository<User>);
    validate(payload: JwtPayload): Promise<{
        sub: string;
        id: string;
        email: string;
        role: import("../../common/enums/role.enum").Role;
        fullName: string;
    }>;
}
export {};
