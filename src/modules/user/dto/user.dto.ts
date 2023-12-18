import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    type: String,
    description: '用户id',
  })
  user_id: string;
}

export class UpdateAccountDto {
  @ApiProperty({
    type: String,
    description: '密码',
  })
  password: string;
}
