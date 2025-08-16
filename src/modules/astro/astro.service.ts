import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import * as swisseph from 'swisseph';

@Injectable()
export class AstroService {
  private readonly logger = new Logger(AstroService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {
    // Инициализация Swiss Ephemeris
    const dataPath = process.env.SWISSEPH_DATA_PATH || './swisseph-data';
    swisseph.swe_set_ephe_path(dataPath);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async updateDailyAstroData() {
    this.logger.log('🔄 Обновление астрологических данных на сегодня');
    
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Обновляем лунные фазы
      await this.updateMoonPhases(today);
      await this.updateMoonPhases(tomorrow);

      // Очищаем кэш рекомендаций
      await this.clearRecommendationsCache();

      this.logger.log('✅ Астрологические данные обновлены');
    } catch (error) {
      this.logger.error('❌ Ошибка обновления астрологических данных:', error);
    }
  }

  async updateMoonPhases(date: Date) {
    const dateStr = date.toISOString().split('T')[0];
    
    // Проверяем, есть ли уже данные для этой даты
    const existingPhase = await this.prisma.moonPhase.findUnique({
      where: { date: date },
    });

    if (existingPhase) {
      return existingPhase;
    }

    try {
      // Получаем лунные данные через Swiss Ephemeris
      const moonData = await this.getMoonData(date);
      
      // Создаем запись о лунной фазе
      const moonPhase = await this.prisma.moonPhase.create({
        data: {
          date: date,
          phase: moonData.phase,
          illumination: moonData.illumination,
          moonrise: moonData.moonrise,
          moonset: moonData.moonset,
        },
      });

      this.logger.log(`✅ Лунная фаза для ${dateStr}: ${moonData.phase}`);
      return moonPhase;
    } catch (error) {
      this.logger.error(`❌ Ошибка получения лунных данных для ${dateStr}:`, error);
      throw error;
    }
  }

  private async getMoonData(date: Date): Promise<any> {
    // Упрощенный расчет лунной фазы
    // В реальном проекте здесь будет использование Swiss Ephemeris
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Простой алгоритм расчета лунной фазы
    const phase = this.calculateSimpleMoonPhase(year, month, day);
    
    return {
      phase: phase.phase,
      illumination: phase.illumination,
      moonrise: this.calculateMoonrise(date),
      moonset: this.calculateMoonset(date),
    };
  }

  private calculateSimpleMoonPhase(year: number, month: number, day: number) {
    // Упрощенный алгоритм расчета лунной фазы
    // В реальном проекте используется Swiss Ephemeris
    
    const baseDate = new Date(2000, 0, 6); // 6 января 2000 - новолуние
    const targetDate = new Date(year, month - 1, day);
    
    const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const lunarDays = daysDiff % 29.53058867;
    
    let phase: string;
    let illumination: number;

    if (lunarDays < 3.69) {
      phase = 'NEW_MOON';
      illumination = 0;
    } else if (lunarDays < 7.38) {
      phase = 'WAXING_CRESCENT';
      illumination = 0.25;
    } else if (lunarDays < 11.07) {
      phase = 'FIRST_QUARTER';
      illumination = 0.5;
    } else if (lunarDays < 14.76) {
      phase = 'WAXING_GIBBOUS';
      illumination = 0.75;
    } else if (lunarDays < 18.45) {
      phase = 'FULL_MOON';
      illumination = 1;
    } else if (lunarDays < 22.14) {
      phase = 'WANING_GIBBOUS';
      illumination = 0.75;
    } else if (lunarDays < 25.83) {
      phase = 'LAST_QUARTER';
      illumination = 0.5;
    } else if (lunarDays < 29.52) {
      phase = 'WANING_CRESCENT';
      illumination = 0.25;
    } else {
      phase = 'NEW_MOON';
      illumination = 0;
    }

    return { phase, illumination };
  }

  private calculateMoonrise(date: Date): Date {
    // Упрощенный расчет времени восхода луны
    const moonrise = new Date(date);
    moonrise.setHours(18, 0, 0, 0); // Примерное время
    return moonrise;
  }

  private calculateMoonset(date: Date): Date {
    // Упрощенный расчет времени захода луны
    const moonset = new Date(date);
    moonset.setHours(6, 0, 0, 0); // Примерное время
    return moonset;
  }

  async getCurrentMoonPhase(): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let moonPhase = await this.prisma.moonPhase.findUnique({
      where: { date: today },
    });

    if (!moonPhase) {
      moonPhase = await this.updateMoonPhases(today);
    }

    return moonPhase;
  }

