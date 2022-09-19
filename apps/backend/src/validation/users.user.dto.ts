import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export interface FormatLogin extends Partial<User> {
  email: string;
  userId: string;
}
export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
export class UpdatePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  new_password: string;

  @IsNotEmpty()
  @ApiProperty()
  old_password: string;
}
