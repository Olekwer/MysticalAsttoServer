import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { EnergyEngineService } from '../energy-engine/energy-engine.service';
import { AstroService } from '../astro/astro.service';

@Injectable()
export class RecommenderService {
  private readonly logger = new Logger(RecommenderService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private energyEngineService: EnergyEngineService,
    private astroService: AstroService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async generateDailyRecommendationsForAllUsers() {
    this.logger.log('🔄 Генерация ежедневных рекомендаций для всех пользователей');
    
    try {
      const users = await this.prisma.user.findMany({
        select: { id: true, timezone: true },
      });

      for (const user of users) {
        await this.generateDailyRecommendationsForUser(user.id);
      }

      this.logger.log(`✅ Рекомендации сгенерированы для ${users.length} пользователей`);
    } catch (error) {
      this.logger.error('❌ Ошибка генерации рекомендаций:', error);
    }
  }

  async generateDailyRecommendationsForUser(userId: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Получаем энергетический показатель
      const energyScore = await this.energyEngineService.getUserEnergyScore(userId, today);
      
      // Получаем астрологические влияния
      const astroInfluences = await this.astroService.getAstrologicalInfluences(today);

      // Генерируем рекомендации
      const recommendations = await this.generateRecommendations(user, energyScore, astroInfluences);

      // Сохраняем рекомендации в базу
      await this.saveRecommendations(userId, today, recommendations);

      // Кэшируем рекомендации
      await this.cacheRecommendations(userId, today, recommendations);

      this.logger.log(`✅ Рекомендации для пользователя ${userId} сгенерированы`);
      return recommendations;
    } catch (error) {
      this.logger.error(`❌ Ошибка генерации рекомендаций для пользователя ${userId}:`, error);
      throw error;
    }
  }

  private async generateRecommendations(user: any, energyScore: any, astroInfluences: any): Promise<any> {
    const recommendations = {};

    // Ритуал дня
    recommendations['ritual'] = await this.recommendRitual(user, energyScore, astroInfluences);
    
    // Камень дня
    recommendations['stone'] = await this.recommendStone(user, energyScore, astroInfluences);
    
    // Рецепт настоя
    recommendations['tea'] = await this.recommendTea(user, energyScore, astroInfluences);
    
    // Энергетический совет
    recommendations['energyTip'] = this.generateEnergyTip(energyScore.score, astroInfluences);
    
    // Астрологический путь
    recommendations['astroPath'] = this.generateAstroPath(user, astroInfluences);

    return recommendations;
  }

  private async recommendRitual(user: any, energyScore: any, astroInfluences: any): Promise<any> {
    // Логика выбора ритуала на основе энергии и астрологических влияний
    const energyLevel = energyScore.score;
    const moonPhase = astroInfluences.moonPhase;
    const userElement = user.element;

    let ritualQuery: any = {
      where: {
        isPremium: user.isPremium ? undefined : false,
      },
    };

    // Фильтрация по сложности на основе энергии
    if (energyLevel < 30) {
      ritualQuery.where.difficulty = 'EASY';
    } else if (energyLevel < 70) {
      ritualQuery.where.difficulty = { in: ['EASY', 'MEDIUM'] };
    }

    // Фильтрация по категории на основе лунной фазы
    const phaseCategories = {
      'NEW_MOON': ['meditation', 'intention-setting', 'planning'],
      'WAXING_CRESCENT': ['growth', 'learning', 'development'],
      'FIRST_QUARTER': ['action', 'decision-making', 'courage'],
      'WAXING_GIBBOUS': ['completion', 'refinement', 'perfection'],
      'FULL_MOON': ['celebration', 'manifestation', 'power'],
      'WANING_GIBBOUS': ['evaluation', 'analysis', 'review'],
      'LAST_QUARTER': ['release', 'forgiveness', 'cleansing'],
      'WANING_CRESCENT': ['rest', 'preparation', 'introspection'],
    };

    if (phaseCategories[moonPhase]) {
      ritualQuery.where.category = { in: phaseCategories[moonPhase] };
    }

    const rituals = await this.prisma.ritual.findMany(ritualQuery);
    
    if (rituals.length === 0) {
      // Fallback - любой доступный ритуал
      return await this.prisma.ritual.findFirst({
        where: { isPremium: user.isPremium ? undefined : false },
      });
    }

    // Выбираем случайный ритуал из подходящих
    return rituals[Math.floor(Math.random() * rituals.length)];
  }

