import {
  Controller,
  Query,
  Body,
  Get,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as svgCaptcha from 'svg-captcha';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('code')
  createCode(@Req() req, @Res() res, @Session() session) {
    const captcha = svgCaptcha.create({
      size: 4, // 生成4个验证码
      fontSize: 50, // 文字大小
      width: 100, // 宽度
      height: 34, // 高度
      background: '#cc9966', // 背景颜色
    });
    session.code = captcha.text;
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('create')
  createUser(@Body() body, @Session() session) {
    console.log('@body', body, '@session', session);
    return {
      code: 200,
    };
  }

  @Get('query')
  findAll(@Query() query) {
    console.log('@query', query);
    return {
      code: 200,
      message: query.name,
    };
  }

  // @Get(':id')
  // findId(@Request() req, @Headers() headers) {
  //   console.log('@req', req.params);
  //   console.log('@headers', headers);
  //   return {
  //     code: 200,
  //   };
  // }

  // @Post()
  // create(@Body('age') body) {
  //   console.log('@body', body);

  //   return {
  //     code: 200,
  //     message: body,
  //   };
  // }
}
