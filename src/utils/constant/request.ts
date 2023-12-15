import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';

// 请求状态码
export enum REQUEST_CODE {
  NO_SUCCESS = -1, // 表示请求成功，但操作未成功
  SUCCESS = 200, // 表示请求成功
  POST_SUCCESS = 201, // 表示post成功
  BAD_REQUEST = 400, // 表示客户端发送的请求有错误
  UNAUTHORIZED = 401, // 表示客户端未提供身份验证凭据或身份验证凭据不正确
  NOT_FOUND = 404, // 表示服务器无法找到请求的资源
  INTERNAL_SERVER_ERROR = 500, // 表示服务器内部错误
}

// 请求提示语
export enum REQUEST_MSG {
  SUCCESS = '操作成功',
  FAILURE = '操作失败',
}

// 获取客户端真实IP
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.clientIp) return req.clientIp;
    return requestIp.getClientIp(req);
  },
);
