import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatOpenAI } from '@langchain/openai';
import { createOpenAPIChain } from 'langchain/chains';

import { ResponseResult, responseMessage } from '@/utils/constant/response';

@Injectable()
export class OpenaiService {
  //   constructor(private readonly openAI: OpenAI) {}

  async main(): Promise<ResponseResult> {
    // const response = await this.openAI.invoke(['你好']);
    // console.log('@response', response);
    const chatModel = new ChatOpenAI({
      model: 'gpt-3.5-turbo-0613',
      temperature: 0,
    });
    const chain = await createOpenAPIChain(
      'https://api.speak.com/openapi.yaml',
      {
        llm: chatModel,
        headers: {
          authorization: 'Bearer SOME_TOKEN',
        },
      },
    );
    const result = await chain.run(`How would you say no thanks in Russian?`);
    console.log(JSON.stringify(result, null, 2));

    return responseMessage(result);
  }
}
