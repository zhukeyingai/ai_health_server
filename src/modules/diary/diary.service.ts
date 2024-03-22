import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { MealRecords } from '@/models/diary/mealRecords.model';
import { User } from '@/models/user/user.model';
import { WaterRecords } from '@/models/diary/waterRecords.model';
import { SnackRecords } from '@/models/diary/snackRecords.model';
import { ExerciseRecords } from '@/models/diary/exerciseRecords.model';
import { responseMessage } from '@/utils/constant/response';
import type { ResponseResult } from '@/utils/constant/response';
import { Meal } from '@/utils/constant/diary';
import { MealRecordsDto } from './dto/meals.dto';
import { WaterRecordsDto } from './dto/water.dto';
import { SnackRecordsDto } from './dto/snack.dto';
import { ExerciseRecordsDto } from './dto/exercise.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectModel(MealRecords)
    private mealRecordsModel: typeof MealRecords,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(WaterRecords)
    private waterRecordsModel: typeof WaterRecords,
    @InjectModel(SnackRecords)
    private snackRecordsModel: typeof SnackRecords,
    @InjectModel(ExerciseRecords)
    private exerciseRecordsModel: typeof ExerciseRecords,
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
    // 遍历每餐记录并插入/更新数据库
    for (const meal of meals) {
      const mealRecord = await this.mealRecordsModel.findOne({
        where: {
          user_id,
          date: new Date().toISOString().split('T')[0],
          meal_time: meal.mealTime,
        },
      });
      if (mealRecord) {
        const parsedFoods = JSON.parse(mealRecord.foods as string);
        if (meal.foods) {
          mealRecord.eat = true;
        }
        parsedFoods.push(...meal.foods);
        mealRecord.foods = JSON.stringify(parsedFoods);
        await mealRecord.save();
      } else {
        const newMealRecord = {
          user_id,
          date: new Date(),
          meal_time: meal.mealTime,
          eat: meal.eat,
          foods: JSON.stringify(meal.foods || []),
        };
        await this.mealRecordsModel.create(newMealRecord);
      }
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
    const data = mealRecords.map((item) => ({
      date: item.date,
      mealTime: item.meal_time,
      foods: JSON.parse(item.foods as string),
    }));
    return responseMessage(data);
  }

  // 查询饮水量
  async queryWaterRecords(user_id: string): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const waterRecords = await this.waterRecordsModel.findOne({
      where: {
        user_id,
        date: new Date().toISOString().split('T')[0],
      },
    });
    if (waterRecords) {
      return responseMessage(waterRecords.quantity);
    } else {
      await this.waterRecordsModel.create({
        user_id,
        date: new Date(),
        quantity: 0,
      });
      return responseMessage(0);
    }
  }

  // 更新饮水量
  async updateWaterRecords(
    waterRecordsDto: WaterRecordsDto,
  ): Promise<ResponseResult> {
    const { user_id, quantity } = waterRecordsDto;
    // 检查今天的饮水记录是否存在
    const waterRecords = await this.waterRecordsModel.findOne({
      where: {
        user_id,
        date: new Date().toISOString().split('T')[0],
      },
    });
    if (!waterRecords) {
      throw new HttpException('今日饮水记录不存在', HttpStatus.NOT_FOUND);
    }
    // 更新饮水量
    await waterRecords.update({ quantity });
    return responseMessage(true);
  }

  // 创建零食信息
  async createSnackRecords(
    snackRecordsDto: SnackRecordsDto,
  ): Promise<ResponseResult> {
    const { user_id, foods } = snackRecordsDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 查找用户当天的零食记录
    const snackRecords = await this.snackRecordsModel.findOne({
      where: {
        user_id,
        date: new Date().toISOString().split('T')[0],
      },
    });
    let snackRecordsToSave;
    if (snackRecords) {
      if (typeof snackRecords.foods === 'string') {
        const prevFoods = JSON.parse(snackRecords.foods);
        const curFoods = [...prevFoods, ...foods];
        snackRecordsToSave = {
          ...snackRecords,
          foods: JSON.stringify(curFoods),
        };
        await this.snackRecordsModel.update(snackRecordsToSave, {
          where: { id: snackRecords.id },
        });
      } else {
        throw new HttpException('foods类型有误', HttpStatus.FORBIDDEN);
      }
    } else {
      snackRecordsToSave = {
        user_id,
        date: new Date(),
        foods: JSON.stringify(foods || []),
      };
      await this.snackRecordsModel.create(snackRecordsToSave);
    }
    return responseMessage(true, '零食信息上传成功');
  }

  // 查询零食信息
  async querySnackRecords(
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
    // 查找当天用户是否存在
    const snackRecords = await this.snackRecordsModel.findAll({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    const data = snackRecords
      ? snackRecords.map((item) => ({
          date: item.date,
          foods: item.foods,
        }))
      : [];
    return responseMessage(data);
  }

  // 创建锻炼信息
  async createExerciseRecords(
    exerciseRecordsDto: ExerciseRecordsDto,
  ): Promise<ResponseResult> {
    const { user_id, type, sport, amount } = exerciseRecordsDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 查找用户当天的运动记录
    const exerciseRecords = await this.exerciseRecordsModel.findOne({
      where: {
        user_id,
        date: new Date().toISOString().split('T')[0],
      },
    });
    if (exerciseRecords) {
      if (typeof exerciseRecords.sports === 'string') {
        const parsedSports = JSON.parse(exerciseRecords.sports);
        const existedTypeIndex = parsedSports.findIndex((i) => i.type === type);
        if (existedTypeIndex !== -1) {
          parsedSports[existedTypeIndex].sports.push({ sport, amount });
        } else {
          parsedSports.push({ type, sports: [{ sport, amount }] });
        }
        exerciseRecords.sports = JSON.stringify(parsedSports);
        await exerciseRecords.save();
      } else {
        throw new HttpException('sports类型有误', HttpStatus.FORBIDDEN);
      }
    } else {
      const newRecordData = {
        user_id,
        date: new Date(),
        sports: JSON.stringify([{ type, sports: [{ sport, amount }] }]),
      };
      await this.exerciseRecordsModel.create(newRecordData);
    }
    return responseMessage(true, '运动记录上传成功');
  }

  // 查询锻炼信息
  async queryExerciseRecords(
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
    // 查找当天用户是否存在
    const exerciseRecords = await this.exerciseRecordsModel.findAll({
      where: {
        user_id,
        date: { [Op.between]: [startDate, endDate] },
      },
    });
    const data = exerciseRecords
      ? exerciseRecords.map((item) => ({
          date: item.date,
          sports: JSON.parse(item.sports as string),
        }))
      : [];
    return responseMessage(data);
  }
}
