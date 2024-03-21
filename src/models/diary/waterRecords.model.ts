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

import { WaterRecordAttributes } from '@/utils/constant/diary';
import { User } from '../user.model';

@Table({ tableName: 'water_records' })
export class WaterRecords
  extends Model<WaterRecordAttributes, WaterRecordAttributes>
  implements WaterRecordAttributes
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

  // 饮水量
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '饮水量（杯）',
  })
  quantity: number;
}
