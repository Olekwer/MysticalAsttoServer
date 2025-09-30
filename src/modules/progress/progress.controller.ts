import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Get all progress' })
  @ApiResponse({ status: 200, description: 'List of progress' })
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get progress by ID' })
  @ApiResponse({ status: 200, description: 'Progress found' })
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }
}
