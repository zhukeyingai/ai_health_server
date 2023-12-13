import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('登录注册')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('findOne')
  async findOne(@Body() body: any) {
    const user = await this.authService.findOne(body.email);
    console.log('@user', user);
    if (!user) {
      console.log('yes, I really can not do it');
    }
    return user;
  }

  @Post('create')
  async create(@Body() body: any) {
    const { email, password } = body;
    const user = await this.authService.create(email, password);
    return user;
  }
}
