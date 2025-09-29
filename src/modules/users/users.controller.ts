import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  getProfile(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personal dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  getDashboard(@Req() req: any) {
    return this.usersService.getDashboardData(req.user.id);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 200, description: 'Test successful' })
  test() {
    return {
      message: 'Test successful',
      timestamp: new Date().toISOString()
    };
  }

  @Get('simple-dashboard')
  @ApiOperation({ summary: 'Simple dashboard without auth' })
  @ApiResponse({ status: 200, description: 'Dashboard data' })
  simpleDashboard() {
    return {
      user: {
        id: 'test-id',
        email: 'test@example.com',
        zodiacSign: 'LEO',
        element: 'FIRE',
      },
      powerPlace: {
        name: 'Pyramids of Giza, Egypt',
        distance: 22
      },
      powerStone: {
        name: 'Sunstone',
        description: 'stone of leadership and confidence'
      },
      progress: {
        ritualsCompleted: 0
      }
    };
  }

  @Get('energy-dashboard')
  @ApiOperation({ summary: 'Energy dashboard with daily insights' })
  @ApiResponse({ status: 200, description: 'Energy dashboard data' })
  energyDashboard() {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('pl-PL', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('pl-PL', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });

    // Calculate energy level based on day of week and moon phase
    const energyLevel = this.calculateEnergyLevel(today);
    const moonPhase = this.getMoonPhase(today);
    const dailyRitual = this.getDailyRitual(today, energyLevel);

    return {
      date: {
        dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
        fullDate: dateStr
      },
      energy: {
        level: energyLevel,
        percentage: Math.round(energyLevel * 100),
        message: this.getEnergyMessage(dayOfWeek, energyLevel)
      },
      moon: {
        phase: moonPhase.name,
        description: moonPhase.description,
        message: moonPhase.message
      },
      ritual: {
        name: dailyRitual.name,
        message: dailyRitual.message
      },
      weeklyInsight: {
        text: "Obserwuj rytmy swojej energii. Każdy dzień niesie inne dary i wyzwania. Dostosuj swoją praktykę do naturalnych cykli."
      }
    };
  }

  private calculateEnergyLevel(date: Date): number {
    const dayOfWeek = date.getDay();
    const dayOfMonth = date.getDate();
    
    // Base energy by day of week (Wednesday is power day)
    const dayEnergy = {
      0: 0.6, // Sunday
      1: 0.7, // Monday
      2: 0.9, // Tuesday
      3: 0.95, // Wednesday - power day
      4: 0.8, // Thursday
      5: 0.75, // Friday
      6: 0.65 // Saturday
    };

    // Add some variation based on day of month
    const monthVariation = Math.sin(dayOfMonth / 31 * Math.PI * 2) * 0.1;
    
    return Math.max(0.3, Math.min(1.0, dayEnergy[dayOfWeek] + monthVariation));
  }

  private getMoonPhase(date: Date) {
    // Simplified moon phase calculation
    const lunarCycle = 29.53; // days
    const knownNewMoon = new Date('2025-01-01');
    const daysSinceNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

    if (phase < 0.125) {
      return {
        name: "Przybywająca - energia rośnie",
        description: "Waxing - energy grows",
        message: "Energia lunarna wspiera Twoje intencje"
      };
    } else if (phase < 0.375) {
      return {
        name: "Pierwsza kwadra - budowanie",
        description: "First quarter - building",
        message: "Czas na realizację planów"
      };
    } else if (phase < 0.625) {
      return {
        name: "Pełnia - szczyt mocy",
        description: "Full moon - peak power",
        message: "Maksymalna energia do działania"
      };
    } else if (phase < 0.875) {
      return {
        name: "Ubywająca - oczyszczanie",
        description: "Waning - cleansing",
        message: "Czas na uwolnienie tego, co nie służy"
      };
    } else {
      return {
        name: "Nów - nowy początek",
        description: "New moon - new beginning",
        message: "Idealny moment na nowe intencje"
      };
    }
  }

  private getDailyRitual(date: Date, energyLevel: number) {
    const dayOfWeek = date.getDay();
    const rituals = {
      0: { name: "Medytacja poranna", message: "Rozpocznij dzień w spokoju" },
      1: { name: "Picie świętej wody", message: "Idealny na dzisiejszą energię" },
      2: { name: "Spacer w naturze", message: "Połącz się z energią Ziemi" },
      3: { name: "Praktyka wdzięczności", message: "Dzień mocy - doceniaj dary" },
      4: { name: "Ćwiczenia oddechowe", message: "Zbalansuj swoją energię" },
      5: { name: "Rytuał oczyszczenia", message: "Przygotuj się na weekend" },
      6: { name: "Refleksja i planowanie", message: "Podsumuj tydzień" }
    };

    return rituals[dayOfWeek];
  }

  private getEnergyMessage(dayOfWeek: string, energyLevel: number) {
    if (dayOfWeek === 'środa') {
      return "Środa to Twój dzień mocy";
    } else if (energyLevel > 0.8) {
      return "Wysoka energia - wykorzystaj ją mądrze";
    } else if (energyLevel > 0.6) {
      return "Dobra energia - czas na działanie";
    } else {
      return "Spokojny dzień - zadbaj o siebie";
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление профиля текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Профиль обновлен' })
  updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 