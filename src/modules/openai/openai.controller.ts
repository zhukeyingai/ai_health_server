import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { OpenaiService } from './openai.service';

@ApiTags('openai')
@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  // openai
  @ApiOperation({ summary: 'openai' })
  @Get('main')
  async main() {
    const response = await this.openaiService.main();
    return response;
  }
}
