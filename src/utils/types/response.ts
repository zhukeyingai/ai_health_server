//  Response 返回体，默认是不分页，如果是分页查询，需要自己将 Model 带入
export type Response<T = any> = {
  code?: number;
  data: T;
  msg?: string;
};

// 分页查询
export type PageResponse<T> = {
  total: number;
  list: T[];
};
