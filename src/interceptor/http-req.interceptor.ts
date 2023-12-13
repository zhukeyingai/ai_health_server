import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { responseMessage } from '@/utils/common'; // 全局工具函数
import type { Response } from '@/utils/types/response';

@Injectable()
export class HttpReqTransformInterceptor<T>
  implements NestInterceptor<T, Response>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response> {
    return next.handle().pipe(
      map(({ data, msg, code }) => {
        // response 将返回一个对象，包装返回体，设计返回的逻辑
        return responseMessage(data, msg, code);
      }),
    );
  }
}
