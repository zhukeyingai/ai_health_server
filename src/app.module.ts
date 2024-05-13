/**
 * 应用程序的根模块
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { OpenAI } from '@langchain/openai';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DiaryModule } from './modules/diary/diary.module';
import { HomeModule } from './modules/home/home.module';
import { ArticleModule } from './modules/article/article.module';
import { OpenaiModule } from './modules/openai/openai.module';

import AppConfig from './config/configuration'; // 全局配置
import DatabaseConfig from './config/database'; // 数据库配置
import RedisConfig from './config/redis'; // redis配置

@Module({
  imports: [
    // 全局配置 Module
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      load: [AppConfig, DatabaseConfig, RedisConfig],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      // 注入 database 配置
      useFactory: async (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    DiaryModule,
    HomeModule,
    ArticleModule,
    OpenaiModule,
  ],
  providers: [
    {
      provide: OpenAI,
      useFactory: () => {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        return openai;
      },
    },
  ],
  exports: [OpenAI],
})
export class AppModule {}
