import { ApiProperty } from '@nestjs/swagger';

import { MealTime, Food } from '@/utils/constant/diary';

export class SingleMealRecordDto {
  @ApiProperty({
    type: 'string',
    enum: MealTime,
    description: '餐次',
  })
  mealTime: MealTime;

  @ApiProperty({
    type: 'boolean',
    description: '是否吃过',
  })
  eat: boolean;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        foodName: {
          type: 'string',
          description: '食物名称',
        },
        amount: {
          type: 'number',
          description: '份量',
        },
      },
    },
    description: '晚餐记录',
  })
  foods?: Food[];
}

export class MealRecordsDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'array',
    description: '每日餐食记录',
  })
  meals: SingleMealRecordDto[];
}
