import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // swagger 接口文档
import * as express from 'express';
import * as session from 'express-session';
import { join } from 'path';

import AppConfig from './config/configuration';
import type { Response } from './utils/constant/response';
import { AllExceptionsFilter } from './filter/any-exception.filter'; // 任意异常捕获
import { HttpExceptionFilter } from './filter/http-exception.filter'; // http 异常过滤器
import { HttpReqTransformInterceptor } from './interceptor/http-req.interceptor'; // 全局响应拦截器
import { TransformInterceptor } from './interceptor/transform.interceptor'; // 全局拦截器，用来收集日志
import { logger } from './middleware/logger.middleware'; // 日志收集中间件
// import { requestMiddleware } from './middleware/request.middleware'; // 全局请求拦截中间件
import { ValidationPipe } from './pipe/validation.pipe';
import { Logger } from '@/utils/log4js';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 日志相关
  app.use(logger); // 所有请求都打印日志

  // 启动cors跨域
  app.enableCors();

  // 配置 session
  app.use(
    session({
      secret: 'zhukeying', // 签名
      resave: false, // 强制保存 sseion 即使它并没有变化，默认为 true，没有被修改的情况下不进行保存，减少对存储的访问
      saveUninitialized: false, // 强制将未初始化的session存储，不保存未使用的 session，以节省存储空间
    }),
  );

  // 全局参数校验
  app.useGlobalPipes(new ValidationPipe());

  // 全局请求拦截中间件
  // app.use(requestMiddleware);

  // 错误异常捕获 和 过滤处理
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter()); // 全局统一异常返回体

  // 全局响应拦截器，格式化返回体
  app.useGlobalInterceptors(new HttpReqTransformInterceptor<Response>());
  app.useGlobalInterceptors(new TransformInterceptor()); // 全局拦截器，用来收集日志

  // 配置文件访问 文件夹为静态目录，以达到可直接访问下面文件的目的
  const rootDir = join(__dirname, '..');
  app.use('/static', express.static(join(rootDir, '/upload')));

  // 全局添加接口前缀
  app.setGlobalPrefix(process.env.REQUEST_URL_PREFIX);

  // 构建 swagger 文档
  const options = new DocumentBuilder()
    .setTitle(process.env.SWAGGER_UI_TITLE)
    .addBearerAuth()
    .setDescription(process.env.SWAGGER_UI_DESC)
    .setVersion(process.env.SWAGGER_API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(process.env.SWAGGER_SETUP_PATH, app, document);

  await app.listen(AppConfig().port, () => {
    Logger.info(
      `服务已经启动,接口请访问:http://www.localhost:${AppConfig().port}`,
    );
  });
}
bootstrap();
