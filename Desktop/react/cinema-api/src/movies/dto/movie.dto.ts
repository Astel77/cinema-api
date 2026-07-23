import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ example: 'Avengers Endgame' })
  @IsNotEmpty({ message: 'Le titre est requis' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Action' })
  @IsNotEmpty({ message: 'Le genre est requis' })
  @IsString()
  genre: string;

  @ApiPropertyOptional({ example: "Résumé du film..." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'https://picsum.photos/300/450' })
  @IsNotEmpty({ message: "L'image est requise" })
  @IsString()
  image: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}

export class UpdateMovieDto extends PartialType(CreateMovieDto) {}
