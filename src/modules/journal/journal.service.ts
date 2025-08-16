import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  // Заглушка для базовой функциональности
  async findAll() {
    return this.prisma.journalEntry.findMany();
  }

  async findOne(id: string) {
    return this.prisma.journalEntry.findUnique({
      where: { id },
    });
  }
} 