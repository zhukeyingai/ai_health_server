import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '@/models/user/user.model';
import { MealRecords } from '@/models/diary/mealRecords.model';
import { WaterRecords } from '@/models/diary/waterRecords.model';
import { SnackRecords } from '@/models/diary/snackRecords.model';
import { ExerciseRecords } from '@/models/diary/exerciseRecords.model';
import { Foods } from '@/models/system/foods.model';
import { Exercise } from '@/models/system/exercise.model';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      MealRecords,
      WaterRecords,
      SnackRecords,
      ExerciseRecords,
      Foods,
      Exercise,
    ]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
