import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EnergyEngineService } from './energy-engine.service';
import { EnergyEngineController } from './energy-engine.controller';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';
import { AstroModule } from '../astro/astro.module';

@Module({
  imports: [ScheduleModule, AstroModule],
  controllers: [EnergyEngineController],
  providers: [EnergyEngineService, PrismaService, RedisService],
  exports: [EnergyEngineService],
})
export class EnergyEngineModule {}
