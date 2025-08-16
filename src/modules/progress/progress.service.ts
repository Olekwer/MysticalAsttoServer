import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  // Stub for basic functionality
  async findAll() {
    return this.prisma.progress.findMany();
  }

  async findOne(id: string) {
    return this.prisma.progress.findUnique({
      where: { id },
    });
  }
} 