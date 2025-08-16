import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { TerminusModule } from '@nestjs/terminus';

    // Application modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ContentModule } from './modules/content/content.module';
import { AstroModule } from './modules/astro/astro.module';
import { EnergyEngineModule } from './modules/energy-engine/energy-engine.module';
import { RecommenderModule } from './modules/recommender/recommender.module';
import { RitualsModule } from './modules/rituals/rituals.module';
import { JournalModule } from './modules/journal/journal.module';
import { ProgressModule } from './modules/progress/progress.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './health/health.module';

    // Common modules
import { DatabaseModule } from './common/database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { RabbitMQModule } from './common/rabbitmq/rabbitmq.module';
import { StorageModule } from './common/storage/storage.module';
import { EmailModule } from './common/email/email.module';
import { I18nModule } from './common/i18n/i18n.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Task scheduler
    ScheduleModule.forRoot(),

    // Queues
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Health monitoring
    TerminusModule,

    // Common modules
    DatabaseModule,
    RedisModule,
    RabbitMQModule,
    StorageModule,
    EmailModule,
    // I18nModule, // Временно отключен

    // Application modules
    AuthModule,
    UsersModule,
    ContentModule,
    AstroModule,
    EnergyEngineModule,
    RecommenderModule,
    RitualsModule,
    JournalModule,
    ProgressModule,
    SubscriptionsModule,
    NotificationsModule,
    AnalyticsModule,
    HealthModule,
  ],
})
export class AppModule {} 