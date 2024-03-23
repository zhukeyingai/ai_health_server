import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { WeightRecords } from '@/models/user/weight.model';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';

@Module({
  imports: [SequelizeModule.forFeature([WeightRecords])],
  controllers: [HomeController],
  providers: [HomeService],
  exports: [HomeService],
})
export class HomeModule {}
