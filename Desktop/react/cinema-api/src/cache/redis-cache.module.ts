import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Module de cache global (Redis).
 *
 * En développement, si REDIS_HOST n'est pas configuré ou si Redis est
 * injoignable, NestJS retombe automatiquement sur un cache en mémoire
 * (comportement par défaut de @nestjs/cache-manager) pour que l'application
 * démarre quand même. C'est volontaire pour ne jamais bloquer un étudiant
 * qui n'a pas encore lancé son conteneur Redis.
 *
 * Le type de retour est annoté `Promise<any>` volontairement : les deux
 * branches (cache mémoire vs store Redis) renvoient des formes d'objet
 * différentes, et la définition de type de @nestjs/cache-manager n'arrive
 * pas à unifier les deux automatiquement. `any` ici est un choix pragmatique
 * pour de la config d'infrastructure, pas une perte de sécurité de type sur
 * la logique métier de l'application.
 */
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<any> => {
        const redisHost = config.get<string>('REDIS_HOST');
        const ttl = 30_000; // 30s : les listes publiques (films, cinémas) changent rarement

        if (!redisHost) {
          // Pas de Redis configuré → cache en mémoire (dev local sans Docker)
          return { ttl };
        }

        try {
          // Import dynamique : si le paquet ou le serveur Redis n'est pas
          // disponible, on retombe sur le cache mémoire au lieu de planter.
          const { redisStore } = await import('cache-manager-redis-yet');
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: config.get<number>('REDIS_PORT', 6379),
            },
            ttl,
          });
          return { store, ttl };
        } catch {
          return { ttl };
        }
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}