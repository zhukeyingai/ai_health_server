import {
  Table,
  Model,
  IsUUID,
  PrimaryKey,
  Column,
  DataType,
  NotEmpty,
  Length,
  Min,
  Max,
  IsEmail,
  IsDate,
  IsUrl,
  IsIn,
  IsIP,
} from 'sequelize-typescript';

import { UserAttributes } from '@/utils/constant/user';
import type { Sex } from '@/utils/constant/user';

@Table({ tableName: 'user' })
export class User
  extends Model<UserAttributes, UserAttributes>
  implements UserAttributes
{
  // 用户id
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
    comment: '用户id',
  })
  user_id: string;

  // 用户名称
  @NotEmpty({ msg: '用户名称不能为空' })
  @Length({
    min: 2,
    max: 20,
    msg: '用户名称的长度在2-20个字符',
  })
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    comment: '用户名称',
  })
  user_name: string;

  // 电子邮箱
  @IsEmail
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: '电子邮箱',
  })
  email: string;

  // 密码(加密)，哈希密码长度60个字符
  @Column({
    type: DataType.STRING(60),
    allowNull: false,
    comment: '密码（加密）',
  })
  password: string;

  // 年龄
  @Min(1)
  @Max(120)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '年龄',
  })
  age: number;

  // 生日
  @IsDate
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    comment: '生日',
  })
  birthday: string;

  // 身高
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 170,
    comment: '身高',
  })
  height: number;

  // 体重
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    defaultValue: 55,
    comment: '体重',
  })
  weight: number;

  // 用户头像
  @IsUrl
  @Column({
    type: DataType.STRING,
    allowNull: true,
    comment: '用户头像',
  })
  avatar_url?: string;

  // 用户性别
  @IsIn({
    args: [['0', '1']],
    msg: '用户性别: sex 字段值错误',
  })
  @Column({
    type: DataType.ENUM,
    values: ['0', '1'],
    allowNull: false,
    comment: '用户性别(0:女,1:男)',
  })
  sex: Sex;

  // 职业
  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    comment: '职业',
  })
  job?: string;

  // 地址
  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: '地址',
  })
  address?: string[];

  // 用户令牌
  @Column({
    type: DataType.BLOB,
    allowNull: true,
    comment: 'token',
  })
  token?: string;

  // 登录次数
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '登录次数',
  })
  login_num: number;

  // 最后一次登录ip
  @IsIP
  @Column({
    type: DataType.STRING(30),
    allowNull: true,
    comment: '最后一次登录ip',
  })
  login_last_ip?: string;

  // 最后一次登录时间
  @IsDate
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: '最后一次登录时间',
  })
  login_last_time?: Date;
}
