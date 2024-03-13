import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { MealRecords } from '@/models/mealRecords.model';
import { User } from '@/models/user.model';
import { responseMessage } from '@/utils/constant/response';
import type { ResponseResult } from '@/utils/constant/response';
import { Food, MealTime, Meal } from '@/utils/constant/diary';
import { MealRecordsDto } from './dto/meals.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectModel(MealRecords)
    private mealRecordsModel: typeof MealRecords,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // 创建三餐信息
  async createMealRecords(
    mealRecordsDto: MealRecordsDto,
  ): Promise<ResponseResult> {
    const { user_id, meals } = mealRecordsDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 遍历每餐记录并插入数据库
    for (const meal of meals) {
      const mealRecord = {
        user_id,
        date: new Date(),
        meal_time: meal.mealTime,
        eat: meal.eat,
        foods: JSON.stringify(meal.foods || []),
      };
      await this.mealRecordsModel.create(mealRecord);
    }
    return responseMessage(true, '三餐信息上传成功');
  }

  // 查询三餐记录
  async queryMealRecords(
    user_id: string,
    days: number,
  ): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 根据days查询日期范围内的记录
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const mealRecords = await this.mealRecordsModel.findAll({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    // 聚合相同用餐时间的foods
    const groupedMeals: Record<string, Meal> = {};
    mealRecords.forEach((item) => {
      const key = `${item.date}-${item.meal_time}`;
      if (!groupedMeals[key]) {
        groupedMeals[key] = {
          date: item.date,
          mealTime: item.meal_time,
          foods: [],
        };
      }
      if (typeof item.foods === 'string') {
        const parsedFoods = JSON.parse(item.foods);
        groupedMeals[key].foods.push(...parsedFoods);
      }
    });
    const data = Object.values(
      Object.entries(groupedMeals)
        .filter(([_, value]) => value.foods.length > 0)
        .reduce((newObj, [key, value]) => ({ ...newObj, [key]: value }), {}),
    ).map((item: Meal) => ({
      ...item,
    }));
    return responseMessage(data);
  }
}
