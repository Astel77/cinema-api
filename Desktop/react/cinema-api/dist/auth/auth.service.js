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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/user.entity");
const role_enum_1 = require("../common/enums/role.enum");
let AuthService = class AuthService {
    constructor(usersRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
    }
    buildToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        };
        return this.jwtService.sign(payload);
    }
    sanitize(user) {
        const { password, ...safe } = user;
        return safe;
    }
    async register(dto) {
        const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('Un compte existe déjà avec cet email');
        }
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = this.usersRepository.create({
            fullName: dto.fullName,
            email: dto.email,
            password: hashed,
            role: role_enum_1.Role.USER,
        });
        const saved = await this.usersRepository.save(user);
        return {
            user: this.sanitize(saved),
            accessToken: this.buildToken(saved),
        };
    }
    async login(dto) {
        const user = await this.usersRepository.findOne({ where: { email: dto.email } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        const match = await bcrypt.compare(dto.password, user.password);
        if (!match) {
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        }
        return {
            user: this.sanitize(user),
            accessToken: this.buildToken(user),
        };
    }
    async me(userId) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.sanitize(user);
    }
    async forgotPassword(dto) {
        const user = await this.usersRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            return { message: 'Si ce compte existe, un lien de réinitialisation a été généré.' };
        }
        const resetToken = this.jwtService.sign({ sub: user.id, purpose: 'password-reset' }, { expiresIn: '15m' });
        return {
            message: 'Si ce compte existe, un lien de réinitialisation a été généré.',
            resetToken,
        };
    }
    async resetPassword(dto) {
        let payload;
        try {
            payload = this.jwtService.verify(dto.resetToken);
        }
        catch {
            throw new common_1.BadRequestException('Jeton de réinitialisation invalide ou expiré');
        }
        if (payload.purpose !== 'password-reset') {
            throw new common_1.BadRequestException('Jeton de réinitialisation invalide');
        }
        const user = await this.usersRepository.findOne({ where: { id: payload.sub } });
        if (!user || user.email !== dto.email) {
            throw new common_1.BadRequestException('Jeton de réinitialisation invalide');
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.usersRepository.save(user);
        return { message: 'Mot de passe réinitialisé avec succès' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map