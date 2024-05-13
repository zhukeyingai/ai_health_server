import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ArticleService } from './article.service';
import {
  ArticleRequestDto,
  QueryArticleRequestDto,
  UpdateArticleRequestDto,
} from './dto/articles.dto';

@ApiTags('文章推荐')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  // 用户创建自己的文章
  @ApiOperation({ summary: '用户创建自己的文章' })
  @Post('createArticle')
  async createArticle(@Body() articleRequestDto: ArticleRequestDto) {
    const response = await this.articleService.createArticle(articleRequestDto);
    return response;
  }

  // 查询全部文章（推荐）
  @ApiOperation({ summary: '查询全部文章（推荐）' })
  @Get('queryRandomArticles')
  async queryRandomArticles() {
    const response = await this.articleService.queryRandomArticles();
    return response;
  }

  // 查询文章
  @ApiOperation({ summary: '查询文章' })
  @Get('queryArticles')
  async queryArticles(@Query() query) {
    const { user_id } = query;
    const response = await this.articleService.queryArticles(user_id);
    return response;
  }

  // 删除文章
  @ApiOperation({ summary: '删除文章' })
  @Post('deleteArticle')
  async deleteArticle(@Body() queryArticleRequestDto: QueryArticleRequestDto) {
    const response = await this.articleService.deleteArticle(
      queryArticleRequestDto,
    );
    return response;
  }

  // 增加文章浏览量
  @ApiOperation({ summary: '增加文章浏览量' })
  @Post('incrementViewCount')
  async incrementViewCount(
    @Body() queryArticleRequestDto: QueryArticleRequestDto,
  ) {
    const response = await this.articleService.incrementViewCount(
      queryArticleRequestDto,
    );
    return response;
  }

  // 文章点赞
  @ApiOperation({ summary: '文章点赞' })
  @Post('incrementLikeCount')
  async incrementLikeCount(
    @Body() queryArticleRequestDto: QueryArticleRequestDto,
  ) {
    const response = await this.articleService.incrementLikeCount(
      queryArticleRequestDto,
    );
    return response;
  }

  // 文章收藏
  @ApiOperation({ summary: '文章收藏' })
  @Post('incrementStarCount')
  async incrementStarCount(
    @Body() queryArticleRequestDto: QueryArticleRequestDto,
  ) {
    const response = await this.articleService.incrementStarCount(
      queryArticleRequestDto,
    );
    return response;
  }

  // 查询当前文章
  @ApiOperation({ summary: '查询当前文章' })
  @Get('queryCurrentArticle')
  async queryCurrentArticle(@Query() query) {
    const { user_id, article_id } = query;
    const response = await this.articleService.queryCurrentArticle(
      user_id,
      article_id,
    );
    return response;
  }

  // 修改文章
  @ApiOperation({ summary: '修改文章' })
  @Post('updateArticle')
  async updateArticle(
    @Body() updateArticleRequestDto: UpdateArticleRequestDto,
  ) {
    const response = await this.articleService.updateArticle(
      updateArticleRequestDto,
    );
    return response;
  }
}
