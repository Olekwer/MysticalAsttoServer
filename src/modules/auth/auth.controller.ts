import { Controller, Post, Body, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { MagicLinkDto } from './dto/magic-link.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { I18nService } from '../../common/i18n/i18n.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly i18nService: I18nService, // Временно отключен
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid data or user already exists' })
  async register(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    // const language = this.i18nService.detectLanguage(req);
    const language = 'en'; // Временный язык
    return this.authService.register(createUserDto, language);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login to system' })
  @ApiResponse({ status: 200, description: 'Successful login' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('magic-link')
  @ApiOperation({ summary: 'Send magic link' })
  @ApiResponse({ status: 200, description: 'Magic link sent to email' })
  @ApiResponse({ status: 400, description: 'User not found' })
  async sendMagicLink(@Body() magicLinkDto: MagicLinkDto, @Req() req: any) {
    // const language = this.i18nService.detectLanguage(req);
    const language = 'en'; // Временный язык
    return this.authService.sendMagicLink(magicLinkDto, language);
  }

  @Get('magic-link/verify')
  @ApiOperation({ summary: 'Verify magic link' })
  @ApiResponse({ status: 200, description: 'Magic link verified' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyMagicLink(@Query('token') token: string) {
    return this.authService.verifyMagicLink(token);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user.id);
  }
} 