import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MagicLinkDto {
  @ApiProperty({
    description: 'Email пользователя для отправки magic link',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
} 