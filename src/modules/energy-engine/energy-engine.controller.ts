import { Controller, Get, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EnergyEngineService } from './energy-engine.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Энергетический движок')
@Controller('energy')
export class EnergyEngineController {
  constructor(private readonly energyEngineService: EnergyEngineService) {}

  @Get('today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение энергетического показателя на сегодня' })
  @ApiResponse({ status: 200, description: 'Энергетический показатель' })
  async getTodayEnergy(@Req() req: any) {
    return this.energyEngineService.getUserEnergyScore(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение истории энергетических показателей' })
  @ApiQuery({ name: 'days', description: 'Количество дней', example: 30, required: false })
  @ApiResponse({ status: 200, description: 'История энергетических показателей' })
  async getEnergyHistory(
    @Req() req: any,
    @Query('days', new ParseIntPipe({ optional: true })) days: number = 30,
  ) {
    return this.energyEngineService.getUserEnergyHistory(req.user.id, days);
  }

  @Get('calculate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Принудительный расчет энергетического показателя' })
  @ApiResponse({ status: 200, description: 'Энергетический показатель рассчитан' })
  async calculateEnergy(@Req() req: any) {
    const score = await this.energyEngineService.calculateDailyEnergyForUser(req.user.id);
    return { score, message: 'Энергетический показатель рассчитан' };
  }
} 