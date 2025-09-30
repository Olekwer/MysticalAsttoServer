import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

interface Location {
  latitude: number;
  longitude: number;
}

interface PowerPlace {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: string;
  energyLevel: number;
  distance: number;
}

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get user's location from IP address (fallback method)
   */
  async getLocationFromIP(ip: string): Promise<Location | null> {
    try {
      // Using a free IP geolocation service
      const response = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await response.json();

      if (data.status === 'success') {
        return {
          latitude: data.lat,
          longitude: data.lon,
        };
      }
    } catch (error) {
      this.logger.error('Failed to get location from IP:', error);
    }

    return null;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Find nearby power places within radius
   */
  async findNearbyPowerPlaces(
    latitude: number,
    longitude: number,
    radiusKm: number = 60,
  ): Promise<PowerPlace[]> {
    const allPlaces = await this.prisma.powerPlace.findMany();

    const nearbyPlaces = allPlaces
      .map(place => ({
        ...place,
        distance: this.calculateDistance(latitude, longitude, place.latitude, place.longitude),
      }))
      .filter(place => place.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 7); // Get top 7 closest places

    return nearbyPlaces;
  }

  /**
   * Generate and assign power places for user
   */
  async generateUserPowerPlaces(
    userId: string,
    latitude: number,
    longitude: number,
  ): Promise<PowerPlace[]> {
    // First, remove existing user power places
    await this.prisma.userPowerPlace.deleteMany({
      where: { userId },
    });

    // Find nearby places
    const nearbyPlaces = await this.findNearbyPowerPlaces(latitude, longitude);

    // Create user power place records
    const userPowerPlaces = await Promise.all(
      nearbyPlaces.map(place =>
        this.prisma.userPowerPlace.create({
          data: {
            userId,
            powerPlaceId: place.id,
            distance: place.distance,
          },
          include: {
            powerPlace: true,
          },
        }),
      ),
    );

    return userPowerPlaces.map(upp => ({
      id: upp.powerPlace.id,
      name: upp.powerPlace.name,
      description: upp.powerPlace.description,
      latitude: upp.powerPlace.latitude,
      longitude: upp.powerPlace.longitude,
      type: upp.powerPlace.type,
      energyLevel: upp.powerPlace.energyLevel,
      distance: upp.distance,
    }));
  }

  /**
   * Get user's nearest power place
   */
  async getUserNearestPowerPlace(userId: string): Promise<PowerPlace | null> {
    const userPowerPlace = await this.prisma.userPowerPlace.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { distance: 'asc' },
      include: {
        powerPlace: true,
      },
    });

    if (!userPowerPlace) {
      return null;
    }

    return {
      id: userPowerPlace.powerPlace.id,
      name: userPowerPlace.powerPlace.name,
      description: userPowerPlace.powerPlace.description,
      latitude: userPowerPlace.powerPlace.latitude,
      longitude: userPowerPlace.powerPlace.longitude,
      type: userPowerPlace.powerPlace.type,
      energyLevel: userPowerPlace.powerPlace.energyLevel,
      distance: userPowerPlace.distance,
    };
  }

  /**
   * Get all user's power places
   */
  async getUserPowerPlaces(userId: string): Promise<PowerPlace[]> {
    try {
      const userPowerPlaces = await this.prisma.userPowerPlace.findMany({
        where: {
          userId,
          isActive: true,
        },
        orderBy: { distance: 'asc' },
        include: {
          powerPlace: true,
        },
      });

      return userPowerPlaces.map(upp => ({
        id: upp.powerPlace.id,
        name: upp.powerPlace.name,
        description: upp.powerPlace.description,
        latitude: upp.powerPlace.latitude,
        longitude: upp.powerPlace.longitude,
        type: upp.powerPlace.type,
        energyLevel: upp.powerPlace.energyLevel,
        distance: upp.distance,
      }));
    } catch (error) {
      this.logger.error('Error getting user power places:', error);
      return [];
    }
  }
}
