import { ApiProperty } from '@nestjs/swagger';

import { Food } from '@/utils/constant/diary';

export class SnackRecordsDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

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
  foods: Food[];
}
