import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { HeatAttributes } from '@/utils/constant/system';

@Table({ tableName: 'foods' })
export class Foods
  extends Model<HeatAttributes, HeatAttributes>
  implements HeatAttributes
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

  // 名称
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: '名称',
  })
  name: string;

  // 热量
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '热量',
  })
  heat: number;
}
