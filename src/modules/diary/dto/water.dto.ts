import { ApiProperty } from '@nestjs/swagger';

export class WaterRecordsDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'number',
    description: '饮水量（杯）',
  })
  quantity: number;
}
