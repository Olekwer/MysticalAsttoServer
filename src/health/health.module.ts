import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { I18nModule } from '../common/i18n/i18n.module';

@Module({
  imports: [TerminusModule, I18nModule],
  controllers: [HealthController],
})
export class HealthModule {}
