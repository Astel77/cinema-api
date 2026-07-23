import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExternalService } from './external.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('External APIs')
@Controller('external')
export class ExternalController {
  constructor(private readonly externalService: ExternalService) {}

  @Public()
  @Get('weather')
  @ApiQuery({ name: 'city', required: false })
  @ApiOperation({ summary: "Météo actuelle (source : OpenWeather) pour le tableau de bord" })
  getWeather(@Query('city') city?: string) {
    return this.externalService.getWeather(city);
  }

  @Public()
  @Get('exchange-rates')
  @ApiQuery({ name: 'base', required: false, description: 'Devise de base (défaut: XOF)' })
  @ApiOperation({ summary: 'Taux de change (source : ExchangeRate-API) pour convertir les prix des billets' })
  getExchangeRates(@Query('base') base?: string) {
    return this.externalService.getExchangeRates(base);
  }
}
