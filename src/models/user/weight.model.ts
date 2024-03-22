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

import { WeightAttributes } from '@/utils/constant/user';
import { User } from './user.model';

@Table({ tableName: 'weight_records' })
export class WeightRecords
  extends Model<WeightAttributes, WeightAttributes>
  implements WeightAttributes
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

  // 运动
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    comment: '运动',
  })
  weight: number;
}
