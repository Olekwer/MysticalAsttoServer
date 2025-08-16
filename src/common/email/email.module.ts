import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { I18nModule } from '../i18n/i18n.module';
import { EmailService } from './email.service';

@Module({
  imports: [ConfigModule], // I18nModule временно отключен
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {} 