  async getMoonPhaseForDate(date: Date): Promise<any> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    let moonPhase = await this.prisma.moonPhase.findUnique({
      where: { date: targetDate },
    });

    if (!moonPhase) {
      moonPhase = await this.updateMoonPhases(targetDate);
    }

    return moonPhase;
  }

  async getMoonPhasesForPeriod(startDate: Date, endDate: Date): Promise<any[]> {
    return this.prisma.moonPhase.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  private async clearRecommendationsCache(): Promise<void> {
    // Очищаем кэш рекомендаций при обновлении астрологических данных
    const keys = await this.redis.get('recommendations:*');
    if (keys) {
      await this.redis.del('recommendations:*');
      this.logger.log('🗑️ Кэш рекомендаций очищен');
    }
  }

  async getAstrologicalInfluences(date: Date): Promise<any> {
    const moonPhase = await this.getMoonPhaseForDate(date);
    
    // Определяем влияние лунной фазы на разные сферы жизни
    const influences = {
      moonPhase: moonPhase.phase,
      energy: this.getEnergyByMoonPhase(moonPhase.phase),
      activities: this.getRecommendedActivities(moonPhase.phase),
      crystals: this.getRecommendedCrystals(moonPhase.phase),
    };

    return influences;
  }

  private getEnergyByMoonPhase(phase: string): string {
    const energyMap = {
      'NEW_MOON': 'Низкая - время для планирования и намерений',
      'WAXING_CRESCENT': 'Растущая - время для развития и роста',
      'FIRST_QUARTER': 'Средняя - время для действий и решений',
      'WAXING_GIBBOUS': 'Высокая - время для завершения проектов',
      'FULL_MOON': 'Максимальная - время для проявления и реализации',
      'WANING_GIBBOUS': 'Снижающаяся - время для анализа и оценки',
      'LAST_QUARTER': 'Средняя - время для отпускания и очищения',
      'WANING_CRESCENT': 'Низкая - время для отдыха и подготовки',
    };

    return energyMap[phase] || 'Неопределенная';
  }

  private getRecommendedActivities(phase: string): string[] {
    const activitiesMap = {
      'NEW_MOON': ['Планирование', 'Медитация', 'Постановка целей'],
      'WAXING_CRESCENT': ['Обучение', 'Развитие навыков', 'Новые проекты'],
      'FIRST_QUARTER': ['Принятие решений', 'Действия', 'Преодоление препятствий'],
      'WAXING_GIBBOUS': ['Завершение проектов', 'Детализация', 'Подготовка к запуску'],
      'FULL_MOON': ['Проявление', 'Празднование', 'Реализация планов'],
      'WANING_GIBBOUS': ['Анализ результатов', 'Оценка', 'Корректировка'],
      'LAST_QUARTER': ['Отпускание', 'Очищение', 'Прощение'],
      'WANING_CRESCENT': ['Отдых', 'Подготовка', 'Внутренняя работа'],
    };

    return activitiesMap[phase] || [];
  }

  private getRecommendedCrystals(phase: string): string[] {
    const crystalsMap = {
      'NEW_MOON': ['Лунный камень', 'Жемчуг', 'Селенит'],
      'WAXING_CRESCENT': ['Розовый кварц', 'Аметист', 'Авантюрин'],
      'FIRST_QUARTER': ['Тигровый глаз', 'Гематит', 'Обсидиан'],
      'WAXING_GIBBOUS': ['Цитрин', 'Топаз', 'Солнечный камень'],
      'FULL_MOON': ['Кристалл кварца', 'Алмаз', 'Белый сапфир'],
      'WANING_GIBBOUS': ['Лабрадорит', 'Азурит', 'Лазурит'],
      'LAST_QUARTER': ['Черный турмалин', 'Дымчатый кварц', 'Шунгит'],
      'WANING_CRESCENT': ['Агат', 'Яшма', 'Сердолик'],
    };

    return crystalsMap[phase] || [];
  }
} 