import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Контент')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('rituals')
  @ApiOperation({ summary: 'Получение всех ритуалов' })
  @ApiResponse({ status: 200, description: 'Список ритуалов' })
  findAllRituals() {
    return this.contentService.findAllRituals();
  }

  @Get('stones')
  @ApiOperation({ summary: 'Получение всех камней' })
  @ApiResponse({ status: 200, description: 'Список камней' })
  findAllStones() {
    return this.contentService.findAllStones();
  }

  @Get('tea-recipes')
  @ApiOperation({ summary: 'Получение всех рецептов настоев' })
  @ApiResponse({ status: 200, description: 'Список рецептов настоев' })
  findAllTeaRecipes() {
    return this.contentService.findAllTeaRecipes();
  }
} 