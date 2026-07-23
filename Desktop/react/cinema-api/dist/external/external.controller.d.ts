import { ExternalService } from './external.service';
export declare class ExternalController {
    private readonly externalService;
    constructor(externalService: ExternalService);
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
