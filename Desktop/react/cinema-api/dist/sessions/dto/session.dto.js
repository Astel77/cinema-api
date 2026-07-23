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
exports.UpdateSessionDto = exports.CreateSessionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSessionDto {
}
exports.CreateSessionDto = CreateSessionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vendredi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le jour est requis' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '18:00' }),
    (0, class_validator_1.IsNotEmpty)({ message: "L'heure est requise" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Salle 1' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La salle est requise' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "room", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "totalSeats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID du film associé' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "movieId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID du cinéma associé' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "cinemaId", void 0);
class UpdateSessionDto extends (0, swagger_1.PartialType)(CreateSessionDto) {
}
exports.UpdateSessionDto = UpdateSessionDto;
//# sourceMappingURL=session.dto.js.map