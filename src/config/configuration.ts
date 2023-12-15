/**
 * 全局配置
 */
import { registerAs } from '@nestjs/config';

export default registerAs('app_global', () => ({
  port: process.env.APP_PROT,
  secret: process.env.APP_SECRET,
  //   oss: {}, // oss 阿里云的对象存储服务
}));
