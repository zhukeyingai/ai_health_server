import { REQUEST_CODE, REQUEST_MSG } from '@/utils/constant/request';

//  Response 返回体，默认是不分页，如果是分页查询，需要自己将 Model 带入
export type Response<T = any> = {
  code?: number;
  data: T;
  msg?: string;
};

export type ResponseResult = Response<Record<string, any>>;

// 分页查询
export type PageResponse<T> = {
  total: number;
  list: T[];
};

// 统一返回体
export const responseMessage = <T = any>(
  data,
  msg: string = REQUEST_MSG.SUCCESS,
  code: number = REQUEST_CODE.SUCCESS,
): Response<T> => {
  return { data, msg, code };
};
