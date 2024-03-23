import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';
import { EChartRequestDto } from './dto/home.dto';

@ApiTags('仪表盘')
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  // 查询体重
  @ApiOperation({ summary: '更新饮水量' })
  @Get('queryWeightAllDays')
  async queryWeightAllDays(@Query() eChartRequestDto: EChartRequestDto) {
    const response =
      await this.homeService.queryWeightAllDays(eChartRequestDto);
    return response;
  }
}
