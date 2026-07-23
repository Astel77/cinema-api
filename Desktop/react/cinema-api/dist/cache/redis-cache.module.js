"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisCacheModule = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@nestjs/config");
let RedisCacheModule = class RedisCacheModule {
};
exports.RedisCacheModule = RedisCacheModule;
exports.RedisCacheModule = RedisCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const redisHost = config.get('REDIS_HOST');
                    const ttl = 30_000;
                    if (!redisHost) {
                        return { ttl };
                    }
                    try {
                        const { redisStore } = await Promise.resolve().then(() => require('cache-manager-redis-yet'));
                        const store = await redisStore({
                            socket: {
                                host: redisHost,
                                port: config.get('REDIS_PORT', 6379),
                            },
                            ttl,
                        });
                        return { store, ttl };
                    }
                    catch {
                        return { ttl };
                    }
                },
            }),
        ],
        exports: [cache_manager_1.CacheModule],
    })
], RedisCacheModule);
//# sourceMappingURL=redis-cache.module.js.map