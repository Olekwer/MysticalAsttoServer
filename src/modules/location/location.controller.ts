import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface LocationRequest {
  latitude?: number;
  longitude?: number;
}

interface PowerPlaceResponse {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  type: string;
  energyLevel: number;
  distance: number;
}

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('update-location')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user location and generate power places' })
  @ApiResponse({ status: 200, description: 'Location updated and power places generated' })
  async updateLocation(
    @Body() locationData: LocationRequest,
    @Req() req: any,
  ): Promise<{ message: string; powerPlaces: PowerPlaceResponse[] }> {
    const userId = req.user.id;
    let latitude: number;
    let longitude: number;

    // If coordinates provided, use them
    if (locationData.latitude && locationData.longitude) {
      latitude = locationData.latitude;
      longitude = locationData.longitude;
    } else {
      // Try to get location from IP
      const clientIP = req.ip || req.connection.remoteAddress;
      const location = await this.locationService.getLocationFromIP(clientIP);

      if (!location) {
        throw new Error('Unable to determine location');
      }

      latitude = location.latitude;
      longitude = location.longitude;
    }

    // Generate power places for user
    const powerPlaces = await this.locationService.generateUserPowerPlaces(
      userId,
      latitude,
      longitude,
    );

    return {
      message: 'Location updated and power places generated',
      powerPlaces,
    };
  }

  @Get('nearest-power-place')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user nearest power place' })
  @ApiResponse({ status: 200, description: 'Nearest power place retrieved' })
  async getNearestPowerPlace(@Req() req: any): Promise<PowerPlaceResponse | null> {
    const userId = req.user.id;
    return await this.locationService.getUserNearestPowerPlace(userId);
  }

  @Get('power-places')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user power places' })
  @ApiResponse({ status: 200, description: 'User power places retrieved' })
  async getUserPowerPlaces(@Req() req: any): Promise<PowerPlaceResponse[]> {
    try {
      const userId = req.user.id;
      console.log('Getting power places for user:', userId);
      const result = await this.locationService.getUserPowerPlaces(userId);
      console.log('Power places result:', result);
      return result;
    } catch (error) {
      console.error('Error in getUserPowerPlaces:', error);
      return [];
    }
  }

  @Get('test-power-places')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test power places endpoint' })
  async testPowerPlaces(@Req() req: any): Promise<any> {
    try {
      const userId = req.user.id;
      console.log('Testing power places for user:', userId);

      // Test direct database query
      const userPowerPlaces = await this.locationService['prisma'].userPowerPlace.findMany({
        where: {
          userId,
          isActive: true,
        },
        include: {
          powerPlace: true,
        },
      });

      console.log('Direct query result:', userPowerPlaces);

      return {
        userId,
        userPowerPlaces,
        count: userPowerPlaces.length,
      };
    } catch (error) {
      console.error('Error in testPowerPlaces:', error);
      return { error: error.message };
    }
  }
}
