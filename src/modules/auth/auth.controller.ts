import { Controller, Post, Body, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { MagicLinkDto } from './dto/magic-link.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { I18nService } from '../../common/i18n/i18n.service';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly i18nService: I18nService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({ status: 400, description: 'Неверные данные или пользователь уже существует' })
  async register(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const language = this.i18nService.detectLanguage(req);
    return this.authService.register(createUserDto, language);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiResponse({ status: 200, description: 'Успешный вход' })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('magic-link')
  @ApiOperation({ summary: 'Отправка magic link' })
  @ApiResponse({ status: 200, description: 'Magic link отправлен на email' })
  @ApiResponse({ status: 400, description: 'Пользователь не найден' })
  async sendMagicLink(@Body() magicLinkDto: MagicLinkDto, @Req() req: any) {
    const language = this.i18nService.detectLanguage(req);
    return this.authService.sendMagicLink(magicLinkDto, language);
  }

  @Get('magic-link/verify')
  @ApiOperation({ summary: 'Подтверждение magic link' })
  @ApiResponse({ status: 200, description: 'Magic link подтвержден' })
  @ApiResponse({ status: 400, description: 'Недействительный или истекший токен' })
  async verifyMagicLink(@Query('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление токена' })
  @ApiResponse({ status: 200, description: 'Токен обновлен' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  async refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user.id);
  }
} 