import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// import RedisConfig from '@/config/redis';
import { User } from '@/models/user/user.model';
// import { RedisCacheService } from '@/modules/redis-cache/redis-cache.service';
import { SEX } from '@/utils/constant/user';
import { REQUEST_CODE } from '@/utils/constant/request';
import { responseMessage } from '@/utils/constant/response';
import type { ResponseResult } from '@/utils/constant/response';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    // private readonly jwtService: JwtService,
    // private readonly redisCacheService: RedisCacheService,
  ) {}

  // 注册
  async register(authDto: AuthDto): Promise<ResponseResult> {
    const { email, password } = authDto;
    // 检查电子邮件是否已经存在
    const oldUser = await this.userModel.findOne({ where: { email } });
    if (oldUser) {
      throw new HttpException('注册失败，您已注册！', HttpStatus.BAD_REQUEST);
    }
    const user = new User();
    user.email = email;
    const salt = await bcrypt.genSalt(); // 对密码进行哈希处理
    user.password = await bcrypt.hash(password, salt);
    user.user_name = '小青果' + Math.floor(Math.random() * 10000000000);
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    user.birthday = date.toISOString().split('T')[0];
    user.age = 18; // 默认 18 岁
    user.sex = SEX.FEMALE; // 默认女
    await user.save();
    return responseMessage(true, '注册成功！', REQUEST_CODE.POST_SUCCESS);
  }

  // 登录
  async login(authDto: AuthDto): Promise<ResponseResult> {
    const { email, password } = authDto;
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('登录失败，您还未注册！', HttpStatus.BAD_REQUEST);
    }
    // 验证密码
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('登录失败，密码错误！', HttpStatus.BAD_REQUEST);
    }
    user.login_num += 1; // 更新用户的登录次数

    // 生成Token
    // const token = this.jwtService.sign({
    //   email: user.email,
    //   user_id: user.user_id,
    // });
    const token = this.generateToken(user); // no-redis
    user.token = token; // 将token保存到用户记录中
    // 将用户 token 保存到 redis
    // await this.redisCacheService.cacheSet(
    //   `${user.user_id}-${user.user_name}`,
    //   token,
    //   RedisConfig().expiresin,
    // );

    // 获取上次登录时间
    // const lastLoginTime = await this.redisCacheService.cacheGet(
    //   `${user.user_id}-last-login`,
    // );
    const lastLoginTime = user.login_last_time; // no redis
    if (lastLoginTime) {
      user.login_last_time = new Date(lastLoginTime);
    }
    // 保存当前登录的时间
    const currentLoginTime = new Date();
    // await this.redisCacheService.cacheSet(
    //   `${user.user_id}-last-login`,
    //   currentLoginTime.toISOString(),
    // );
    user.login_last_time = currentLoginTime;

    await user.save();
    return responseMessage(user, '登录成功！', REQUEST_CODE.POST_SUCCESS);
  }

  // 退出登录
  async logout(user_id: string): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    user.token = null;
    await user.save();
    return responseMessage(true);
  }

  // 注销用户
  async deleteUser(user_id: string): Promise<ResponseResult> {
    // 检查用户是否存在
    const user = await this.userModel.findOne({ where: { user_id } });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
    }
    await user.destroy();
    return responseMessage(true);
  }

  // no redis -- 生成 Token
  generateToken(user: User) {
    const payload = { email: user.email, sub: user.user_id };
    return jwt.sign(payload, process.env.APP_SECRET, { expiresIn: '24h' });
  }
}
