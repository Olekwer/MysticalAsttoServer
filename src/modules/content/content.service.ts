import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // Stub for basic functionality
  async findAllRituals() {
    return this.prisma.ritual.findMany();
  }

  async findAllStones() {
    return this.prisma.stone.findMany();
  }

  async findAllTeaRecipes() {
    return this.prisma.teaRecipe.findMany();
  }
} 