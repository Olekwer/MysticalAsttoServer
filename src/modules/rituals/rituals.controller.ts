import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RitualsService } from './rituals.service';

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

  @Get(':id')
  @ApiOperation({ summary: 'Get ritual by ID' })
  @ApiResponse({ status: 200, description: 'Ritual found' })
  findOne(@Param('id') id: string) {
    return this.ritualsService.findOne(id);
  }
} 