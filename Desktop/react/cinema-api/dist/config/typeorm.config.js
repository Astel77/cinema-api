"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeOrmConfig = void 0;
const user_entity_1 = require("../users/user.entity");
const movie_entity_1 = require("../movies/movie.entity");
const session_entity_1 = require("../sessions/session.entity");
const cinema_entity_1 = require("../cinemas/cinema.entity");
const reservation_entity_1 = require("../reservations/reservation.entity");
const getTypeOrmConfig = (config) => {
    const entities = [user_entity_1.User, movie_entity_1.Movie, session_entity_1.Session, cinema_entity_1.Cinema, reservation_entity_1.Reservation];
    const dbType = config.get('DB_TYPE', 'sqlite');
    if (dbType === 'postgres') {
        return {
            type: 'postgres',
            host: config.get('DB_HOST'),
            port: config.get('DB_PORT'),
            username: config.get('DB_USER'),
            password: config.get('DB_PASSWORD'),
            database: config.get('DB_NAME'),
            entities,
            synchronize: true,
            autoLoadEntities: true,
        };
    }
    return {
        type: 'sqlite',
        database: config.get('DB_SQLITE_PATH', 'cinema.sqlite'),
        entities,
        synchronize: true,
        autoLoadEntities: true,
    };
};
exports.getTypeOrmConfig = getTypeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map