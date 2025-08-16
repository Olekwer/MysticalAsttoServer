import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JournalService } from './journal.service';

@ApiTags('Дневник')
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  @ApiOperation({ summary: 'Получение всех записей дневника' })
  @ApiResponse({ status: 200, description: 'Список записей' })
  findAll() {
    return this.journalService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение записи дневника по ID' })
  @ApiResponse({ status: 200, description: 'Запись найдена' })
  findOne(@Param('id') id: string) {
    return this.journalService.findOne(id);
  }
} 