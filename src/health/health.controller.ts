import { Controller, Get, Req } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { I18nService } from '../common/i18n/i18n.service';

@ApiTags('Application Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    // private i18nService: I18nService, // Временно отключен
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Application is healthy' })
  async check(@Req() _req: any) {
    // const language = this.i18nService.detectLanguage(_req);
    // const welcomeMessage = await this.i18nService.translate(_req, 'common.welcome');

    const healthCheck = await this.health.check([
      () => Promise.resolve({ database: { status: 'up' } }),
    ]);

    return {
      ...healthCheck,
      message: 'Welcome to Mystical Astro API', // Временное сообщение
      detectedLanguage: 'en', // Временный язык
      timestamp: new Date().toISOString(),
    };
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Test successful' })
  test() {
    return {
      message: 'Test successful - UPDATED',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('demo-energy')
  @ApiOperation({ summary: 'Demo energy dashboard' })
  @ApiResponse({ status: 200, description: 'Demo energy data' })
  demoEnergy() {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Calculate energy level based on day of week
    const energyLevel = this.calculateEnergyLevel(today);
    const moonPhase = this.getMoonPhase(today);
    const dailyRitual = this.getDailyRitual(today, energyLevel);

    return {
      date: {
        dayOfWeek: dayOfWeek,
        fullDate: dateStr,
      },
      energy: {
        level: energyLevel,
        percentage: Math.round(energyLevel * 100),
        message: this.getEnergyMessage(dayOfWeek, energyLevel),
      },
      moon: {
        phase: moonPhase.name,
        description: moonPhase.description,
        message: moonPhase.message,
      },
      ritual: {
        name: dailyRitual.name,
        message: dailyRitual.message,
      },
      weeklyInsight: {
        text: 'Observe the rhythms of your energy. Each day brings different gifts and challenges. Adapt your practice to natural cycles.',
      },
    };
  }

  @Get('energy-dashboard')
  @ApiOperation({ summary: 'Energy dashboard with daily insights' })
  @ApiResponse({ status: 200, description: 'Energy dashboard data' })
  energyDashboard() {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('pl-PL', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    // Calculate energy level based on day of week
    const energyLevel = this.calculateEnergyLevel(today);
    const moonPhase = this.getMoonPhase(today);
    const dailyRitual = this.getDailyRitual(today, energyLevel);

    return {
      date: {
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
        fullDate: dateStr,
      },
      energy: {
        level: energyLevel,
        percentage: Math.round(energyLevel * 100),
        message: this.getEnergyMessage(dayOfWeek, energyLevel),
      },
      moon: {
        phase: moonPhase.name,
        description: moonPhase.description,
        message: moonPhase.message,
      },
      ritual: {
        name: dailyRitual.name,
        message: dailyRitual.message,
      },
      weeklyInsight: {
        text: 'Obserwuj rytmy swojej energii. Każdy dzień niesie inne dary i wyzwania. Dostosuj swoją praktykę do naturalnych cykli.',
      },
    };
  }

  private calculateEnergyLevel(date: Date): number {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();

    // Base energy by day of week (Wednesday is power day)
    const dayEnergy = {
      0: 0.6, // Sunday
      1: 0.7, // Monday
      2: 0.9, // Tuesday
      3: 0.95, // Wednesday - power day
      4: 0.8, // Thursday
      5: 0.75, // Friday
      6: 0.65, // Saturday
    };

    // Add some variation based on day of month
    const monthVariation = Math.sin((dayOfMonth / 31) * Math.PI * 2) * 0.1;

    return Math.max(0.3, Math.min(1.0, dayEnergy[dayOfWeek] + monthVariation));
  }

  private getMoonPhase(date: Date) {
    // Simplified moon phase calculation
    const lunarCycle = 29.53; // days
    const knownNewMoon = new Date('2025-01-01');
    const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

    if (phase < 0.125) {
      return {
        name: 'Waxing Crescent - Energy Growing',
        description: 'Waxing - energy grows',
        message: 'Lunar energy supports your intentions',
      };
    } else if (phase < 0.375) {
      return {
        name: 'First Quarter - Building',
        description: 'First quarter - building',
        message: 'Time to realize your plans',
      };
    } else if (phase < 0.625) {
      return {
        name: 'Full Moon - Peak Power',
        description: 'Full moon - peak power',
        message: 'Maximum energy for action',
      };
    } else if (phase < 0.875) {
      return {
        name: 'Waning Gibbous - Cleansing',
        description: 'Waning - cleansing',
        message: 'Time to release what no longer serves',
      };
    } else {
      return {
        name: 'New Moon - New Beginning',
        description: 'New moon - new beginning',
        message: 'Perfect moment for new intentions',
      };
    }
  }

  private getDailyRitual(date: Date, _energyLevel: number) {
    const dayOfWeek = date.getDay();
    const rituals = {
      0: { name: 'Morning Meditation', message: 'Start your day in peace' },
      1: { name: 'Sacred Water Ritual', message: "Perfect for today's energy" },
      2: { name: 'Nature Walk', message: "Connect with Earth's energy" },
      3: { name: 'Gratitude Practice', message: 'Power day - appreciate the gifts' },
      4: { name: 'Breathing Exercises', message: 'Balance your energy' },
      5: { name: 'Cleansing Ritual', message: 'Prepare for the weekend' },
      6: { name: 'Reflection & Planning', message: 'Summarize your week' },
    };

    return rituals[dayOfWeek];
  }

  private getEnergyMessage(dayOfWeek: string, energyLevel: number) {
    if (dayOfWeek === 'Wednesday') {
      return 'Wednesday is your power day';
    } else if (energyLevel > 0.8) {
      return 'High energy - use it wisely';
    } else if (energyLevel > 0.6) {
      return 'Good energy - time for action';
    } else {
      return 'Peaceful day - take care of yourself';
    }
  }
}
