import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '@/models/user/user.model';
import { WeightRecords } from '@/models/user/weight.model';
import { MealRecords } from '@/models/diary/mealRecords.model';
import { SnackRecords } from '@/models/diary/snackRecords.model';
import { ExerciseRecords } from '@/models/diary/exerciseRecords.model';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      WeightRecords,
      MealRecords,
      SnackRecords,
      ExerciseRecords,
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
