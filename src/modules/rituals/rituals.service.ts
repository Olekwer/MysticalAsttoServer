import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class RitualsService {
  constructor(private prisma: PrismaService) {}

  // Stub for basic functionality
  async findAll() {
    return this.prisma.ritual.findMany();
  }

  async findOne(id: string) {
    return this.prisma.ritual.findUnique({
      where: { id },
    });
  }
} 