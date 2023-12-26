import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '@/models/user.model';
import { responseMessage } from '@/utils/constant/response';
import type { ResponseResult } from '@/utils/constant/response';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // 获取用户信息
  async getUserInfo(user_id: string): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    } else {
      return responseMessage(user);
    }
  }

  // 更新密码
  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<ResponseResult> {
    const { user_id, oldPassword, newPassword, repeatedPassword } =
      updatePasswordDto;
    // 检查两次密码是否一致
    if (newPassword !== repeatedPassword) {
      throw new HttpException('两次输入的新密码不一致', HttpStatus.BAD_REQUEST);
    }
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 检查旧密码是否正确
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw new HttpException('旧密码不正确', HttpStatus.UNAUTHORIZED);
    }
    // 更新新密码
    user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt()); // 对新密码进行哈希处理
    await user.save();
    return responseMessage(true, '密码已成功更改');
  }

  // 更新用户信息
  async updateUserInfo(
    updateUserInfoDto: UpdateUserInfoDto,
  ): Promise<ResponseResult> {
    const { user_id, ...updateFields } = updateUserInfoDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    // 遍历更新字段
    let isUpdated = false;
    Object.entries(updateFields).forEach(([key, value]) => {
      if (value && String(value) !== String(user[key])) {
        if (key === 'address' && Array.isArray(value)) {
          value = JSON.stringify(value); // 将地址数组转换为JSON字符串
        }
        user[key] = value;
        isUpdated = true;
      }
    });
    if (isUpdated) {
      await user.save();
      return responseMessage(true, '用户信息已成功更新');
    } else {
      return responseMessage(null, '用户信息未发生改变，无需更新');
    }
  }
}
