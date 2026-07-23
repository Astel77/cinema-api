"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: config.get('FRONTEND_URL', 'http://localhost:5173'),
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        errorHttpStatusCode: 422,
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Pathé Cinéma API')
        .setDescription("API REST du projet Pathé Cinéma — Examen Final NestJS (Auth JWT, RBAC, CRUD films/séances/réservations, API externe).")
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = config.get('PORT', 3000);
    await app.listen(port);
    console.log(`🎬 Pathé Cinéma API démarrée sur http://localhost:${port}/api`);
    console.log(`📚 Documentation Swagger : http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map