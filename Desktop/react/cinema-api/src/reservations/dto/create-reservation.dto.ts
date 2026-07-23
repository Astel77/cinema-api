import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsArray, IsInt, IsUUID, Min } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ description: 'ID de la séance réservée' })
  @IsUUID()
  sessionId: string;

  @ApiProperty({ example: [12, 13, 14], description: 'Numéros de sièges choisis' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Sélectionnez au moins un siège' })
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(1, { each: true })
  seats: number[];
}
