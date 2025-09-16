import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocationService } from '../location/location.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private locationService: LocationService
  ) {}

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
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
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

    // Prepare data for update
    const updateData: any = { ...updateUserDto };

    // If birthDate is being updated, automatically calculate zodiac sign and element
    if (updateUserDto.birthDate) {
      const birthDate = new Date(updateUserDto.birthDate);
      const zodiacSign = await this.calculateZodiacSign(birthDate);
      const element = await this.calculateElement(zodiacSign);
      
      updateData.zodiacSign = zodiacSign as any;
      updateData.element = element as any;
      updateData.birthDate = birthDate; // Convert to Date object
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
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

  async getDashboardData(userId: string) {
    try {
      // Get basic user data
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          zodiacSign: true,
          element: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Get nearest power place from user's location-based places
      const nearestPowerPlace = await this.locationService.getUserNearestPowerPlace(userId);
      
      // Fallback to zodiac-based power place if no location-based places found
      const powerPlace = nearestPowerPlace ? {
        name: nearestPowerPlace.name,
        distance: nearestPowerPlace.distance
      } : this.getPowerPlaceForSign(user.zodiacSign);
      
      // Get power stone based on zodiac sign
      const powerStone = this.getPowerStoneForSign(user.zodiacSign);

      return {
        user: {
          id: user.id,
          email: user.email,
          zodiacSign: user.zodiacSign,
          element: user.element,
        },
        powerPlace,
        powerStone,
        progress: {
          ritualsCompleted: 0, // Simplified for now
        },
      };
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      throw error;
    }
  }

  private getPowerPlaceForSign(zodiacSign: string) {
    const powerPlaces: { [key: string]: { name: string; distance: number } } = {
      'ARIES': { name: 'Mount Olympus, Greece', distance: 25 },
      'TAURUS': { name: 'Stonehenge, UK', distance: 18 },
      'GEMINI': { name: 'Machu Picchu, Peru', distance: 32 },
      'CANCER': { name: 'Lake Błędno, Poland', distance: 14 },
      'LEO': { name: 'Pyramids of Giza, Egypt', distance: 22 },
      'VIRGO': { name: 'Glastonbury Tor, UK', distance: 16 },
      'LIBRA': { name: 'Temple of Delphi, Greece', distance: 28 },
      'SCORPIO': { name: 'Sedona Vortex, USA', distance: 35 },
      'SAGITTARIUS': { name: 'Uluru, Australia', distance: 42 },
      'CAPRICORN': { name: 'Mount Fuji, Japan', distance: 19 },
      'AQUARIUS': { name: 'Crystal Cave, Iceland', distance: 26 },
      'PISCES': { name: 'Lake Błędno, Poland', distance: 14 },
    };
    
    return powerPlaces[zodiacSign] || powerPlaces['PISCES'];
  }

  private getPowerStoneForSign(zodiacSign: string) {
    const powerStones: { [key: string]: { name: string; description: string } } = {
      'ARIES': { name: 'Carnelian', description: 'stone of courage and energy' },
      'TAURUS': { name: 'Rose Quartz', description: 'stone of love and harmony' },
      'GEMINI': { name: 'Citrine', description: 'stone of communication and clarity' },
      'CANCER': { name: 'Moonstone', description: 'stone of intuition and emotions' },
      'LEO': { name: 'Sunstone', description: 'stone of leadership and confidence' },
      'VIRGO': { name: 'Peridot', description: 'stone of healing and growth' },
      'LIBRA': { name: 'Opal', description: 'stone of balance and harmony' },
      'SCORPIO': { name: 'Obsidian', description: 'stone of transformation and protection' },
      'SAGITTARIUS': { name: 'Turquoise', description: 'stone of wisdom and truth' },
      'CAPRICORN': { name: 'Garnet', description: 'stone of strength and determination' },
      'AQUARIUS': { name: 'Amethyst', description: 'stone of spirituality and intuition' },
      'PISCES': { name: 'Aquamarine', description: 'stone of peace and tranquility' },
    };
    
    return powerStones[zodiacSign] || powerStones['PISCES'];
  }
} 