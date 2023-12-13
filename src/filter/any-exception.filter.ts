/**
 * 捕获所有异常
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { responseMessage } from '@/utils/common';
import { Logger } from '@/utils/log4js'; // 打印日志

// @Catch() 装饰器绑定所需的元数据到异常过滤器上，它告诉 Nest 这个特定的过滤器正在寻找
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  // ArgumentsHost 叫做参数主机，它是一个实用的工具，这里我们使用它的一个方法来获取上下文 ctx
  catch(exception: any, host: ArgumentsHost) {
    // 获取上下文
    const ctx = host.switchToHttp();
    // 获取响应体
    const response = ctx.getResponse();
    // 获取请求体
    const request = ctx.getRequest();
    // 获取状态码，判断是HTTP异常还是服务器异常
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 打印日志
    const logFormat = `
          -------------------- 全局异常日志 --------------------
          Request original url: ${request.originalUrl}
          Method: ${request.method}
          IP: ${request.ip}
          Status code: ${status}
          Response: ${exception} 
          -------------------- 全局异常日志 --------------------
          `;
    Logger.error(logFormat);
    // 自定义异常返回体
    response
      .status(status)
      .json(responseMessage(null, exception.message, status));
  }
}
