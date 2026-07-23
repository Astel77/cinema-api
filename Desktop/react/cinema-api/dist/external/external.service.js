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
exports.ExternalService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let ExternalService = class ExternalService {
    constructor(http, config) {
        this.http = http;
        this.config = config;
        this.logger = new common_1.Logger('ExternalAPI');
    }
    async getWeather(city) {
        const apiKey = this.config.get('OPENWEATHER_API_KEY');
        const targetCity = city || this.config.get('OPENWEATHER_DEFAULT_CITY', 'Dakar');
        if (!apiKey || apiKey === 'your_openweather_api_key_here') {
            return {
                city: targetCity,
                available: false,
                message: "Clé OPENWEATHER_API_KEY non configurée dans le .env. Ajoutez une clé gratuite sur openweathermap.org pour activer la météo en direct.",
            };
        }
        try {
            const url = 'https://api.openweathermap.org/data/2.5/weather';
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.get(url, {
                params: { q: targetCity, appid: apiKey, units: 'metric', lang: 'fr' },
            }));
            return {
                city: data.name,
                country: data.sys?.country,
                temperature: data.main?.temp,
                feelsLike: data.main?.feels_like,
                description: data.weather?.[0]?.description,
                icon: data.weather?.[0]?.icon,
                humidity: data.main?.humidity,
                windSpeed: data.wind?.speed,
                available: true,
            };
        }
        catch (err) {
            this.logger.error('Erreur OpenWeather', err?.message);
            throw new common_1.ServiceUnavailableException("Impossible de récupérer la météo pour le moment");
        }
    }
    async getExchangeRates(base = 'XOF') {
        try {
            const url = `https://open.er-api.com/v6/latest/${base}`;
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.get(url));
            if (data.result !== 'success') {
                throw new Error('Réponse invalide de ExchangeRate-API');
            }
            return {
                base: data.base_code,
                lastUpdate: data.time_last_update_utc,
                rates: {
                    USD: data.rates?.USD,
                    EUR: data.rates?.EUR,
                    GBP: data.rates?.GBP,
                },
            };
        }
        catch (err) {
            this.logger.error('Erreur ExchangeRate-API', err?.message);
            throw new common_1.ServiceUnavailableException('Impossible de récupérer les taux de change pour le moment');
        }
    }
};
exports.ExternalService = ExternalService;
exports.ExternalService = ExternalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ExternalService);
//# sourceMappingURL=external.service.js.map