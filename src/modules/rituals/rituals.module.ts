import { Module } from '@nestjs/common';
import { RitualsService } from './rituals.service';
import { RitualsController } from './rituals.controller';
import { PrismaService } from '../../common/database/prisma.service';

@Module({
  controllers: [RitualsController],
  providers: [RitualsService, PrismaService],
  exports: [RitualsService],
})
export class RitualsModule {}
