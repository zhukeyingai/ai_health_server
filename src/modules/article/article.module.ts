import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '@/models/user/user.model';
import { Articles } from '@/models/article/articles.model';
import { ArticleStars } from '@/models/article/articleStars.model';
import { ArticleLikes } from '@/models/article/articleLikes.model';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Articles, ArticleStars, ArticleLikes]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
