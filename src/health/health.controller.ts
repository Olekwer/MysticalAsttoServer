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
  async check(@Req() req: any) {
    // const language = this.i18nService.detectLanguage(req);
    // const welcomeMessage = await this.i18nService.translate(req, 'common.welcome');
    
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
} 