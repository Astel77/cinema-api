import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: config.get<string>('FRONTEND_URL', 'http://localhost:5173'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // supprime les champs non déclarés dans les DTO
      forbidNonWhitelisted: true, // rejette les requêtes avec des champs inconnus
      transform: true, // convertit automatiquement les payloads vers les types des DTO
      errorHttpStatusCode: 422,
    }),
  );

  // Retire automatiquement les champs marqués @Exclude() (ex: password) des réponses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pathé Cinéma API')
    .setDescription(
      "API REST du projet Pathé Cinéma — Examen Final NestJS (Auth JWT, RBAC, CRUD films/séances/réservations, API externe).",
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`🎬 Pathé Cinéma API démarrée sur http://localhost:${port}/api`);
  console.log(`📚 Documentation Swagger : http://localhost:${port}/api/docs`);
}

bootstrap();
