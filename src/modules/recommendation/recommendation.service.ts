import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { User } from '@/models/user/user.model';
import { MealRecords } from '@/models/diary/mealRecords.model';
import { SnackRecords } from '@/models/diary/snackRecords.model';
import { ExerciseRecords } from '@/models/diary/exerciseRecords.model';
import { Articles } from '@/models/article/articles.model';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(MealRecords)
    private mealRecordsModel: typeof MealRecords,
    @InjectModel(SnackRecords)
    private snackRecordsModel: typeof SnackRecords,
    @InjectModel(ExerciseRecords)
    private exerciseRecordsModel: typeof ExerciseRecords,
    @InjectModel(Articles)
    private articlesModel: typeof Articles,
  ) {}

  //   async getUserSimilarities(targetUserId: string): Promise<{ userId: string; similarity: number }[]> {
  //     const targetUserFeatures = await this.extractUserFeatures(targetUserId);
  //     const allUsers = await User.findAll();

  //     return allUsers.map(async user => ({
  //       userId: user.id,
  //       similarity: this.calculatePearsonCorrelation(targetUserFeatures, await this.extractUserFeatures(user.id)),
  //     }));
  //   }

  //   async extractUserFeatures(userId: string): Promise<number[]> {
  //     const [mealRecords, snackRecords, exerciseRecords] = await Promise.all([
  //       MealRecords.findAll({ where: { user_id: userId } }),
  //       SnackRecords.findAll({ where: { user_id: userId } }),
  //       ExerciseRecords.findAll({ where: { user_id: userId } }),
  //     ]);

  //     const totalCalories = mealRecords.reduce((sum, record) => sum + this.getTotalCalories(record), 0);
  //     totalCalories += snackRecords.reduce((sum, record) => sum + this.getTotalCalories(record), 0);
  //     totalCalories += exerciseRecords.reduce((sum, record) => sum + this.getCaloriesBurned(record), 0);

  //     return [totalCalories];
  //   }

  //   getTotalCalories(record: MealRecords | SnackRecords): number {
  //     // 假设record.foods包含每种食物的热量信息，此处仅作示例，请根据实际数据结构调整
  //     const calories = record.foods.reduce((sum, food) => sum + food.calories, 0);
  //     return calories;
  //   }

  //   getCaloriesBurned(record: ExerciseRecords): number {
  //     // 假设record.sports包含每项运动的热量消耗信息，此处仅作示例，请根据实际数据结构调整
  //     const caloriesBurned = record.sports.reduce((sum, sport) => sum + sport.calories_burned, 0);
  //     return caloriesBurned;
  //   }

  //   calculatePearsonCorrelation(x: number[], y: number[]): number {
  //     if (x.length !== y.length || x.length === 0) {
  //       throw new Error('Arrays must have the same non-zero length');
  //     }

  //     const n = x.length;
  //     const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  //     const meanY = y.reduce((sum, val) => sum + val, 0) / n;

  //     const numerator = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0);
  //     const denominator = Math.sqrt(
  //       x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0) *
  //       y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0),
  //     );

  //     return numerator / denominator;
  //   }

  //   async getRecommendations(targetUserId: string, numRecommendations: number): Promise<Articles[]> {
  //     const similarities = await this.getUserSimilarities(targetUserId);
  //     const similarUsers = similarities
  //       .filter(s => s.similarity > 0) // 排除与目标用户完全不相似的用户
  //       .sort((a, b) => b.similarity - a.similarity)
  //       .slice(0, numRecommendations);

  //     const similarUserIds = similarUsers.map(s => s.userId);

  //     const recommendedArticles = await Articles.findAll({
  //       where: {
  //         user_id: {
  //           [Op.in]: similarUserIds,
  //         },
  //       },
  //       order: [['view_count', 'DESC'], ['like_count', 'DESC']], // 根据浏览量和点赞量降序排列
  //       limit: numRecommendations, // 取前numRecommendations篇文章
  //     });

  //     return recommendedArticles;
  //   }
}
