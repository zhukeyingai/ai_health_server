import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DiaryService } from './diary.service';
import { MealRecordsDto } from './dto/meals.dto';
import { WaterRecordsDto } from './dto/water.dto';
import { SnackRecordsDto } from './dto/snack.dto';
import { ExerciseRecordsDto } from './dto/exercise.dto';

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

  // 查询饮水量
  @ApiOperation({ summary: '查询饮水量' })
  @Get('queryWaterRecords')
  async queryWaterRecords(@Query() query) {
    const { user_id } = query;
    const response = await this.diaryService.queryWaterRecords(user_id);
    return response;
  }

  // 更新饮水量
  @ApiOperation({ summary: '更新饮水量' })
  @Post('updateWaterRecords')
  async updateWaterRecords(@Body() waterRecordsDto: WaterRecordsDto) {
    const response =
      await this.diaryService.updateWaterRecords(waterRecordsDto);
    return response;
  }

  // 创建零食信息
  @ApiOperation({ summary: '创建零食信息' })
  @Post('createSnackRecords')
  async createSnackRecords(@Body() snackRecordsDto: SnackRecordsDto) {
    const response =
      await this.diaryService.createSnackRecords(snackRecordsDto);
    return response;
  }

  // 查询零食信息
  @ApiOperation({ summary: '查询零食信息' })
  @Get('querySnackRecords')
  async querySnackRecords(@Query() query) {
    const { user_id, days } = query;
    const response = await this.diaryService.querySnackRecords(user_id, days);
    return response;
  }

  // 创建零食信息
  @ApiOperation({ summary: '创建锻炼信息' })
  @Post('createExerciseRecords')
  async createExerciseRecords(@Body() exerciseRecordsDto: ExerciseRecordsDto) {
    const response =
      await this.diaryService.createExerciseRecords(exerciseRecordsDto);
    return response;
  }

  // 查询锻炼信息
  @ApiOperation({ summary: '查询锻炼信息' })
  @Get('queryExerciseRecords')
  async queryExerciseRecords(@Query() query) {
    const { user_id, days } = query;
    const response = await this.diaryService.queryExerciseRecords(
      user_id,
      days,
    );
    return response;
  }
}
