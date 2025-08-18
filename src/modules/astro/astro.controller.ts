import { Controller, Get, Post, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AstroService } from './astro.service';
import { NatalChartDto } from './dto/natal-chart.dto';

@ApiTags('Astrology')
@Controller('astro')
export class AstroController {
  constructor(private readonly astroService: AstroService) {}

  @Post('natal-chart')
  @ApiOperation({ summary: 'Generate natal chart' })
  @ApiBody({ 
    description: 'Data for natal chart generation',
    type: NatalChartDto,
    examples: {
      example1: {
        summary: 'Example data',
        value: {
          birthDate: '1990-05-15',
          birthTime: '14:30',
          birthPlace: 'Moscow, Russia'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Natal chart generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async generateNatalChart(@Body() natalChartData: NatalChartDto) {
    return this.astroService.generateNatalChart(natalChartData);
  }

  @Get('moon/current')
  @ApiOperation({ summary: 'Get current moon phase' })
  @ApiResponse({ status: 200, description: 'Current moon phase' })
  async getCurrentMoonPhase() {
    return this.astroService.getCurrentMoonPhase();
  }

  @Get('moon/date')
  @ApiOperation({ summary: 'Get moon phase for specific date' })
  @ApiQuery({ name: 'date', description: 'Date in YYYY-MM-DD format', example: '2024-01-15' })
  @ApiResponse({ status: 200, description: 'Moon phase for specified date' })
  async getMoonPhaseForDate(@Query('date') dateStr: string) {
    const date = new Date(dateStr);
    return this.astroService.getMoonPhaseForDate(date);
  }

  @Get('moon/period')
  @ApiOperation({ summary: 'Get moon phases for period' })
  @ApiQuery({ name: 'startDate', description: 'Start date', example: '2024-01-01' })
  @ApiQuery({ name: 'endDate', description: 'End date', example: '2024-01-31' })
  @ApiResponse({ status: 200, description: 'Moon phases for period' })
  async getMoonPhasesForPeriod(
    @Query('startDate') startDateStr: string,
    @Query('endDate') endDateStr: string,
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    return this.astroService.getMoonPhasesForPeriod(startDate, endDate);
  }

  @Get('influences/:date')
  @ApiOperation({ summary: 'Get astrological influences for date' })
  @ApiQuery({ name: 'date', description: 'Date in YYYY-MM-DD format', example: '2024-01-15' })
  @ApiResponse({ status: 200, description: 'Astrological influences' })
  async getAstrologicalInfluences(@Param('date') dateStr: string) {
    const date = new Date(dateStr);
    return this.astroService.getAstrologicalInfluences(date);
  }

  @Get('influences/today')
  @ApiOperation({ summary: 'Get astrological influences for today' })
  @ApiResponse({ status: 200, description: 'Astrological influences for today' })
  async getTodayInfluences() {
    const today = new Date();
    return this.astroService.getAstrologicalInfluences(today);
  }
} 