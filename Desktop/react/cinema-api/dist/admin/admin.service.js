"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const movies_service_1 = require("../movies/movies.service");
const cinemas_service_1 = require("../cinemas/cinemas.service");
const sessions_service_1 = require("../sessions/sessions.service");
const reservations_service_1 = require("../reservations/reservations.service");
const role_enum_1 = require("../common/enums/role.enum");
let AdminService = class AdminService {
    constructor(usersService, moviesService, cinemasService, sessionsService, reservationsService) {
        this.usersService = usersService;
        this.moviesService = moviesService;
        this.cinemasService = cinemasService;
        this.sessionsService = sessionsService;
        this.reservationsService = reservationsService;
    }
    async getDashboardStats() {
        const [totalUsers, totalCustomers, totalMovies, totalCinemas, totalSessions, totalReservations, totalRevenue, topMovies,] = await Promise.all([
            this.usersService.countAll(),
            this.usersService.countByRole(role_enum_1.Role.USER),
            this.moviesService.countAll(),
            this.cinemasService.countAll(),
            this.sessionsService.countAll(),
            this.reservationsService.countAll(),
            this.reservationsService.totalRevenue(),
            this.reservationsService.topMovies(5),
        ]);
        return {
            totalUsers,
            totalCustomers,
            totalMovies,
            totalCinemas,
            totalSessions,
            totalReservations,
            totalRevenue,
            topMovies,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        movies_service_1.MoviesService,
        cinemas_service_1.CinemasService,
        sessions_service_1.SessionsService,
        reservations_service_1.ReservationsService])
], AdminService);
//# sourceMappingURL=admin.service.js.map