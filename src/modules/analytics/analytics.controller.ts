import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all analytics' })
  @ApiResponse({ status: 200, description: 'List of analytics data' })
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics by ID' })
  @ApiResponse({ status: 200, description: 'Analytics data found' })
  findOne(@Param('id') id: string) {
    return this.analyticsService.findOne(id);
  }
} 