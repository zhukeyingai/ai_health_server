import type { Times } from '.';

// 文章（model）
export type ArticleAttributes = {
  article_id: number;
  title: string;
  content: string;
  user_id: string;
  view_count?: number;
  like_count?: number;
  star_count?: number;
} & Times;

// 文章用户关系表（点赞、收藏）（model）
export type ArticleOperAttributes = {
  id: number;
  user_id: string;
  article_id: number;
  starred_at_time: Date;
};
