import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('登录注册')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 注册
  @ApiOperation({ summary: '用户注册' })
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    const response = await this.authService.register(authDto);
    return response;
  }

  // 登录
  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const response = await this.authService.login(authDto);
    return response;
  }

  // 退出登录
  @ApiOperation({ summary: '退出登录' })
  @Get('logout')
  async logout(@Query() query) {
    const { user_id } = query;
    const response = await this.authService.logout(user_id);
    return response;
  }

  // 注销用户
  @ApiOperation({ summary: '用户注销' })
  @Post('deleteUser')
  async deleteUser(@Body() body) {
    const { user_id } = body;
    const response = await this.authService.deleteUser(user_id);
    return response;
  }
}
