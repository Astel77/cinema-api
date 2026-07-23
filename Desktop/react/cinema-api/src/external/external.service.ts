import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalService {
  private readonly logger = new Logger('ExternalAPI');

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Météo actuelle pour le tableau de bord (API externe : OpenWeather).
   * Documentation : https://openweathermap.org/current
   */
  async getWeather(city?: string) {
    const apiKey = this.config.get<string>('OPENWEATHER_API_KEY');
    const targetCity = city || this.config.get<string>('OPENWEATHER_DEFAULT_CITY', 'Dakar');

    if (!apiKey || apiKey === 'your_openweather_api_key_here') {
      // Permet de démarrer le projet sans clé, avec une réponse de repli claire
      return {
        city: targetCity,
        available: false,
        message:
          "Clé OPENWEATHER_API_KEY non configurée dans le .env. Ajoutez une clé gratuite sur openweathermap.org pour activer la météo en direct.",
      };
    }

    try {
      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const { data } = await firstValueFrom(
        this.http.get(url, {
          params: { q: targetCity, appid: apiKey, units: 'metric', lang: 'fr' },
        }),
      );

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
    } catch (err) {
      this.logger.error('Erreur OpenWeather', err?.message);
      throw new ServiceUnavailableException("Impossible de récupérer la météo pour le moment");
    }
  }

  /**
   * Taux de change (API externe : ExchangeRate-API, gratuite et sans clé).
   * Utile pour convertir le prix des billets (FCFA) vers d'autres devises.
   */
  async getExchangeRates(base = 'XOF') {
    try {
      const url = `https://open.er-api.com/v6/latest/${base}`;
      const { data } = await firstValueFrom(this.http.get(url));

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
    } catch (err) {
      this.logger.error('Erreur ExchangeRate-API', err?.message);
      throw new ServiceUnavailableException(
        'Impossible de récupérer les taux de change pour le moment',
      );
    }
  }
}
