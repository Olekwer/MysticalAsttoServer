import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RitualsService } from './rituals.service';

@ApiTags('Ритуалы')
@Controller('rituals')
export class RitualsController {
  constructor(private readonly ritualsService: RitualsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех ритуалов' })
  @ApiResponse({ status: 200, description: 'Список ритуалов' })
  findAll() {
    return this.ritualsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение ритуала по ID' })
  @ApiResponse({ status: 200, description: 'Ритуал найден' })
  findOne(@Param('id') id: string) {
    return this.ritualsService.findOne(id);
  }
} 