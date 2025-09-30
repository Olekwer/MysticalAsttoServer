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
    this.logger.log('🔄 Generating daily recommendations for all users');

    try {
      const users = await this.prisma.user.findMany({
        select: { id: true, timezone: true },
      });

      for (const user of users) {
        await this.generateDailyRecommendationsForUser(user.id);
      }

      this.logger.log(`✅ Recommendations generated for ${users.length} users`);
    } catch (error) {
      this.logger.error('❌ Error generating recommendations:', error);
    }
  }

  async generateDailyRecommendationsForUser(userId: string): Promise<any> {
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

      // Get energy indicator
      const energyScore = await this.energyEngineService.getUserEnergyScore(userId, today);

      // Get astrological influences
      const astroInfluences = await this.astroService.getAstrologicalInfluences(today);

      // Generate recommendations
      const recommendations = await this.generateRecommendations(
        user,
        energyScore,
        astroInfluences,
      );

      // Save recommendations to database
      await this.saveRecommendations(userId, today, recommendations);

      // Cache recommendations
      await this.cacheRecommendations(userId, today, recommendations);

      this.logger.log(`✅ Recommendations for user ${userId} generated`);
      return recommendations;
    } catch (error) {
      this.logger.error(`❌ Error generating recommendations for user ${userId}:`, error);
      throw error;
    }
  }

  private async generateRecommendations(
    user: any,
    energyScore: any,
    astroInfluences: any,
  ): Promise<any> {
    const recommendations = {};

    // Ritual of the day
    recommendations['ritual'] = await this.recommendRitual(user, energyScore, astroInfluences);

    // Stone of the day
    recommendations['stone'] = await this.recommendStone(user, energyScore, astroInfluences);

    // Tincture recipe
    recommendations['tea'] = await this.recommendTea(user, energyScore, astroInfluences);

    // Energy advice
    recommendations['energyTip'] = this.generateEnergyTip(energyScore.score, astroInfluences);

    // Astrological path
    recommendations['astroPath'] = this.generateAstroPath(user, astroInfluences);

    return recommendations;
  }

  private async recommendRitual(user: any, _energyScore: any, _astroInfluences: any): Promise<any> {
    // Logic for choosing ritual based on energy and astrological influences
    // TODO: Use energyScore.score, astroInfluences.moonPhase, user.element for better recommendations
    const energyLevel = _energyScore?.score || 50;
    const moonPhase = _astroInfluences?.moonPhase || 'NEW_MOON';

    const ritualQuery: any = {
      where: {
        isPremium: user.isPremium ? undefined : false,
      },
    };

    // Filter by complexity based on energy
    if (energyLevel < 30) {
      ritualQuery.where.difficulty = 'EASY';
    } else if (energyLevel < 70) {
      ritualQuery.where.difficulty = { in: ['EASY', 'MEDIUM'] };
    }

    // Filter by category based on moon phase
    const phaseCategories = {
      NEW_MOON: ['meditation', 'intention-setting', 'planning'],
      WAXING_CRESCENT: ['growth', 'learning', 'development'],
      FIRST_QUARTER: ['action', 'decision-making', 'courage'],
      WAXING_GIBBOUS: ['completion', 'refinement', 'perfection'],
      FULL_MOON: ['celebration', 'manifestation', 'power'],
      WANING_GIBBOUS: ['evaluation', 'analysis', 'review'],
      LAST_QUARTER: ['release', 'forgiveness', 'cleansing'],
      WANING_CRESCENT: ['rest', 'preparation', 'introspection'],
    };

    if (phaseCategories[moonPhase]) {
      ritualQuery.where.category = { in: phaseCategories[moonPhase] };
    }

    const rituals = await this.prisma.ritual.findMany(ritualQuery);

    if (rituals.length === 0) {
      // Fallback - any available ritual
      return await this.prisma.ritual.findFirst({
        where: { isPremium: user.isPremium ? undefined : false },
      });
    }

    // Choose random ritual from suitable ones
    return rituals[Math.floor(Math.random() * rituals.length)];
  }

  private async recommendStone(user: any, _energyScore: any, _astroInfluences: any): Promise<any> {
    // TODO: Use energyScore.score and astroInfluences.moonPhase for better recommendations
    const userZodiac = user.zodiacSign;
    const userElement = user?.element;
    // TODO: Use user.element for better recommendations

    const stoneQuery: any = {
      where: {
        isPremium: user.isPremium ? undefined : false,
      },
    };

    // Filter by zodiac sign
    if (userZodiac) {
      stoneQuery.where.zodiacSigns = { has: userZodiac };
    }

    // Filter by element
    if (userElement) {
      stoneQuery.where.elements = { has: userElement };
    }

    const stones = await this.prisma.stone.findMany(stoneQuery);

    if (stones.length === 0) {
      // Fallback - any available stone
      return await this.prisma.stone.findFirst({
        where: { isPremium: user.isPremium ? undefined : false },
      });
    }

    // Choose random stone from suitable ones
    return stones[Math.floor(Math.random() * stones.length)];
  }

  private async recommendTea(user: any, _energyScore: any, _astroInfluences: any): Promise<any> {
    // TODO: Use energyScore.score and astroInfluences.moonPhase for better recommendations
    const userZodiac = user.zodiacSign;
    const userElement = user?.element;
    // TODO: Use user.element for better recommendations

    const teaQuery: any = {
      where: {
        isPremium: user.isPremium ? undefined : false,
      },
    };

    // Filter by zodiac sign
    if (userZodiac) {
      teaQuery.where.zodiacSigns = { has: userZodiac };
    }

    // Filter by element
    if (userElement) {
      teaQuery.where.elements = { has: userElement };
    }

    const teas = await this.prisma.teaRecipe.findMany(teaQuery);

    if (teas.length === 0) {
      // Fallback - any available recipe
      return await this.prisma.teaRecipe.findFirst({
        where: { isPremium: user.isPremium ? undefined : false },
      });
    }

    // Choose random recipe from suitable ones
    return teas[Math.floor(Math.random() * teas.length)];
  }

  private generateEnergyTip(energyScore: number, _astroInfluences: any): string {
    // TODO: Use astroInfluences.moonPhase for better recommendations

    if (energyScore < 30) {
      return 'Today low energy level. Rest, meditation and future planning are recommended.';
    } else if (energyScore < 50) {
      return 'Moderate energy. Good time for quiet activities and preparation for active actions.';
    } else if (energyScore < 70) {
      return 'Good energy level. You can engage in active activities and implement plans.';
    } else {
      return 'High energy! Great time for important tasks, new projects and achieving goals.';
    }
  }

  private generateAstroPath(_user: any, _astroInfluences: any): any {
    // TODO: Use astroInfluences.moonPhase for better recommendations
    const moonPhase = _astroInfluences?.moonPhase || 'NEW_MOON';
    // TODO: Use user.element for better recommendations

    const pathSuggestions = {
      NEW_MOON: {
        theme: 'New beginnings',
        focus: 'Planning and goal setting',
        actions: ['Meditation', 'Visualization', 'Writing plans'],
        duration: 'Until next new moon',
      },
      WAXING_CRESCENT: {
        theme: 'Development and growth',
        focus: 'Learning and skill acquisition',
        actions: ['Learning new things', 'Practice', 'Experiments'],
        duration: 'Until first quarter',
      },
      FIRST_QUARTER: {
        theme: 'Action and determination',
        focus: 'Overcoming obstacles',
        actions: ['Decision making', 'Active actions', 'Courage'],
        duration: 'Until full moon',
      },
      WAXING_GIBBOUS: {
        theme: 'Completion and perfection',
        focus: 'Detailing and improvement',
        actions: ['Project refinement', 'Bug fixes', 'Launch preparation'],
        duration: 'Until full moon',
      },
      FULL_MOON: {
        theme: 'Manifestation and realization',
        focus: 'Achieving results',
        actions: ['Project launch', 'Celebration', 'Talent demonstration'],
        duration: 'Until last quarter',
      },
      WANING_GIBBOUS: {
        theme: 'Analysis and evaluation',
        focus: 'Review and adjustment',
        actions: ['Result analysis', 'Effectiveness evaluation', 'Change planning'],
        duration: 'Until last quarter',
      },
      LAST_QUARTER: {
        theme: 'Letting go and cleansing',
        focus: 'Getting rid of excess',
        actions: ['Forgiveness', 'Space cleansing', 'Letting go of the past'],
        duration: 'Until waning crescent',
      },
      WANING_CRESCENT: {
        theme: 'Rest and preparation',
        focus: 'Inner work',
        actions: ['Rest', 'Meditation', 'Preparation for new cycle'],
        duration: 'Until new moon',
      },
    };

    return pathSuggestions[moonPhase] || pathSuggestions['NEW_MOON'];
  }

  private async saveRecommendations(
    userId: string,
    date: Date,
    recommendations: any,
  ): Promise<void> {
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

  private async cacheRecommendations(
    userId: string,
    date: Date,
    recommendations: any,
  ): Promise<void> {
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

    // First check cache
    const cacheKey = `recommendations:${userId}:${targetDate.toISOString().split('T')[0]}`;
    const cachedRecs = await this.redis.get(cacheKey);

    if (cachedRecs) {
      return {
        recommendations: JSON.parse(cachedRecs),
        source: 'cache',
        date: targetDate,
      };
    }

    // If not in cache, get from database
    const recommendations = await this.prisma.recommendation.findMany({
      where: {
        userId,
        date: targetDate,
      },
      orderBy: { priority: 'desc' },
    });

    if (recommendations.length > 0) {
      // Form recommendations object
      const recsObj = {};
      for (const rec of recommendations) {
        recsObj[rec.type.toLowerCase().replace(/_/g, '')] = rec.content;
      }

      // Cache result
      const ttl = this.calculateTTLUntilMidnight();
      await this.redis.set(cacheKey, JSON.stringify(recsObj), ttl);

      return {
        recommendations: recsObj,
        source: 'database',
        date: targetDate,
      };
    }

    // If no data, generate
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
