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
exports.CinemasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cinema_entity_1 = require("./cinema.entity");
let CinemasService = class CinemasService {
    constructor(cinemasRepository) {
        this.cinemasRepository = cinemasRepository;
    }
    create(dto) {
        const cinema = this.cinemasRepository.create(dto);
        return this.cinemasRepository.save(cinema);
    }
    findAll() {
        return this.cinemasRepository.find({ order: { name: 'ASC' } });
    }
    async findOne(id) {
        const cinema = await this.cinemasRepository.findOne({ where: { id } });
        if (!cinema) {
            throw new common_1.NotFoundException('Cinéma introuvable');
        }
        return cinema;
    }
    async update(id, dto) {
        const cinema = await this.findOne(id);
        Object.assign(cinema, dto);
        return this.cinemasRepository.save(cinema);
    }
    async remove(id) {
        const cinema = await this.findOne(id);
        await this.cinemasRepository.remove(cinema);
        return { message: 'Cinéma supprimé' };
    }
    countAll() {
        return this.cinemasRepository.count();
    }
};
exports.CinemasService = CinemasService;
exports.CinemasService = CinemasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cinema_entity_1.Cinema)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CinemasService);
//# sourceMappingURL=cinemas.service.js.map