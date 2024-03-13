import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DiaryService } from './diary.service';
import { MealRecordsDto } from './dto/meals.dto';

@ApiTags('日记')
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  // 创建三餐信息
  @ApiOperation({ summary: '创建三餐信息' })
  @Post('createMealRecords')
  async createMealRecords(@Body() mealRecordsDto: MealRecordsDto) {
    const response = await this.diaryService.createMealRecords(mealRecordsDto);
    return response;
  }

  // 查询三餐记录
  @ApiOperation({ summary: '查询三餐记录' })
  @Get('queryMealRecords')
  async queryMealRecords(@Query() query) {
    const { user_id, days } = query;
    const response = await this.diaryService.queryMealRecords(user_id, days);
    return response;
  }
}
