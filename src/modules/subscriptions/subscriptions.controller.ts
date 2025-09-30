import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Подписки')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех подписок' })
  @ApiResponse({ status: 200, description: 'Список подписок' })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение подписки по ID' })
  @ApiResponse({ status: 200, description: 'Подписка найдена' })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }
}
