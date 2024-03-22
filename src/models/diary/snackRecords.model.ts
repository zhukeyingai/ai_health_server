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

import { SnackRecordAttributes } from '@/utils/constant/diary';
import { User } from '../user/user.model';

@Table({ tableName: 'snack_records' })
export class SnackRecords
  extends Model<SnackRecordAttributes, SnackRecordAttributes>
  implements SnackRecordAttributes
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

  // 食物
  @Column({
    type: DataType.JSON,
    allowNull: true,
    comment: '食物',
  })
  foods?: JsonValue;
}
