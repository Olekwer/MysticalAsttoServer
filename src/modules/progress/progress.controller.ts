import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProgressService } from './progress.service';

@ApiTags('Прогресс')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всего прогресса' })
  @ApiResponse({ status: 200, description: 'Список прогресса' })
  findAll() {
    return this.progressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение прогресса по ID' })
  @ApiResponse({ status: 200, description: 'Прогресс найден' })
  findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }
} 