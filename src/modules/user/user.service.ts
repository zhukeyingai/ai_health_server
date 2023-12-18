import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '@/models/user.model';
import { REQUEST_CODE } from '@/utils/constant/request';
import { responseMessage } from '@/utils/constant/response';
import type { ResponseResult } from '@/utils/constant/response';
import { UserInfoDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // findAll() {
  //   return `This action returns all user`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
