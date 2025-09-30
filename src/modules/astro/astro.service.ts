import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
// import * as swisseph from 'swisseph';
let swisseph: any;

@Injectable()
export class AstroService {
  private readonly logger = new Logger(AstroService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {
    // Инициализация Swiss Ephemeris (optional for deployment)
    try {
      swisseph = require('swisseph');
      const dataPath = process.env.SWISSEPH_DATA_PATH || './swisseph-data';
      swisseph.swe_set_ephe_path(dataPath);
    } catch (error) {
      this.logger.warn('Swiss Ephemeris not available, using fallback calculations');
      swisseph = null;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async updateDailyAstroData() {
    this.logger.log('🔄 Updating daily astrological data...');

    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Update moon phases
      await this.updateMoonPhases(today);
      await this.updateMoonPhases(tomorrow);

      // Clear recommendations cache
      await this.clearRecommendationsCache();

      this.logger.log('✅ Astrological data updated successfully');
    } catch (error) {
      this.logger.error('❌ Error updating astrological data:', error);
    }
  }

  async updateMoonPhases(date: Date) {
    const dateStr = date.toISOString().split('T')[0];

    // Check if data already exists for this date
    const existingPhase = await this.prisma.moonPhase.findUnique({
      where: { date: date },
    });

    if (existingPhase) {
      return existingPhase;
    }

    try {
      // Get moon data through Swiss Ephemeris
      const moonData = await this.getMoonData(date);

      // Create moon phase record
      const moonPhase = await this.prisma.moonPhase.create({
        data: {
          date: date,
          phase: moonData.phase,
          illumination: moonData.illumination,
          moonrise: moonData.moonrise,
          moonset: moonData.moonset,
        },
      });

      this.logger.log(`Moon phase for ${dateStr}: ${moonData.phase}`);
      return moonPhase;
    } catch (error) {
      this.logger.error(`Error getting moon data for ${dateStr}:`, error);
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

    const daysDiff = Math.floor(
      (targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24),
    );
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
      this.logger.log('🗑️ Recommendations cache cleared');
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

  async generateNatalChart(natalChartData: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  }): Promise<any> {
    try {
      this.logger.log('🔮 Generating natal chart...');

      // Parse birth date and time
      const birthDateTime = new Date(`${natalChartData.birthDate}T${natalChartData.birthTime}`);

      if (isNaN(birthDateTime.getTime())) {
        throw new Error('Invalid date or time format');
      }

      // Get coordinates for birth place (simplified)
      const coordinates = this.getCoordinatesForPlace(natalChartData.birthPlace);

      // Generate natal chart
      const natalChart = await this.calculateNatalChart(birthDateTime, coordinates);

      this.logger.log('✅ Natal chart generated successfully');

      return {
        success: true,
        natalChart,
        metadata: {
          birthDate: natalChartData.birthDate,
          birthTime: natalChartData.birthTime,
          birthPlace: natalChartData.birthPlace,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      this.logger.error('❌ Error generating natal chart:', error);
      throw error;
    }
  }

  private async calculateNatalChart(
    birthDateTime: Date,
    coordinates: { lat: number; lon: number },
  ): Promise<any> {
    // Используем Swiss Ephemeris для расчета позиций планет
    const julianDay = this.dateToJulianDay(birthDateTime);

    // Позиции основных планет
    const planets = await this.calculatePlanetPositions(julianDay);

    // Асцендент и MC
    const houses = this.calculateHouses(julianDay, coordinates);

    // Аспекты между планетами
    const aspects = this.calculateAspects(planets);

    return {
      planets,
      houses,
      aspects,
      birthData: {
        julianDay,
        coordinates,
        localTime: birthDateTime.toISOString(),
      },
    };
  }

  private dateToJulianDay(date: Date): number {
    // Конвертация даты в юлианский день
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;

    // Упрощенный расчет юлианского дня
    // В реальном проекте используется более точная формула
    const jd =
      367 * year -
      Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4) +
      Math.floor((275 * month) / 9) +
      day +
      1721013.5 +
      hour / 24;

    return jd;
  }

  private async calculatePlanetPositions(julianDay: number): Promise<any[]> {
    const planets = [
      { name: 'Sun', symbol: '☉', id: swisseph.SE_SUN },
      { name: 'Moon', symbol: '☽', id: swisseph.SE_MOON },
      { name: 'Mercury', symbol: '☿', id: swisseph.SE_MERCURY },
      { name: 'Venus', symbol: '♀', id: swisseph.SE_VENUS },
      { name: 'Mars', symbol: '♂', id: swisseph.SE_MARS },
      { name: 'Jupiter', symbol: '♃', id: swisseph.SE_JUPITER },
      { name: 'Saturn', symbol: '♄', id: swisseph.SE_SATURN },
      { name: 'Uranus', symbol: '♅', id: swisseph.SE_URANUS },
      { name: 'Neptune', symbol: '♆', id: swisseph.SE_NEPTUNE },
      { name: 'Pluto', symbol: '♇', id: swisseph.SE_PLUTO },
    ];

    const positions = [];

    for (const planet of planets) {
      try {
        const result = swisseph.swe_calc_ut(julianDay, planet.id, swisseph.SEFLG_SWIEPH) as any;

        positions.push({
          name: planet.name,
          symbol: planet.symbol,
          longitude: result.longitude || 0,
          latitude: result.latitude || 0,
          distance: result.distance || 0,
          speed: result.speedLong || result.longitudeSpeed || 0,
          sign: this.getZodiacSign(result.longitude || 0),
          house: this.calculateHouse(result.longitude || 0),
        });
      } catch (error) {
        this.logger.warn(`Failed to calculate position for ${planet.name}:`, error);
        // Add placeholder for planet
        positions.push({
          name: planet.name,
          symbol: planet.symbol,
          longitude: 0,
          latitude: 0,
          distance: 0,
          speed: 0,
          sign: 'ARIES',
          house: 1,
          error: 'Failed to calculate',
        });
      }
    }

    return positions;
  }

  private calculateHouses(julianDay: number, coordinates: { lat: number; lon: number }): any {
    try {
      // Calculate houses through Swiss Ephemeris
      const houses = swisseph.swe_houses(julianDay, coordinates.lat, coordinates.lon, 'P') as any;

      return {
        ascendant: houses.ascendant || 0,
        mc: houses.mc || 0,
        armc: houses.armc || 0,
        vertex: houses.vertex || 0,
        equatorialAscendant: houses.equasc || 0,
        houseCusps: houses.cusps || [],
      };
    } catch (error) {
      this.logger.warn('Failed to calculate houses:', error);
      return {
        ascendant: 0,
        mc: 0,
        error: 'Failed to calculate',
      };
    }
  }

  private calculateAspects(planets: any[]): any[] {
    const aspects = [];
    const aspectOrbs = {
      conjunction: 10, // Соединение
      sextile: 4, // Секстиль
      square: 8, // Квадрат
      trine: 8, // Трин
      opposition: 10, // Оппозиция
    };

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];

        if (planet1.error || planet2.error) continue;

        const angle = Math.abs(planet1.longitude - planet2.longitude);
        const normalizedAngle = angle > 180 ? 360 - angle : angle;

        // Определяем аспект
        let aspectType = null;
        let orb = 0;

        if (Math.abs(normalizedAngle - 0) <= aspectOrbs.conjunction) {
          aspectType = 'conjunction';
          orb = Math.abs(normalizedAngle - 0);
        } else if (Math.abs(normalizedAngle - 60) <= aspectOrbs.sextile) {
          aspectType = 'sextile';
          orb = Math.abs(normalizedAngle - 60);
        } else if (Math.abs(normalizedAngle - 90) <= aspectOrbs.square) {
          aspectType = 'square';
          orb = Math.abs(normalizedAngle - 90);
        } else if (Math.abs(normalizedAngle - 120) <= aspectOrbs.trine) {
          aspectType = 'trine';
          orb = Math.abs(normalizedAngle - 120);
        } else if (Math.abs(normalizedAngle - 180) <= aspectOrbs.opposition) {
          aspectType = 'opposition';
          orb = Math.abs(normalizedAngle - 180);
        }

        if (aspectType) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            aspect: aspectType,
            orb: Math.round(orb * 100) / 100,
            angle: Math.round(normalizedAngle * 100) / 100,
          });
        }
      }
    }

    return aspects;
  }

  private getZodiacSign(longitude: number): string {
    const signs = [
      'ARIES',
      'TAURUS',
      'GEMINI',
      'CANCER',
      'LEO',
      'VIRGO',
      'LIBRA',
      'SCORPIO',
      'SAGITTARIUS',
      'CAPRICORN',
      'AQUARIUS',
      'PISCES',
    ];

    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex % 12];
  }

  private calculateHouse(longitude: number): number {
    // Упрощенный расчет дома (в реальном проекте используется более сложная логика)
    return Math.floor(longitude / 30) + 1;
  }

  private getCoordinatesForPlace(place: string): { lat: number; lon: number } {
    // Simplified geocoding (in real project, geocoding API would be used)
    const placeMap: { [key: string]: { lat: number; lon: number } } = {
      Moscow: { lat: 55.7558, lon: 37.6176 },
      'Saint Petersburg': { lat: 59.9311, lon: 30.3609 },
      Novosibirsk: { lat: 55.0084, lon: 82.9357 },
      Yekaterinburg: { lat: 56.8519, lon: 60.6122 },
      London: { lat: 51.5074, lon: -0.1278 },
      'New York': { lat: 40.7128, lon: -74.006 },
      Paris: { lat: 48.8566, lon: 2.3522 },
      Tokyo: { lat: 35.6762, lon: 139.6503 },
      default: { lat: 55.7558, lon: 37.6176 }, // Moscow by default
    };

    for (const [city, coords] of Object.entries(placeMap)) {
      if (place.toLowerCase().includes(city.toLowerCase())) {
        return coords;
      }
    }

    return placeMap.default;
  }

  private getEnergyByMoonPhase(phase: string): string {
    const energyMap = {
      NEW_MOON: 'Low - time for planning and intentions',
      WAXING_CRESCENT: 'Waxing - time for development and growth',
      FIRST_QUARTER: 'Medium - time for actions and decisions',
      WAXING_GIBBOUS: 'High - time for project completion',
      FULL_MOON: 'Maximum - time for manifestation and realization',
      WANING_GIBBOUS: 'Waning - time for analysis and evaluation',
      LAST_QUARTER: 'Medium - time for letting go and cleansing',
      WANING_CRESCENT: 'Low - time for rest and preparation',
    };

    return energyMap[phase] || 'Undefined';
  }

  private getRecommendedActivities(phase: string): string[] {
    const activitiesMap = {
      NEW_MOON: ['Planning', 'Meditation', 'Setting goals'],
      WAXING_CRESCENT: ['Learning', 'Developing skills', 'New projects'],
      FIRST_QUARTER: ['Making decisions', 'Taking action', 'Overcoming obstacles'],
      WAXING_GIBBOUS: ['Completing projects', 'Detail work', 'Preparing for launch'],
      FULL_MOON: ['Manifestation', 'Celebration', 'Implementing plans'],
      WANING_GIBBOUS: ['Analyzing results', 'Evaluation', 'Correction'],
      LAST_QUARTER: ['Letting go', 'Cleansing', 'Forgiveness'],
      WANING_CRESCENT: ['Rest', 'Preparation', 'Inner work'],
    };

    return activitiesMap[phase] || [];
  }

  private getRecommendedCrystals(phase: string): string[] {
    const crystalsMap = {
      NEW_MOON: ['Moonstone', 'Pearl', 'Selenite'],
      WAXING_CRESCENT: ['Rose Quartz', 'Amethyst', 'Aventurine'],
      FIRST_QUARTER: ["Tiger's Eye", 'Hematite', 'Obsidian'],
      WAXING_GIBBOUS: ['Citrine', 'Topaz', 'Sunstone'],
      FULL_MOON: ['Quartz crystal', 'Diamond', 'White sapphire'],
      WANING_GIBBOUS: ['Labradorite', 'Azurite', 'Lapis Lazuli'],
      LAST_QUARTER: ['Black tourmaline', 'Dusty quartz', 'Shungite'],
      WANING_CRESCENT: ['Agate', 'Jasper', 'Serdoli'],
    };

    return crystalsMap[phase] || [];
  }
}