  private async recommendStone(user: any, energyScore: any, astroInfluences: any): Promise<any> {
    const energyLevel = energyScore.score;
    const moonPhase = astroInfluences.moonPhase;
    const userZodiac = user.zodiacSign;
    const userElement = user.element;

    let stoneQuery: any = {
      where: {
        isPremium: user.isPremium ? undefined : false,
      },
    };

    // Фильтрация по знаку зодиака
    if (userZodiac) {
      stoneQuery.where.zodiacSigns = { has: userZodiac };
    }

    // Фильтрация по элементу
    if (userElement) {
      stoneQuery.where.elements = { has: userElement };
    }

    const stones = await this.prisma.stone.findMany(stoneQuery);
    
    if (stones.length === 0) {
      // Fallback - любой доступный камень
      return await this.prisma.stone.findFirst({
        where: { isPremium: user.isPremium ? undefined : false },
      });
    }

    // Выбираем случайный камень из подходящих
    return stones[Math.floor(Math.random() * stones.length)];
  }

  private async recommendTea(user: any, energyScore: any, astroInfluences: any): Promise<any> {
    const energyLevel = energyScore.score;
    const moonPhase = astroInfluences.moonPhase;
    const userZodiac = user.zodiacSign;
    const userElement = user.element;

    let teaQuery: any = {
      where: {
        isPremium: user.isPremium ? undefined : false,
      },
    };

    // Фильтрация по знаку зодиака
    if (userZodiac) {
      teaQuery.where.zodiacSigns = { has: userZodiac };
    }

    // Фильтрация по элементу
    if (userElement) {
      teaQuery.where.elements = { has: userElement };
    }

    const teas = await this.prisma.teaRecipe.findMany(teaQuery);
    
    if (teas.length === 0) {
      // Fallback - любой доступный рецепт
      return await this.prisma.teaRecipe.findFirst({
        where: { isPremium: user.isPremium ? undefined : false },
      });
    }

    // Выбираем случайный рецепт из подходящих
    return teas[Math.floor(Math.random() * teas.length)];
  }

  private generateEnergyTip(energyScore: number, astroInfluences: any): string {
    const moonPhase = astroInfluences.moonPhase;
    
    if (energyScore < 30) {
      return 'Сегодня низкий уровень энергии. Рекомендуется отдых, медитация и планирование на будущее.';
    } else if (energyScore < 50) {
      return 'Умеренная энергия. Хорошее время для спокойных дел и подготовки к активным действиям.';
    } else if (energyScore < 70) {
      return 'Хороший уровень энергии. Можно заниматься активными делами и реализовывать планы.';
    } else {
      return 'Высокая энергия! Отличное время для важных дел, новых проектов и достижения целей.';
    }
  }

  private generateAstroPath(user: any, astroInfluences: any): any {
    const moonPhase = astroInfluences.moonPhase;
    const userElement = user.element;
    
    const pathSuggestions = {
      'NEW_MOON': {
        theme: 'Новые начинания',
        focus: 'Планирование и постановка целей',
        actions: ['Медитация', 'Визуализация', 'Запись планов'],
        duration: 'До следующего новолуния',
      },
      'WAXING_CRESCENT': {
        theme: 'Развитие и рост',
        focus: 'Обучение и приобретение навыков',
        actions: ['Изучение нового', 'Практика', 'Эксперименты'],
        duration: 'До первой четверти',
      },
      'FIRST_QUARTER': {
        theme: 'Действие и решительность',
        focus: 'Преодоление препятствий',
        actions: ['Принятие решений', 'Активные действия', 'Смелость'],
        duration: 'До полнолуния',
      },
      'WAXING_GIBBOUS': {
        theme: 'Завершение и совершенствование',
        focus: 'Детализация и улучшение',
        actions: ['Доработка проектов', 'Исправление ошибок', 'Подготовка к запуску'],
        duration: 'До полнолуния',
      },
      'FULL_MOON': {
        theme: 'Проявление и реализация',
        focus: 'Достижение результатов',
        actions: ['Запуск проектов', 'Празднование', 'Демонстрация талантов'],
        duration: 'До последней четверти',
      },
      'WANING_GIBBOUS': {
        theme: 'Анализ и оценка',
        focus: 'Пересмотр и корректировка',
        actions: ['Анализ результатов', 'Оценка эффективности', 'Планирование изменений'],
        duration: 'До последней четверти',
      },
      'LAST_QUARTER': {
        theme: 'Отпускание и очищение',
        focus: 'Избавление от лишнего',
        actions: ['Прощение', 'Очищение пространства', 'Отпускание прошлого'],
        duration: 'До убывающего серпа',
      },
      'WANING_CRESCENT': {
        theme: 'Отдых и подготовка',
        focus: 'Внутренняя работа',
        actions: ['Отдых', 'Медитация', 'Подготовка к новому циклу'],
        duration: 'До новолуния',
      },
    };

    return pathSuggestions[moonPhase] || pathSuggestions['NEW_MOON'];
  }

