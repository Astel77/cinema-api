"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const typeorm_config_1 = require("./config/typeorm.config");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const redis_cache_module_1 = require("./cache/redis-cache.module");
const metrics_module_1 = require("./metrics/metrics.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const movies_module_1 = require("./movies/movies.module");
const cinemas_module_1 = require("./cinemas/cinemas.module");
const sessions_module_1 = require("./sessions/sessions.module");
const reservations_module_1 = require("./reservations/reservations.module");
const external_module_1 = require("./external/external.module");
const admin_module_1 = require("./admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            redis_cache_module_1.RedisCacheModule,
            metrics_module_1.MetricsModule,
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: typeorm_config_1.getTypeOrmConfig,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            movies_module_1.MoviesModule,
            cinemas_module_1.CinemasModule,
            sessions_module_1.SessionsModule,
            reservations_module_1.ReservationsModule,
            external_module_1.ExternalModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map