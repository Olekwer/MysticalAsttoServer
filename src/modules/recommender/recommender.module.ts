import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RecommenderService } from './recommender.service';
import { RecommenderController } from './recommender.controller';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { EnergyEngineModule } from '../energy-engine/energy-engine.module';
import { AstroModule } from '../astro/astro.module';

@Module({
  imports: [ScheduleModule, EnergyEngineModule, AstroModule],
  controllers: [RecommenderController],
  providers: [RecommenderService, PrismaService, RedisService],
  exports: [RecommenderService],
})
export class RecommenderModule {}
