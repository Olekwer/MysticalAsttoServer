import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RecommenderService } from './recommender.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}

  @Get('today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recommendations for today' })
  @ApiResponse({ status: 200, description: 'Recommendations for today' })
  async getTodayRecommendations(@Req() req: any) {
    return this.recommenderService.getUserRecommendations(req.user.id);
  }

  @Get('feed/today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get full feed for today' })
  @ApiResponse({ status: 200, description: 'Full feed with recommendations and energy indicator' })
  async getFeedToday(@Req() req: any) {
    return this.recommenderService.getFeedToday(req.user.id);
  }
} 