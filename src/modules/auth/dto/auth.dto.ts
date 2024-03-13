import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({
    type: 'string',
    description: '邮箱',
    example: 'example@example.com',
  })
  email: string;

  @ApiProperty({
    type: 'string',
    description: '密码',
    example: 'password',
  })
  password: string;
}
