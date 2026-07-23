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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const client = require("prom-client");
let MetricsService = class MetricsService {
    constructor() {
        this.registry = new client.Registry();
        client.collectDefaultMetrics({ register: this.registry, prefix: 'cinema_api_' });
        this.httpRequestsTotal = new client.Counter({
            name: 'cinema_api_http_requests_total',
            help: "Nombre total de requêtes HTTP reçues par l'API",
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.registry],
        });
        this.httpRequestDuration = new client.Histogram({
            name: 'cinema_api_http_request_duration_seconds',
            help: 'Durée des requêtes HTTP en secondes',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
            registers: [this.registry],
        });
    }
    recordRequest(method, route, statusCode, durationSeconds) {
        const labels = { method, route, status_code: String(statusCode) };
        this.httpRequestsTotal.inc(labels);
        this.httpRequestDuration.observe(labels, durationSeconds);
    }
    async getMetrics() {
        return this.registry.metrics();
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map