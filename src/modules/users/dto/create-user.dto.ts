import { IsEmail, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ZodiacSign, Element } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Пароль пользователя (опционально для magic link)',
    example: 'password123',
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    description: 'Имя пользователя',
    example: 'Иван',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Фамилия пользователя',
    example: 'Иванов',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Дата рождения',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    description: 'Время рождения',
    example: '12:00',
  })
  @IsOptional()
  @IsString()
  birthTime?: string;

  @ApiPropertyOptional({
    description: 'Место рождения',
    example: 'Москва, Россия',
  })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({
    description: 'Знак зодиака',
    enum: ZodiacSign,
    example: ZodiacSign.ARIES,
  })
  @IsOptional()
  @IsEnum(ZodiacSign)
  zodiacSign?: ZodiacSign;

  @ApiPropertyOptional({
    description: 'Элемент',
    enum: Element,
    example: Element.FIRE,
  })
  @IsOptional()
  @IsEnum(Element)
  element?: Element;

  @ApiPropertyOptional({
    description: 'Часовой пояс',
    example: 'Europe/Moscow',
    default: 'UTC',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Язык',
    example: 'ru',
    default: 'ru',
  })
  @IsOptional()
  @IsString()
  language?: string;
} 