import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Аналитика')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всей аналитики' })
  @ApiResponse({ status: 200, description: 'Список аналитических данных' })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение аналитики по ID' })
  @ApiResponse({ status: 200, description: 'Аналитические данные найдены' })
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne(id);
  }
} 