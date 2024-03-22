import { ApiProperty } from '@nestjs/swagger';

export class WeightRecordsDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'number',
    description: '体重',
  })
  weight: number;
}
