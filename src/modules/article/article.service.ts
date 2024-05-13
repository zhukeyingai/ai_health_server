import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, literal } from 'sequelize';

import { User } from '@/models/user/user.model';
import { Articles } from '@/models/article/articles.model';
import { ArticleStars } from '@/models/article/articleStars.model';
import { ArticleLikes } from '@/models/article/articleLikes.model';
import { ResponseResult, responseMessage } from '@/utils/constant/response';
import {
  ArticleRequestDto,
  QueryArticleRequestDto,
  UpdateArticleRequestDto,
} from './dto/articles.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Articles)
    private articlesModel: typeof Articles,
    @InjectModel(ArticleStars)
    private articleStarsModel: typeof ArticleStars,
    @InjectModel(ArticleLikes)
    private articleLikesModel: typeof ArticleLikes,
  ) {}

  // 用户创建自己的文章
  async createArticle(
    articleRequestDto: ArticleRequestDto,
  ): Promise<ResponseResult> {
    const { user_id, title, content } = articleRequestDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 创建文章
    await this.articlesModel.create({
      user_id,
      title,
      content,
    });
    return responseMessage(true, '创建成功');
  }

  // 查询全部文章（推荐）
  async queryRandomArticles(): Promise<any> {
    try {
      // 统计文章总数
      const totalArticles = await this.articlesModel.count();

      if (totalArticles < 9) {
        throw new HttpException('文章数量不足', HttpStatus.BAD_REQUEST);
      }

      // 随机获取9篇文章
      // 这里使用一个技巧，生成一个随机的偏移量来选择文章
      const randomOffset = Math.floor(Math.random() * (totalArticles - 9));
      const randomArticles = await this.articlesModel.findAll({
        limit: 9,
        offset: randomOffset,
        order: [literal('RAND()')], // 使用RAND()函数实现随机排序，注意这在MySQL中有效，其他数据库可能需要不同的方法
      });

      return responseMessage(randomArticles);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        '获取随机文章时出错',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 查询文章
  async queryArticles(user_id: string): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const createdArticlesPromise = this.articlesModel.findAll({
      where: { user_id },
      include: [
        {
          model: this.userModel,
          as: 'user',
          attributes: ['avatar_url', 'user_name', 'user_id'],
        },
      ],
    });
    const starredArticlesIdsPromise = this.articleStarsModel
      .findAll({
        attributes: ['article_id'],
        where: { user_id },
      })
      .then((res) => res.map((m) => m.article_id));
    const [createdArticles, starredArticlesIds] = await Promise.all([
      createdArticlesPromise,
      starredArticlesIdsPromise,
    ]);
    let starredArticles = [];
    if (starredArticlesIds.length > 0) {
      starredArticles = await this.articlesModel.findAll({
        where: {
          article_id: {
            [Op.in]: starredArticlesIds,
          },
        },
        include: [
          {
            model: this.userModel,
            as: 'user',
            attributes: ['avatar_url', 'user_name', 'user_id'],
          },
        ],
      });
    }
    const data = {
      created: createdArticles || [],
      starred: starredArticles || [],
    };
    return responseMessage(data);
  }

  // 删除文章
  async deleteArticle(
    queryArticleRequestDto: QueryArticleRequestDto,
  ): Promise<ResponseResult> {
    const { user_id, article_id } = queryArticleRequestDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 检查文章是否存在且属于该用户
    const article = await this.articlesModel.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    if (!article) {
      throw new HttpException('文章不存在或不属于该用户', HttpStatus.NOT_FOUND);
    }
    await article.destroy();
    return responseMessage(true);
  }

  // 增加文章浏览量
  async incrementViewCount(
    queryArticleRequestDto: QueryArticleRequestDto,
  ): Promise<ResponseResult> {
    const { article_id } = queryArticleRequestDto;
    // 查找并更新文章的浏览量
    const [affectedRows] = await this.articlesModel.update(
      { view_count: literal('view_count + 1') },
      { where: { article_id }, returning: false },
    );
    if (affectedRows === 0) {
      throw new HttpException('文章不存在', HttpStatus.NOT_FOUND);
    }
    return responseMessage(true);
  }

  // 文章点赞
  async incrementLikeCount(
    queryArticleRequestDto: QueryArticleRequestDto,
  ): Promise<ResponseResult> {
    const { user_id, article_id } = queryArticleRequestDto;
    // 检查文章是否存在
    const article = await this.articlesModel.findOne({
      where: {
        article_id,
      },
    });
    if (!article) {
      throw new HttpException('文章不存在或不属于该用户', HttpStatus.NOT_FOUND);
    }
    // 检查用户是否已经点赞
    const articleLike = await this.articleLikesModel.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    if (articleLike) {
      // 去掉点赞记录
      await articleLike.destroy();
      // 点赞量-1
      await this.articlesModel.update(
        { like_count: literal('like_count - 1') },
        { where: { article_id }, returning: false },
      );
    } else {
      // 新增点赞记录
      await this.articleLikesModel.create({
        user_id,
        article_id,
        starred_at_time: new Date(),
      });
      // 点赞量+1
      await this.articlesModel.update(
        { like_count: literal('like_count + 1') },
        { where: { article_id }, returning: false },
      );
    }
    return responseMessage(true);
  }

  // 文章收藏
  async incrementStarCount(
    queryArticleRequestDto: QueryArticleRequestDto,
  ): Promise<ResponseResult> {
    const { user_id, article_id } = queryArticleRequestDto;
    // 检查文章是否存在
    const article = await this.articlesModel.findOne({
      where: {
        article_id,
      },
    });
    if (!article) {
      throw new HttpException('文章不存在或不属于该用户', HttpStatus.NOT_FOUND);
    }
    // 检查用户是否已经收藏
    const articleStar = await this.articleStarsModel.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    if (articleStar) {
      // 去掉收藏记录
      await articleStar.destroy();
      // 收藏量-1
      await this.articlesModel.update(
        { star_count: literal('star_count - 1') },
        { where: { article_id }, returning: false },
      );
    } else {
      // 新增收藏记录
      await this.articleStarsModel.create({
        user_id,
        article_id,
        starred_at_time: new Date(),
      });
      // 收藏量+1
      await this.articlesModel.update(
        { star_count: literal('star_count + 1') },
        { where: { article_id }, returning: false },
      );
    }
    return responseMessage(true);
  }

  // 查询当前文章
  async queryCurrentArticle(
    user_id: string,
    article_id: number,
  ): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 检查文章是否存在
    const article = await this.articlesModel.findOne({
      where: {
        article_id,
      },
      include: [
        {
          model: this.userModel,
          as: 'user',
          attributes: ['avatar_url', 'user_name', 'user_id'],
        },
      ],
    });
    if (!article) {
      throw new HttpException('文章不存在或不属于该用户', HttpStatus.NOT_FOUND);
    }
    let isLike: boolean;
    // 检查用户是否已经点赞
    const articleLike = await this.articleLikesModel.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    if (articleLike) {
      isLike = true;
    } else {
      isLike = false;
    }
    let isStar: boolean;
    // 检查用户是否已经收藏
    const articleStar = await this.articleStarsModel.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    if (articleStar) {
      isStar = true;
    } else {
      isStar = false;
    }
    const data = {
      article,
      isLike,
      isStar,
    };
    return responseMessage(data);
  }

  // 修改文章
  async updateArticle(
    updateArticleRequestDto: UpdateArticleRequestDto,
  ): Promise<ResponseResult> {
    const { user_id, article_id, title, content } = updateArticleRequestDto;
    // 检查文章是否存在
    const article = await this.articlesModel.findOne({
      where: {
        user_id,
        article_id,
      },
    });
    if (!article) {
      throw new HttpException('文章不存在或不属于该用户', HttpStatus.NOT_FOUND);
    }
    // 更新文章信息
    await article.update({
      title,
      content,
    });

    return responseMessage(true, '文章更新成功');
  }
}
