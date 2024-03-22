import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { User } from '@/models/user/user.model';
import { WeightRecords } from '@/models/user/weight.model';
import { responseMessage } from '@/utils/constant/response';
import type { ResponseResult } from '@/utils/constant/response';
import { UpdatePasswordDto, UpdateUserInfoDto } from './dto/user.dto';
import { WeightRecordsDto } from './dto/weight.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(WeightRecords)
    private weightRecordsModel: typeof WeightRecords,
  ) {}

  private readonly AVATAR_UPLOAD_DIR = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'upload',
    'avatar',
  );

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
        console.log('@key', key);
        user[key] =
          key === 'address' && Array.isArray(value)
            ? JSON.stringify(value)
            : value;
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

  // 上传用户头像
  async uploadAvatar(avatarFile: Express.Multer.File): Promise<ResponseResult> {
    if (!avatarFile) {
      throw new HttpException('未上传头像文件', HttpStatus.NOT_FOUND);
    }
    if (!fs.existsSync(this.AVATAR_UPLOAD_DIR)) {
      fs.mkdirSync(this.AVATAR_UPLOAD_DIR, { recursive: true });
    }
    // 生成新的文件名（避免重名）
    const fileName = `${Date.now()}-${avatarFile.originalname}`;
    // 存储图片到服务器
    const filePath = path.join(this.AVATAR_UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, avatarFile.buffer);
    // 更新用户头像 URL
    const fileUrl = `http://localhost:${process.env.APP_PROT}/static/avatar/${fileName}`;
    const file = {
      name: fileName,
      url: fileUrl,
    };
    return responseMessage(file, '头像已成功上传');
  }

  // 上传每日体重
  async postDailyWeight(
    weightRecordsDto: WeightRecordsDto,
  ): Promise<ResponseResult> {
    const { user_id, weight } = weightRecordsDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const existedWeightRecord = await this.weightRecordsModel.findOne({
      where: {
        user_id,
        date: new Date().toISOString().split('T')[0],
      },
    });
    if (existedWeightRecord) {
      throw new HttpException(
        '今日体重已存在，无法再次上传',
        HttpStatus.FORBIDDEN,
      );
    }
    const currentWeightRecord = {
      user_id,
      date: new Date(),
      weight,
    };
    user.weight = weight;
    await this.weightRecordsModel.create(currentWeightRecord);
    await user.save();
    return responseMessage(true);
  }

  // 查询当日体重
  async queryDailyWeight(user_id: string): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    const existedWeightRecord = await this.weightRecordsModel.findOne({
      where: {
        user_id,
        date: new Date().toISOString().split('T')[0],
      },
    });
    if (existedWeightRecord) {
      return responseMessage(true);
    } else {
      return responseMessage(false);
    }
  }
}
