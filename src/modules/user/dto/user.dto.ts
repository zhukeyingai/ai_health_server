import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { SEX } from '@/utils/constant/user';
import type { Sex } from '@/utils/constant/user';

export class UpdatePasswordDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '旧密码',
  })
  oldPassword: string;

  @ApiProperty({
    type: 'string',
    description: '新密码',
  })
  newPassword: string;

  @ApiProperty({
    type: 'string',
    description: '新密码',
  })
  repeatedPassword: string;
}

export class UpdateUserInfoDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '用户头像',
  })
  avatar_url?: string;

  @ApiProperty({
    type: 'string',
    description: '用户名称',
  })
  user_name?: string;

  @ApiProperty({
    type: 'string',
    enum: SEX,
    enumName: 'Sex',
    description: '性别',
  })
  @IsOptional()
  @IsEnum(SEX, { message: '用户性别: sex 字段值错误' })
  sex?: Sex;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: '生日',
  })
  birthday?: string;

  @ApiProperty({
    type: 'number',
    description: '年龄',
  })
  age?: number;

  @ApiProperty({
    type: 'number',
    description: '身高',
  })
  height?: number;

  @ApiProperty({
    type: 'number',
    description: '体重',
  })
  weight?: number;

  @ApiProperty({
    type: 'string',
    description: '职业',
  })
  job?: string;

  @ApiProperty({
    type: JSON,
    description: '地址',
  })
  address?: string[];
}
