import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class RitualsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ritual.findMany({
      include: {
        RitualToRitualTag: {
          include: {
            ritual_tags: true,
          },
        },
        location: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.ritual.findUnique({
      where: { id },
      include: {
        RitualToRitualTag: {
          include: {
            ritual_tags: true,
          },
        },
        location: true,
        userRituals: true,
      },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.ritual.findMany({
      where: { category },
      include: {
        RitualToRitualTag: {
          include: {
            ritual_tags: true,
          },
        },
        location: true,
      },
    });
  }

  async findByDifficulty(difficulty: string) {
    return this.prisma.ritual.findMany({
      where: { difficulty },
      include: {
        RitualToRitualTag: {
          include: {
            ritual_tags: true,
          },
        },
        location: true,
      },
    });
  }

  async startRitual(userId: string, ritualId: string) {
    return this.prisma.userRitual.upsert({
      where: {
        userId_ritualId: {
          userId,
          ritualId,
        },
      },
      update: {
        status: 'ACTIVE',
        progress: 0,
        startedAt: new Date(),
      },
      create: {
        userId,
        ritualId,
        status: 'ACTIVE',
        progress: 0,
      },
      include: {
        ritual: {
          include: {
            RitualToRitualTag: {
              include: {
                ritual_tags: true,
              },
            },
            location: true,
          },
        },
      },
    });
  }

  async updateRitualProgress(userId: string, ritualId: string, progress: number) {
    return this.prisma.userRitual.update({
      where: {
        userId_ritualId: {
          userId,
          ritualId,
        },
      },
      data: {
        progress,
      },
    });
  }

  async completeRitual(userId: string, ritualId: string, notes?: string) {
    return this.prisma.userRitual.update({
      where: {
        userId_ritualId: {
          userId,
          ritualId,
        },
      },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
        notes,
      },
    });
  }

  async getUserRituals(userId: string) {
    return this.prisma.userRitual.findMany({
      where: { userId },
      include: {
        ritual: {
          include: {
            RitualToRitualTag: {
              include: {
                ritual_tags: true,
              },
            },
            location: true,
          },
        },
      },
      orderBy: {
        startedAt: 'desc',
      },
    });
  }
}
