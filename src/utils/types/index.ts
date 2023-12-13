import { SEX } from '../enums';
import type { UserAttributes } from './user';

// 获取枚举的所有 key
export type EnumKeys<T> = keyof T;

// 获取枚举的所有可能值
export type EnumValues<T> = T[EnumKeys<T>];

// 创建时间、更新时间
export type Times = {
  created_time?: Date; // 创建时间
  updated_time?: Date; // 最后一次更新时间
};

// 性别
export type Sex = EnumValues<typeof SEX>;

// Session 存储对象
export type SessionTypes = {
  currentUserInfo: UserAttributes; // 用户信息
};
