import {
  IsUUID,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { ArticleOperAttributes } from '@/utils/constant/article';
import { Articles } from './articles.model';
import { User } from '../user/user.model';

@Table({ tableName: 'article_likes' })
export class ArticleLikes
  extends Model<ArticleOperAttributes, ArticleOperAttributes>
  implements ArticleOperAttributes
{
  // 点赞关系id
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    comment: '点赞关系id',
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

  // 文章id
  @ForeignKey(() => Articles)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '文章id',
  })
  article_id: number;

  // 点赞时间
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: '点赞时间',
  })
  starred_at_time: Date;

  // 关联关系定义
  @BelongsTo(() => User, 'user_id')
  user: User;

  @BelongsTo(() => Articles, 'article_id')
  articles: Articles;
}
