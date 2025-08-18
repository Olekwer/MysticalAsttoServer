import { IsString, IsNotEmpty, IsDateString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NatalChartDto {
  @ApiProperty({
    description: 'Birth date in YYYY-MM-DD format',
    example: '1990-05-15',
    type: String
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate!: string;

  @ApiProperty({
    description: 'Birth time in HH:MM format',
    example: '14:30',
    type: String
  })
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:MM format (e.g., 14:30)'
  })
  birthTime!: string;

  @ApiProperty({
    description: 'Birth place (city, country)',
    example: 'Moscow, Russia',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  birthPlace!: string;
}
