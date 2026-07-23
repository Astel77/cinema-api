import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Public } from '../common/decorators/public.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Public()
  @Get('occupied-seats')
  @ApiOperation({ summary: "Sièges déjà occupés pour une séance (public, pour l'affichage du plan de salle)" })
  getOccupiedSeats(@Query('sessionId') sessionId: string) {
    return this.reservationsService.getOccupiedSeats(sessionId);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une réservation (utilisateur connecté)' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateReservationDto) {
    return this.reservationsService.create(user.sub, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Mes réservations' })
  findMine(@CurrentUser() user: JwtPayload) {
    return this.reservationsService.findMine(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détails d'une réservation (propriétaire ou admin)" })
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.reservationsService.findOne(id, { sub: user.sub, role: user.role });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation (propriétaire ou admin)' })
  cancel(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.reservationsService.cancel(id, { sub: user.sub, role: user.role });
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Toutes les réservations' })
  findAll() {
    return this.reservationsService.findAll();
  }
}
