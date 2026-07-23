import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CinemasService } from './cinemas.service';
import { CreateCinemaDto, UpdateCinemaDto } from './dto/cinema.dto';
import { Public } from '../common/decorators/public.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Cinemas')
@Controller('cinemas')
export class CinemasController {
  constructor(private readonly cinemasService: CinemasService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les salles de cinéma (public)' })
  findAll() {
    return this.cinemasService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: "Détails d'un cinéma (public)" })
  findOne(@Param('id') id: string) {
    return this.cinemasService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: '[Admin] Créer un cinéma' })
  create(@Body() dto: CreateCinemaDto) {
    return this.cinemasService.create(dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Modifier un cinéma' })
  update(@Param('id') id: string, @Body() dto: UpdateCinemaDto) {
    return this.cinemasService.update(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Supprimer un cinéma' })
  remove(@Param('id') id: string) {
    return this.cinemasService.remove(id);
  }
}
