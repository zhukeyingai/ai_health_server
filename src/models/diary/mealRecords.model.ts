import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  IsDate,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { JsonValue } from 'type-fest';

import { MealTime, MealRecordAttributes } from '@/utils/constant/diary';
import { User } from '../user/user.model';

@Table({ tableName: 'meal_records' })
export class MealRecords
  extends Model<MealRecordAttributes, MealRecordAttributes>
  implements MealRecordAttributes
{
  // id
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    comment: 'id',
  })
  id: number;

  // 用户id
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '用户id',
  })
  user_id: string;

  // 日期
  @IsDate
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: '日期',
  })
  date: Date;

  // 餐食时间
  @Column({
    type: DataType.ENUM(MealTime.breakfast, MealTime.lunch, MealTime.dinner),
    allowNull: false,
    comment: '餐次',
  })
  meal_time: MealTime;

  // 是否吃过
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    comment: '是否吃过',
  })
  eat: boolean;

  // 食物
  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: '食物',
  })
  foods?: JsonValue;
}
