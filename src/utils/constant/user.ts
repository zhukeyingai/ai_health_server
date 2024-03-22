import type { Times, EnumValues } from '.';

// 性别
export enum SEX {
  FEMALE = '0', // 女
  MALE = '1', // 男
}

// 性别
export type Sex = EnumValues<typeof SEX>;

// user
export type UserAttributes = {
  user_id: string; // 用户id
  user_name: string; // 用户名称
  email: string; // 电子邮箱
  password: string; // 密码(加密)
  age: number; // 年龄
  birthday: string; // 生日
  height: number; // 身高
  weight: number; // 体重
  avatar_url?: string; // 用户头像
  sex: Sex; // 用户性别
  job?: string; // 职业
  address?: string[]; // 地址
  token?: string; // 用户令牌
  login_num: number; // 登录次数
  login_last_ip?: string; // 最后一次登录ip
  login_last_time?: Date; // 最后一次登录时间
} & Times;

// 用户每日体重（model）
export type WeightAttributes = {
  id: number;
  user_id: string;
  date: Date;
  weight: number;
} & Times;