  private async saveRecommendations(userId: string, date: Date, recommendations: any): Promise<void> {
    const recommendationTypes = [
      { type: 'RITUAL_OF_DAY' as const, content: recommendations.ritual },
      { type: 'STONE_OF_DAY' as const, content: recommendations.stone },
      { type: 'TEA_RECIPE' as const, content: recommendations.tea },
      { type: 'ENERGY_TIP' as const, content: { tip: recommendations.energyTip } },
      { type: 'ASTROLOGICAL_PATH' as const, content: recommendations.astroPath },
    ];

    for (const rec of recommendationTypes) {
      await this.prisma.recommendation.upsert({
        where: {
          userId_date_type: {
            userId,
            date,
            type: rec.type,
          },
        },
        update: {
          content: rec.content,
        },
        create: {
          userId,
          date,
          type: rec.type,
          content: rec.content,
          priority: 1,
        },
      });
    }
  }

  private async cacheRecommendations(userId: string, date: Date, recommendations: any): Promise<void> {
    const cacheKey = `recommendations:${userId}:${date.toISOString().split('T')[0]}`;
    const ttl = this.calculateTTLUntilMidnight();
    
    await this.redis.set(cacheKey, JSON.stringify(recommendations), ttl);
  }

  private calculateTTLUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  }

  async getUserRecommendations(userId: string, date?: Date): Promise<any> {
    const targetDate = date || new Date();
    targetDate.setHours(0, 0, 0, 0);

    // Сначала проверяем кэш
    const cacheKey = `recommendations:${userId}:${targetDate.toISOString().split('T')[0]}`;
    const cachedRecs = await this.redis.get(cacheKey);

    if (cachedRecs) {
      return {
        recommendations: JSON.parse(cachedRecs),
        source: 'cache',
        date: targetDate,
      };
    }

    // Если нет в кэше, получаем из базы
    const recommendations = await this.prisma.recommendation.findMany({
      where: {
        userId,
        date: targetDate,
      },
      orderBy: { priority: 'desc' },
    });

    if (recommendations.length > 0) {
      // Формируем объект рекомендаций
      const recsObj = {};
      for (const rec of recommendations) {
        recsObj[rec.type.toLowerCase().replace(/_/g, '')] = rec.content;
      }

      // Кэшируем результат
      const ttl = this.calculateTTLUntilMidnight();
      await this.redis.set(cacheKey, JSON.stringify(recsObj), ttl);

      return {
        recommendations: recsObj,
        source: 'database',
        date: targetDate,
      };
    }

    // Если нет данных, генерируем
    const generatedRecs = await this.generateDailyRecommendationsForUser(userId);
    
    return {
      recommendations: generatedRecs,
      source: 'generated',
      date: targetDate,
    };
  }

  async getFeedToday(userId: string): Promise<any> {
    const today = new Date();
    const recommendations = await this.getUserRecommendations(userId, today);
    const energyScore = await this.energyEngineService.getUserEnergyScore(userId, today);
    const astroInfluences = await this.astroService.getAstrologicalInfluences(today);

    return {
      date: today,
      energyScore: energyScore.score,
      astroInfluences,
      recommendations: recommendations.recommendations,
      source: recommendations.source,
    };
  }
} 