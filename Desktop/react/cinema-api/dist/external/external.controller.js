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
exports.ExternalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const external_service_1 = require("./external.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
let ExternalController = class ExternalController {
    constructor(externalService) {
        this.externalService = externalService;
    }
    getWeather(city) {
        return this.externalService.getWeather(city);
    }
    getExchangeRates(base) {
        return this.externalService.getExchangeRates(base);
    }
};
exports.ExternalController = ExternalController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('weather'),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false }),
    (0, swagger_1.ApiOperation)({ summary: "Météo actuelle (source : OpenWeather) pour le tableau de bord" }),
    __param(0, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExternalController.prototype, "getWeather", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('exchange-rates'),
    (0, swagger_1.ApiQuery)({ name: 'base', required: false, description: 'Devise de base (défaut: XOF)' }),
    (0, swagger_1.ApiOperation)({ summary: 'Taux de change (source : ExchangeRate-API) pour convertir les prix des billets' }),
    __param(0, (0, common_1.Query)('base')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExternalController.prototype, "getExchangeRates", null);
exports.ExternalController = ExternalController = __decorate([
    (0, swagger_1.ApiTags)('External APIs'),
    (0, common_1.Controller)('external'),
    __metadata("design:paramtypes", [external_service_1.ExternalService])
], ExternalController);
//# sourceMappingURL=external.controller.js.map