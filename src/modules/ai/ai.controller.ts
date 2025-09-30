import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface TextGenerationRequest {
  text: string;
  type?: 'general' | 'astrological' | 'energy' | 'mystical';
}

@ApiTags('AI')
@Controller('ai')
export class AIController {
  constructor() {}

  @Post('generate-text')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate mystical text based on user input' })
  @ApiResponse({ status: 200, description: 'Text generated successfully' })
  async generateText(
    @Body() request: TextGenerationRequest,
    @Req() _req: any,
  ): Promise<{ generatedText: string }> {
    // AI functionality temporarily disabled
    return {
      generatedText: `🌟 Mystical Response: I sense your energy asking "${request.text}". The universe whispers that you are on the right path. Trust your intuition and let the cosmic forces guide you. ✨`,
    };
  }

  @Post('mystical-guidance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized mystical guidance' })
  @ApiResponse({ status: 200, description: 'Mystical guidance generated' })
  async getMysticalGuidance(
    @Body() request: { question: string },
    @Req() _req: any,
  ): Promise<{ guidance: string }> {
    // AI functionality temporarily disabled
    return {
      guidance: `🌟 Mystical Guidance: Your question "${request.question}" opens doors to cosmic wisdom. Trust your intuition, embrace your unique gifts, and let the universe guide your path. ✨`,
    };
  }
}
