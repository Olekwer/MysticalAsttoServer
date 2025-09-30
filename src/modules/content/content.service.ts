import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { PrismaFactoryService } from '../../common/database/prisma-factory.service';

@Injectable()
export class ContentService {
  constructor(
    private prisma: PrismaService,
    private prismaFactory: PrismaFactoryService,
  ) {}

  // Use factory to avoid prepared statement conflicts
  async findAllRituals() {
    return this.prismaFactory.withClient(async (client) => {
      return client.ritual.findMany();
    });
  }

  async findAllStones() {
    return this.prismaFactory.withClient(async (client) => {
      return client.stone.findMany();
    });
  }

  async findAllTeaRecipes() {
    return this.prismaFactory.withClient(async (client) => {
      return client.teaRecipe.findMany();
    });
  }
}
