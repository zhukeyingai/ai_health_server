import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { WeightRecords } from '@/models/user/weight.model';
import { EChartRequestDto } from './dto/home.dto';
import { ResponseResult, responseMessage } from '@/utils/constant/response';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(WeightRecords)
    private weightRecordsModel: typeof WeightRecords,
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
}
