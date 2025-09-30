import { Controller, Get, Post, Put, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RitualsService } from './rituals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Rituals')
@Controller('rituals')
export class RitualsController {
  constructor(private readonly ritualsService: RitualsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rituals' })
  @ApiResponse({ status: 200, description: 'List of rituals' })
  findAll() {
    return this.ritualsService.findAll();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get rituals by category' })
  @ApiResponse({ status: 200, description: 'List of rituals in category' })
  findByCategory(@Param('category') category: string) {
    return this.ritualsService.findByCategory(category);
  }

  @Get('difficulty/:difficulty')
  @ApiOperation({ summary: 'Get rituals by difficulty' })
  @ApiResponse({ status: 200, description: 'List of rituals by difficulty' })
  findByDifficulty(@Param('difficulty') difficulty: string) {
    return this.ritualsService.findByDifficulty(difficulty);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ritual by ID' })
  @ApiResponse({ status: 200, description: 'Ritual found' })
  findOne(@Param('id') id: string) {
    return this.ritualsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/start')
  @ApiOperation({ summary: 'Start a ritual' })
  @ApiResponse({ status: 200, description: 'Ritual started' })
  startRitual(@Param('id') ritualId: string, @Request() req: any) {
    return this.ritualsService.startRitual(req.user.id, ritualId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id/progress')
  @ApiOperation({ summary: 'Update ritual progress' })
  @ApiResponse({ status: 200, description: 'Progress updated' })
  updateProgress(
    @Param('id') ritualId: string,
    @Body('progress') progress: number,
    @Request() req: any,
  ) {
    return this.ritualsService.updateRitualProgress(req.user.id, ritualId, progress);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete a ritual' })
  @ApiResponse({ status: 200, description: 'Ritual completed' })
  completeRitual(@Param('id') ritualId: string, @Body('notes') notes: string, @Request() req: any) {
    return this.ritualsService.completeRitual(req.user.id, ritualId, notes);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/my-rituals')
  @ApiOperation({ summary: 'Get user rituals' })
  @ApiResponse({ status: 200, description: 'User rituals' })
  getUserRituals(@Request() req: any) {
    return this.ritualsService.getUserRituals(req.user.id);
  }
}
