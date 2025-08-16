import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AstroService } from './astro.service';

@ApiTags('Астрология')
@Controller('astro')
export class AstroController {
  constructor(private readonly astroService: AstroService) {}

  @Get('moon/current')
  @ApiOperation({ summary: 'Получение текущей лунной фазы' })
  @ApiResponse({ status: 200, description: 'Текущая лунная фаза' })
  async getCurrentMoonPhase() {
    return this.astroService.getCurrentMoonPhase();
  }

  @Get('moon/date')
  @ApiOperation({ summary: 'Получение лунной фазы для конкретной даты' })
  @ApiQuery({ name: 'date', description: 'Дата в формате YYYY-MM-DD', example: '2024-01-15' })
  @ApiResponse({ status: 200, description: 'Лунная фаза для указанной даты' })
  async getMoonPhaseForDate(@Query('date') dateStr: string) {
    const date = new Date(dateStr);
    return this.astroService.getMoonPhaseForDate(date);
  }

  @Get('moon/period')
  @ApiOperation({ summary: 'Получение лунных фаз за период' })
  @ApiQuery({ name: 'startDate', description: 'Начальная дата', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'Конечная дата', example: '2024-01-31' })
  @ApiResponse({ status: 200, description: 'Лунные фазы за период' })
  async getMoonPhasesForPeriod(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    return this.astroService.getMoonPhasesForPeriod(startDate, endDate);
  }

  @Get('influences/:date')
  @ApiOperation({ summary: 'Получение астрологических влияний для даты' })
  @ApiQuery({ name: 'date', description: 'Дата в формате YYYY-MM-DD', example: '2024-01-15' })
  @ApiResponse({ status: 200, description: 'Астрологические влияния' })
  async getAstrologicalInfluences(@Param('date') dateStr: string) {
    const date = new Date(dateStr);
    return this.astroService.getAstrologicalInfluences(date);
  }

  @Get('influences/today')
  @ApiOperation({ summary: 'Получение астрологических влияний на сегодня' })
  @ApiResponse({ status: 200, description: 'Астрологические влияния на сегодня' })
  async getTodayInfluences() {
    const today = new Date();
    return this.astroService.getAstrologicalInfluences(today);
  }
} 