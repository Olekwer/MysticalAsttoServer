import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { I18nModule } from '../i18n/i18n.module';

@Module({
  imports: [ConfigModule, I18nModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {} 