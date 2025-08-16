import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommenderService } from './recommender.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Рекомендации')
@Controller('recommendations')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get('today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение рекомендаций на сегодня' })
  @ApiResponse({ status: 200, description: 'Рекомендации на сегодня' })
  async getTodayRecommendations(@Req() req: any) {
    return this.recommenderService.getUserRecommendations(req.user.id);
  }

  @Get('feed/today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получение полного фида на сегодня' })
  @ApiResponse({ status: 200, description: 'Полный фид с рекомендациями и энергетическим показателем' })
  async getFeedToday(@Req() req: any) {
    return this.recommenderService.getFeedToday(req.user.id);
  }
} 