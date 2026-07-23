import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCinemaDto {
  @ApiProperty({ example: 'CINÉMA Pathé' })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Dakar' })
  @IsNotEmpty({ message: "L'adresse est requise" })
  @IsString()
  address: string;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(1)
  rooms: number;
}

export class UpdateCinemaDto extends PartialType(CreateCinemaDto) {}
