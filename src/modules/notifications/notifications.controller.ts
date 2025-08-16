import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('Уведомления')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех уведомлений' })
  @ApiResponse({ status: 200, description: 'Список уведомлений' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение уведомления по ID' })
  @ApiResponse({ status: 200, description: 'Уведомление найдено' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }
} 