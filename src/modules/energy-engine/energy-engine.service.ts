import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { AstroService } from '../astro/astro.service';

@Injectable()
export class EnergyEngineService {
  private readonly logger = new Logger(EnergyEngineService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private astroService: AstroService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async calculateDailyEnergyForAllUsers() {
    this.logger.log('🔄 Calculating daily energy score for all users');
    
    try {
      const users = await this.prisma.user.findMany({
        select: { id: true, timezone: true },
      });

      for (const user of users) {
        await this.calculateDailyEnergyForUser(user.id);
      }

      this.logger.log(`✅ Daily energy score calculated for ${users.length} users`);
    } catch (error) {
              this.logger.error('❌ Error calculating daily energy score:', error);
    }
  }

  async calculateDailyEnergyForUser(userId: string): Promise<number> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Проверяем, есть ли уже расчет для сегодня
      const existingScore = await this.prisma.energyScore.findUnique({
        where: {
          userId_date: {
            userId,
            date: today,
          },
        },
      });

      if (existingScore) {
        return existingScore.score;
      }

      // Получаем астрологические данные
      const astroInfluences = await this.astroService.getAstrologicalInfluences(today);
      
      // Рассчитываем энергетический показатель
      const energyScore = await this.calculateEnergyScore(user, astroInfluences, today);

      // Сохраняем результат
      await this.prisma.energyScore.create({
        data: {
          userId,
          date: today,
          score: energyScore,
          factors: {
            moonPhase: astroInfluences.moonPhase,
            zodiacSign: user.zodiacSign,
            element: user.element,
            timezone: user.timezone,
            calculatedAt: new Date(),
          },
        },
      });

      // Кэшируем результат
      const cacheKey = `energy_score:${userId}:${today.toISOString().split('T')[0]}`;
      await this.redis.set(cacheKey, energyScore.toString(), 86400); // TTL 24 часа

      this.logger.log(`✅ Energy score для пользователя ${userId}: ${energyScore}`);
      return energyScore;
    } catch (error) {
      this.logger.error(`❌ Ошибка расчета energy score для пользователя ${userId}:`, error);
      return 0;
    }
  }

  private async calculateEnergyScore(user: any, astroInfluences: any, date: Date): Promise<number> {
    let baseScore = 50; // Базовый показатель

    // Влияние лунной фазы
    const moonPhaseBonus = this.getMoonPhaseBonus(astroInfluences.moonPhase);
    baseScore += moonPhaseBonus;

    // Влияние знака зодиака
    const zodiacBonus = this.getZodiacBonus(user.zodiacSign, date);
    baseScore += zodiacBonus;

    // Влияние элемента
    const elementBonus = this.getElementBonus(user.element, astroInfluences.moonPhase);
    baseScore += elementBonus;

    // Влияние времени года
    const seasonalBonus = this.getSeasonalBonus(date);
    baseScore += seasonalBonus;

    // Влияние дня недели
    const dayOfWeekBonus = this.getDayOfWeekBonus(date);
    baseScore += dayOfWeekBonus;

    // Нормализуем результат от 0 до 100
    const finalScore = Math.max(0, Math.min(100, Math.round(baseScore)));

    return finalScore;
  }

  private getMoonPhaseBonus(moonPhase: string): number {
    const bonuses = {
      'NEW_MOON': -10,      // Низкая энергия
      'WAXING_CRESCENT': 5, // Растущая энергия
      'FIRST_QUARTER': 10,  // Средняя энергия
      'WAXING_GIBBOUS': 15, // Высокая энергия
      'FULL_MOON': 20,      // Максимальная энергия
      'WANING_GIBBOUS': 10, // Снижающаяся энергия
      'LAST_QUARTER': 5,    // Средняя энергия
      'WANING_CRESCENT': -5, // Низкая энергия
    };

    return bonuses[moonPhase] || 0;
  }

  private getZodiacBonus(zodiacSign: string, date: Date): number {
    if (!zodiacSign) return 0;

    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Определяем текущий знак зодиака
    let currentSign = '';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) currentSign = 'ARIES';
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) currentSign = 'TAURUS';
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) currentSign = 'GEMINI';
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) currentSign = 'CANCER';
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) currentSign = 'LEO';
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) currentSign = 'VIRGO';
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) currentSign = 'LIBRA';
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) currentSign = 'SCORPIO';
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) currentSign = 'SAGITTARIUS';
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) currentSign = 'CAPRICORN';
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) currentSign = 'AQUARIUS';
    else currentSign = 'PISCES';

    // Бонус если знак пользователя совпадает с текущим
    if (zodiacSign === currentSign) {
      return 15; // Максимальный бонус
    }

    // Бонус за соседние знаки
    const zodiacOrder = [
      'ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO',
      'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'
    ];

    const userIndex = zodiacOrder.indexOf(zodiacSign);
    const currentIndex = zodiacOrder.indexOf(currentSign);
    const distance = Math.min(
      Math.abs(userIndex - currentIndex),
      Math.abs(userIndex - currentIndex + 12),
      Math.abs(userIndex - currentIndex - 12)
    );

    if (distance === 1) return 5;  // Соседние знаки
    if (distance === 2) return 2;  // Через один знак
    if (distance === 6) return -5; // Противоположные знаки

    return 0;
  }

  private getElementBonus(element: string, moonPhase: string): number {
    if (!element) return 0;

    // Влияние элемента на лунную фазу
    const elementMoonBonus = {
      'FIRE': {
        'NEW_MOON': 5,      // Огонь помогает в новолуние
        'FULL_MOON': 10,    // Огонь усиливается в полнолуние
        'WAXING_CRESCENT': 8,
        'WAXING_GIBBOUS': 12,
        'FIRST_QUARTER': 6,
        'LAST_QUARTER': 3,
        'WANING_GIBBOUS': 4,
        'WANING_CRESCENT': 2,
      },
      'EARTH': {
        'NEW_MOON': 8,      // Земля стабильна в новолуние
        'FULL_MOON': 5,     // Земля менее активна в полнолуние
        'WAXING_CRESCENT': 6,
        'WAXING_GIBBOUS': 4,
        'FIRST_QUARTER': 7,
        'LAST_QUARTER': 8,
        'WANING_GIBBOUS': 6,
        'WANING_CRESCENT': 7,
      },
      'AIR': {
        'NEW_MOON': 3,      // Воздух менее активен в новолуние
        'FULL_MOON': 8,     // Воздух активен в полнолуние
        'WAXING_CRESCENT': 6,
        'WAXING_GIBBOUS': 9,
        'FIRST_QUARTER': 7,
        'LAST_QUARTER': 4,
        'WANING_GIBBOUS': 5,
        'WANING_CRESCENT': 3,
      },
      'WATER': {
        'NEW_MOON': 10,     // Вода очень активна в новолуние
        'FULL_MOON': 15,    // Вода максимально активна в полнолуние
        'WAXING_CRESCENT': 12,
        'WAXING_GIBBOUS': 14,
        'FIRST_QUARTER': 11,
        'LAST_QUARTER': 9,
        'WANING_GIBBOUS': 8,
        'WANING_CRESCENT': 6,
      },
    };

    return elementMoonBonus[element]?.[moonPhase] || 0;
  }

  private getSeasonalBonus(date: Date): number {
    const month = date.getMonth() + 1;
    
    // Весна (март-май) - энергия роста
    if (month >= 3 && month <= 5) return 8;
    // Лето (июнь-август) - максимальная энергия
    if (month >= 6 && month <= 8) return 12;
    // Осень (сентябрь-ноябрь) - энергия сбора урожая
    if (month >= 9 && month <= 11) return 6;
    // Зима (декабрь-февраль) - энергия отдыха
    return 2;
  }

  private getDayOfWeekBonus(date: Date): number {
    const dayOfWeek = date.getDay();
    
    const dayBonuses = {
      0: 5,  // Воскресенье - день Солнца
      1: 8,  // Понедельник - день Луны
      2: 6,  // Вторник - день Марса
      3: 4,  // Среда - день Меркурия
      4: 7,  // Четверг - день Юпитера
      5: 3,  // Пятница - день Венеры
      6: 2,  // Суббота - день Сатурна
    };

    return dayBonuses[dayOfWeek] || 0;
  }

  async getUserEnergyScore(userId: string, date?: Date): Promise<any> {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Сначала проверяем кэш
    const cacheKey = `energy_score:${userId}:${targetDate.toISOString().split('T')[0]}`;
    const cachedScore = await this.redis.get(cacheKey);

    if (cachedScore) {
      return {
        score: parseFloat(cachedScore),
        source: 'cache',
        date: targetDate,
      };
    }

    // Если нет в кэше, получаем из базы
    const energyScore = await this.prisma.energyScore.findUnique({
      where: {
        userId_date: {
          userId,
          date: targetDate,
        },
      },
    });

    if (energyScore) {
      // Обновляем кэш
      await this.redis.set(cacheKey, energyScore.score.toString(), 86400);
      
      return {
        score: energyScore.score,
        source: 'database',
        date: targetDate,
        factors: energyScore.factors,
      };
    }

    // Если нет данных, рассчитываем
    const calculatedScore = await this.calculateDailyEnergyForUser(userId);
    
    return {
      score: calculatedScore,
      source: 'calculated',
      date: targetDate,
    };
  }

  async getUserEnergyHistory(userId: string, days: number = 30): Promise<any[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.energyScore.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
  }
} 