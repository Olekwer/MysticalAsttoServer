import { IsEmail, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodiacSign, Element } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'User password (optional for magic link)',
    example: 'password123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Birth date',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Birth time',
    example: '12:00',
  })
  @IsOptional()
  @IsString()
  birthTime?: string;

  @ApiPropertyOptional({
    description: 'Birth place',
    example: 'New York, USA',
  })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({
    description: 'Zodiac sign',
    enum: ZodiacSign,
    example: ZodiacSign.ARIES,
  })
  @IsOptional()
  @IsEnum(ZodiacSign)
  zodiacSign?: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Element',
    enum: Element,
    example: Element.FIRE,
  })
  @IsOptional()
  @IsEnum(Element)
  element?: Element;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'America/New_York',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Language',
    example: 'en',
    default: 'en',
  })
  @IsOptional()
  @IsString()
  language?: string;
}
