import { IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export interface FormatLogin extends Partial<User> {
  email: string;
  userId: string;
  flatId: string;
}

export const UserWithoutPassword = {
  userId: true,
  email: true,
  firstName: true,
  lastName: true,
  flat: {
    select: {
      flatId: true,
      name: true,
    },
  },
};

export class UpdateFlat {
  @ApiProperty()
  @IsNotEmpty()
  readonly flatId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  ownerId?: string;
}
