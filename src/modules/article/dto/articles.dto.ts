import { ApiProperty } from '@nestjs/swagger';

export class ArticleRequestDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '文章标题',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    description: '文章内容',
  })
  content: string;
}

export class QueryArticleRequestDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '文章id',
  })
  article_id: number;
}

export class UpdateArticleRequestDto {
  @ApiProperty({
    type: 'string',
    description: '用户id',
  })
  user_id: string;

  @ApiProperty({
    type: 'string',
    description: '文章id',
  })
  article_id: number;

  @ApiProperty({
    type: 'string',
    description: '文章标题',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    description: '文章内容',
  })
  content: string;
}
