import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('rituals')
  @ApiOperation({ summary: 'Get all rituals' })
  @ApiResponse({ status: 200, description: 'List of rituals' })
  findAllRituals() {
    return this.contentService.findAllRituals();
  }

  @Get('stones')
  @ApiOperation({ summary: 'Get all stones' })
  @ApiResponse({ status: 200, description: 'List of stones' })
  findAllStones() {
    return this.contentService.findAllStones();
  }

  @Get('tea-recipes')
  @ApiOperation({ summary: 'Get all tincture recipes' })
  @ApiResponse({ status: 200, description: 'List of tincture recipes' })
  findAllTeaRecipes() {
    return this.contentService.findAllTeaRecipes();
  }
}
