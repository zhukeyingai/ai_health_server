import { ApiProperty } from '@nestjs/swagger';

export class ExerciseRecordsDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '运动类型',
  })
  type: string;

  @ApiProperty({
    type: 'string',
    description: '运动名称',
  })
  sport: string;

  @ApiProperty({
    type: 'string',
    description: '运动时长',
  })
  amount: number;
}
