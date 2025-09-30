import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AstroService } from './astro.service';
import { AstroController } from './astro.controller';
import { PrismaService } from '../../common/database/prisma.service';
import { RedisService } from '../../common/redis/redis.service';

@Module({
  imports: [ScheduleModule],
  controllers: [AstroController],
  providers: [AstroService, PrismaService, RedisService],
  exports: [AstroService],
})
export class AstroModule {}
