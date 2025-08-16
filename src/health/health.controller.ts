import { Controller, Get, Req } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { I18nService } from '../common/i18n/i18n.service';

@ApiTags('Здоровье приложения')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private i18nService: I18nService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Проверка здоровья приложения' })
  @ApiResponse({ status: 200, description: 'Приложение здорово' })
  async check(@Req() req: any) {
    const language = this.i18nService.detectLanguage(req);
    const welcomeMessage = await this.i18nService.translate(req, 'common.welcome');
    
    const healthCheck = await this.health.check([
      () => this.db.pingCheck('database'),
    ]);

    return {
      ...healthCheck,
      message: welcomeMessage,
      detectedLanguage: language,
      timestamp: new Date().toISOString(),
    };
  }
} 