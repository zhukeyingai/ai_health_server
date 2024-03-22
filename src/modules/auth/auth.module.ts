import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User } from '@/models/user/user.model';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { SequelizeModule } from '@nestjs/sequelize';

// import AppConfig from '@/config/configuration';
// import { User } from '@/models/user.model';
// import { RedisCacheService } from '@/modules/redis-cache/redis-cache.service'; // RedisCache Service
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtStrategy } from './jwt.strategy';

// @Module({
//   imports: [
//     SequelizeModule.forFeature([User]),
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.register({
//       secret: AppConfig().secret,
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, RedisCacheService, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
