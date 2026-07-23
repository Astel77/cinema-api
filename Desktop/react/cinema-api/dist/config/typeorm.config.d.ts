import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare const getTypeOrmConfig: (config: ConfigService) => TypeOrmModuleOptions;
