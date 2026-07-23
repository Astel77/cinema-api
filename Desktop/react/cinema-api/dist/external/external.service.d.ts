import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class ExternalService {
    private readonly http;
    private readonly config;
    private readonly logger;
    constructor(http: HttpService, config: ConfigService);
    getWeather(city?: string): Promise<{
        city: string;
        available: boolean;
        message: string;
        country?: undefined;
        temperature?: undefined;
        feelsLike?: undefined;
        description?: undefined;
        icon?: undefined;
        humidity?: undefined;
        windSpeed?: undefined;
    } | {
        city: any;
        country: any;
        temperature: any;
        feelsLike: any;
        description: any;
        icon: any;
        humidity: any;
        windSpeed: any;
        available: boolean;
        message?: undefined;
    }>;
    getExchangeRates(base?: string): Promise<{
        base: any;
        lastUpdate: any;
        rates: {
            USD: any;
            EUR: any;
            GBP: any;
        };
    }>;
}
