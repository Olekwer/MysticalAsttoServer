import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../common/database/prisma.service';
import { EmailService } from '../../common/email/email.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { MagicLinkDto } from './dto/magic-link.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto, language?: string) {
    const { email, password, ...userData } = createUserDto;

    // Проверяем, существует ли пользователь
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

    // Создаем пользователя
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        ...userData,
      },
    });

    // Создаем профиль
    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
      },
    });

    // Отправляем приветственное письмо
    await this.emailService.sendWelcomeEmail(email, user.firstName, language || 'en');

    // Генерируем токены
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        zodiacSign: user.zodiacSign,
        element: user.element,
        isPremium: user.isPremium,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        zodiacSign: user.zodiacSign,
        element: user.element,
        isPremium: user.isPremium,
      },
      ...tokens,
    };
  }

  async sendMagicLink(magicLinkDto: MagicLinkDto, language?: string) {
    const { email } = magicLinkDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    // Генерируем токен для magic link
    const token = await this.generateMagicLinkToken(user.id);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

    // Сохраняем токен в базе
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        magicLinkToken: token,
        magicLinkExpires: expiresAt,
      },
    });

    // Отправляем email
    const magicLink = `${this.configService.get('APP_URL')}/auth/magic-link?token=${token}`;
    
    await this.emailService.sendMagicLink(email, magicLink, language || 'en');

    return { message: 'Magic link отправлен на ваш email' };
  }

  async verifyMagicLink(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        magicLinkToken: token,
        magicLinkExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Недействительный или истекший токен');
    }

    // Очищаем токен
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        magicLinkToken: null,
        magicLinkExpires: null,
        isEmailVerified: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        zodiacSign: user.zodiacSign,
        element: user.element,
        isPremium: user.isPremium,
      },
      ...tokens,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return tokens;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      zodiacSign: user.zodiacSign,
      element: user.element,
      isPremium: user.isPremium,
    };
  }

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: this.configService.get('JWT_SECRET') }
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { 
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d'
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateMagicLinkToken(userId: string): Promise<string> {
    const randomBytes = crypto.randomBytes(32);
    return randomBytes.toString('hex');
  }
} 