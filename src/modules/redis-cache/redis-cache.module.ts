import { Module } from '@nestjs/common';

import { RedisCacheController } from './redis-cache.controller';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [],
  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  controllers: [RedisCacheController],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
