import {
  Body,
  Controller,
  Get,
  Query,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';
import { WeightRecordsDto } from './dto/weight.dto';

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

  // 上传用户头像
  @ApiOperation({ summary: '上传用户头像' })
  @ApiConsumes('multipart/form-data')
  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() avatarFile: Express.Multer.File) {
    const response = await this.userService.uploadAvatar(avatarFile);
    return response;
  }

  // 上传每日体重
  @ApiOperation({ summary: '上传每日体重' })
  @Post('postDailyWeight')
  async postDailyWeight(@Body() weightRecordsDto: WeightRecordsDto) {
    const response = await this.userService.postDailyWeight(weightRecordsDto);
    return response;
  }

  // 查询当日体重
  @ApiOperation({ summary: '上传每日体重' })
  @Get('queryDailyWeight')
  async queryDailyWeight(@Query() query) {
    const { user_id } = query;
    const response = await this.userService.queryDailyWeight(user_id);
    return response;
  }
}
