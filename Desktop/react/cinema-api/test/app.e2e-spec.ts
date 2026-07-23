import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Cinema API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const email = `test.${Date.now()}@example.com`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/movies (GET) - liste publique des films', () => {
    return request(app.getHttpServer()).get('/api/movies').expect(200);
  });

  it('/api/auth/register (POST) - crée un compte', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ fullName: 'Test User', email, password: 'Password123!' })
      .expect(201);

    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  it('/api/auth/login (POST) - échoue avec un mauvais mot de passe', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'wrong-password' })
      .expect(401);
  });

  it('/api/users/me (GET) - nécessite un token valide', () => {
    return request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('/api/users (GET) - refuse un utilisateur non-admin (RBAC)', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });
});
