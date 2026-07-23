import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'Vendredi' })
  @IsNotEmpty({ message: 'Le jour est requis' })
  @IsString()
  day: string;

  @ApiProperty({ example: '18:00' })
  @IsNotEmpty({ message: "L'heure est requise" })
  @IsString()
  time: string;

  @ApiProperty({ example: 'Salle 1' })
  @IsNotEmpty({ message: 'La salle est requise' })
  @IsString()
  room: string;

  @ApiProperty({ example: 5000 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalSeats?: number;

  @ApiProperty({ description: 'ID du film associé' })
  @IsUUID()
  movieId: string;

  @ApiPropertyOptional({ description: 'ID du cinéma associé' })
  @IsOptional()
  @IsUUID()
  cinemaId?: string;
}

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
