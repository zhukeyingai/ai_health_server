/**
 * redis 配置
 */
import { registerAs } from '@nestjs/config';
import { toNumber } from 'lodash';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: toNumber(process.env.REDIS_PORT),
  db: toNumber(process.env.REDIS_DB), // 目标库
  password: process.env.REDIS_PASSWORD,
  family: 4, // 4 (IPv4) or 6 (IPv6)
  expiresin: 60 * 60 * 24 * 7, // redis 过期时长，默认 7 天
}));
