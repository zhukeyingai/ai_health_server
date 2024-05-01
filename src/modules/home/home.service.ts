import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { User } from '@/models/user/user.model';
import { WeightRecords } from '@/models/user/weight.model';
import { MealRecords } from '@/models/diary/mealRecords.model';
import { SnackRecords } from '@/models/diary/snackRecords.model';
import { ExerciseRecords } from '@/models/diary/exerciseRecords.model';
import { EChartRequestDto } from './dto/home.dto';
import { ResponseResult, responseMessage } from '@/utils/constant/response';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(WeightRecords)
    private weightRecordsModel: typeof WeightRecords,
    @InjectModel(MealRecords)
    private mealRecordsModel: typeof MealRecords,
    @InjectModel(SnackRecords)
    private snackRecordsModel: typeof SnackRecords,
    @InjectModel(ExerciseRecords)
    private exerciseRecordsModel: typeof ExerciseRecords,
  ) {}

  // 查询体重
  async queryWeightAllDays(
    eChartRequestDto: EChartRequestDto,
  ): Promise<ResponseResult> {
    const { user_id, days } = eChartRequestDto;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const weightRecords = await this.weightRecordsModel.findAll({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    const data = weightRecords.map((item) => ({
      date: item.date,
      weight: item.weight,
    }));
    return responseMessage(data);
  }

  // 查询摄入热量
  async queryHeatIntake(user_id: string): Promise<ResponseResult> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const mealRecords = await this.mealRecordsModel.findAll({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    const snackRecord = await this.snackRecordsModel.findOne({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    let mealHeatTotal = 0,
      snackHeatTotal = 0;
    mealRecords.forEach((meal) => {
      JSON.parse(meal.foods as string).forEach(({ heat }) => {
        mealHeatTotal += heat;
      });
    });
    JSON.parse(snackRecord.foods as string).forEach(({ heat }) => {
      snackHeatTotal += heat;
    });
    const data = {
      mealHeatTotal: Math.round(mealHeatTotal * 100) / 100,
      snackHeatTotal: Math.round(snackHeatTotal * 100) / 100,
    };
    return responseMessage(data);
  }

  // 查询消耗热量
  async queryHeatConsume(user_id: string): Promise<ResponseResult> {
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const exerciseRecord = await this.exerciseRecordsModel.findOne({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    let exerciseHeatTotal = 0;
    JSON.parse(exerciseRecord.sports as string).forEach(({ sports }) => {
      sports.forEach(({ heat }) => {
        exerciseHeatTotal += heat;
      });
    });
    const data = {
      baseHeatTotal: user.bmr,
      exerciseHeatTotal: Math.round(exerciseHeatTotal * 100) / 100,
    };
    return responseMessage(data);
  }
}
