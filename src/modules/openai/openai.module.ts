import { Module } from '@nestjs/common';
import { OpenAI } from '@langchain/openai';

import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Module({
  controllers: [OpenaiController],
  providers: [OpenaiService, OpenAI],
  exports: [OpenaiService],
})
export class OpenaiModule {}
