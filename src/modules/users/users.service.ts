import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      include: {
        profile: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profile: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        userRituals: {
          include: {
            ritual: true,
          },
        },
        journalEntries: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        achievements: {
          take: 10,
          orderBy: { unlockedAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: {
        profile: true,
      },
    });
  }

  async updateProfile(id: string, profileData: any) {
    await this.findOne(id);

    return this.prisma.userProfile.upsert({
      where: { userId: id },
      update: profileData,
      create: {
        userId: id,
        ...profileData,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async calculateZodiacSign(birthDate: Date): Promise<string> {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'ARIES';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'TAURUS';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'GEMINI';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'CANCER';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'LEO';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'VIRGO';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'LIBRA';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'SCORPIO';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'SAGITTARIUS';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'CAPRICORN';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'AQUARIUS';
    return 'PISCES';
  }

  async calculateElement(zodiacSign: string): Promise<string> {
    const fireSigns = ['ARIES', 'LEO', 'SAGITTARIUS'];
    const earthSigns = ['TAURUS', 'VIRGO', 'CAPRICORN'];
    const airSigns = ['GEMINI', 'LIBRA', 'AQUARIUS'];
    const waterSigns = ['CANCER', 'SCORPIO', 'PISCES'];

    if (fireSigns.includes(zodiacSign)) return 'FIRE';
    if (earthSigns.includes(zodiacSign)) return 'EARTH';
    if (airSigns.includes(zodiacSign)) return 'AIR';
    if (waterSigns.includes(zodiacSign)) return 'WATER';
    
    return 'FIRE'; // fallback
  }
} 