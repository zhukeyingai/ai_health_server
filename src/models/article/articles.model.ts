import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';

import { ArticleAttributes } from '@/utils/constant/article';
import { User } from '../user/user.model';

@Table({ tableName: 'articles' })
export class Articles
  extends Model<ArticleAttributes, ArticleAttributes>
  implements ArticleAttributes
{
  // 文章id
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    comment: '文章id',
  })
  article_id: number;

  // 文章标题
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: '文章标题',
  })
  title: string;

  // 文章内容
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: '文章内容',
  })
  content: string;

  // 用户id
  @IsUUID(4)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: '用户id',
  })
  user_id: string;

  // 浏览量
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: '浏览量',
  })
  view_count?: number;

  // 点赞量
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: '点赞量',
  })
  like_count?: number;

  // 收藏量
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    comment: '收藏量',
  })
  star_count?: number;

  // 关联关系定义
  @BelongsTo(() => User, 'user_id')
  user: User;
}
