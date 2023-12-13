import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';

import { User } from '@/models/user.model';
import { SEX } from '@/utils/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email },
    });
  }

  async create(email: string, password: string): Promise<User> {
    const user = new User();
    user.email = email;
    // 对密码进行哈希处理
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, salt);
    user.user_name = '小青果' + Math.floor(Math.random() * 10000000000);
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18); // Set birthday to 18 years ago
    user.birthday = date.toISOString().split('T')[0]; // Format to 'YYYY-MM-DD'
    user.age = 18; // Set age to 18
    user.sex = SEX.PRIVACY; // Set sex to '2'
    await user.save();
    return user;
  }
}
