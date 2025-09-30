import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaFactoryService } from './prisma-factory.service';

@Global()
@Module({
  providers: [PrismaService, PrismaFactoryService],
  exports: [PrismaService, PrismaFactoryService],
})
export class DatabaseModule {}
