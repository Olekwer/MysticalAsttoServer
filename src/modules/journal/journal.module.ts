import { Module } from '@nestjs/common';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';
import { PrismaService } from '../../common/database/prisma.service';

@Module({
  controllers: [JournalController],
  providers: [JournalService, PrismaService],
  exports: [JournalService],
})
export class JournalModule {}
