import { JsonValue } from 'type-fest';
import type { Times } from '.';

export enum MealTime {
  breakfast = 'BREAKFAST',
  lunch = 'LUNCH',
  dinner = 'DINNER',
}

export type Food = {
  foodName: string; // 食物名称
  amount: number; // 份量
};

// 用户每日三餐（model）
export type MealRecordAttributes = {
  id: number;
  user_id: string; // 用户id
  date: Date; // 日期
  meal_time: MealTime; // 餐次
  eat: boolean; // 是否吃过
  foods?: JsonValue; // 食物
} & Times;

export type Meal = {
  date: Date;
  mealTime: MealTime;
  foods: Food[];
};
