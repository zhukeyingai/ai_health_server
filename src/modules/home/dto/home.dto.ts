import { ApiProperty } from '@nestjs/swagger';

export class EChartRequestDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '时间区间',
  })
  days: number;
}
