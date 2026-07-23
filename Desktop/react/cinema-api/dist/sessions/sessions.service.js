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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const session_entity_1 = require("./session.entity");
let SessionsService = class SessionsService {
    constructor(sessionsRepository) {
        this.sessionsRepository = sessionsRepository;
    }
    create(dto) {
        const session = this.sessionsRepository.create(dto);
        return this.sessionsRepository.save(session);
    }
    findAll(movieId) {
        return this.sessionsRepository.find({
            where: movieId ? { movieId } : {},
            relations: ['movie', 'cinema'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const session = await this.sessionsRepository.findOne({
            where: { id },
            relations: ['movie', 'cinema'],
        });
        if (!session) {
            throw new common_1.NotFoundException('Séance introuvable');
        }
        return session;
    }
    async update(id, dto) {
        const session = await this.findOne(id);
        Object.assign(session, dto);
        return this.sessionsRepository.save(session);
    }
    async remove(id) {
        const session = await this.findOne(id);
        await this.sessionsRepository.remove(session);
        return { message: 'Séance supprimée' };
    }
    countAll() {
        return this.sessionsRepository.count();
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map