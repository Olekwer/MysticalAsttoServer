import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  // Заглушка для базовой функциональности
  async findAll() {
    return this.prisma.subscription.findMany();
  }

  async findOne(id: string) {
    return this.prisma.subscription.findUnique({
      where: { id },
    });
  }
} 