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

// 用户每日饮水（model）
export type WaterRecordAttributes = {
  id: number;
  user_id: string; // 用户id
  date: Date; // 日期
  quantity: number; // 饮水量（杯）
} & Times;

// 用户每日零食（model）
export type SnackRecordAttributes = {
  id: number;
  user_id: string; // 用户id
  date: Date; // 日期
  foods?: JsonValue; // 食物
} & Times;

// 用户每日涌动（model）
export type ExerciseRecordAttributes = {
  id: number;
  user_id: string; // 用户id
  date: Date; // 日期
  sports?: JsonValue; // 食物
} & Times;
