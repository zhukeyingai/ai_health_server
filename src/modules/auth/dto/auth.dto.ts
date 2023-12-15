import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    type: String,
    description: '邮箱',
    example: 'example@example.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: '密码',
    example: 'password',
  })
  password: string;
}
