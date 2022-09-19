import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/providers/services/prisma.service';
import { ErrorService } from '../../providers/services/error/error.service';
import {
  CreateUserDto,
  FormatLogin,
  LoginUserDto,
  UpdatePasswordDto,
} from '../../validation/users.user.dto';
import { User } from '@prisma/client';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  loggerContext = 'UserService';

  constructor(
    private readonly errorService: ErrorService,
    private readonly logger: Logger,
    private prisma: PrismaService,
  ) {}

  async getUsers(query: unknown): Promise<any> {
    const users = await this.prisma.user.findMany({});
    return users;
  }

  async create(userDto: CreateUserDto): Promise<any> {
    const userInDb = await this.prisma.user.findFirst({
      where: { email: userDto.email },
    });
    if (userInDb) {
      throw new HttpException('user_already_exist', HttpStatus.CONFLICT);
    }
    return await this.prisma.user.create({
      data: {
        ...userDto,
        password: await hash(userDto.password, 10),
        flat: {
          create: {
            name: userDto.firstName,
            owner: {
              connect: {
                email: userDto.email,
              },
            },
          },
        },
      },
    });
  }
  async verifyLogin(loginUserDto: LoginUserDto): Promise<FormatLogin> {
    const { username, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await compare(password, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    const { password: p, ...rest } = user;
    return rest;
  }
  async findByPayload({ email }: any): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { email: email },
    });
  }

  async updatePassword(payload: UpdatePasswordDto, id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { userId: id },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await compare(payload.old_password, user.password);
    if (!areEqual) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    return await this.prisma.user.update({
      where: { userId: id },
      data: { password: await hash(payload.new_password, 10) },
    });
  }
}
