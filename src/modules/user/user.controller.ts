import { Body, Controller, Get, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';

@ApiTags('个人中心')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 获取用户信息
  @ApiOperation({ summary: '获取用户信息' })
  @Get('getUserInfo')
  async getUserInfo(@Query() query) {
    const { user_id } = query;
    const response = await this.userService.getUserInfo(user_id);
    return response;
  }

  // 更新密码
  @ApiOperation({ summary: '更新密码' })
  @Patch('updatePassword')
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    const response = await this.userService.updatePassword(updatePasswordDto);
    return response;
  }

  // 更新用户信息
  @ApiOperation({ summary: '更新用户信息' })
  @Patch('updateUserInfo')
  async updateUserInfo(@Body() updateUserInfoDto: UpdateUserInfoDto) {
    const response = await this.userService.updateUserInfo(updateUserInfoDto);
    return response;
  }
}
