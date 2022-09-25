import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from '../../validation/users.user.dto';
import { PrismaService } from '../../providers/services/prisma.service';
import { User } from '@prisma/client';
import { RegistrationStatus } from 'src/validation/auth.auth.dto';
import { JwtPayload } from 'src/validation/jwts.jwt.dto';
// import {User} from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
  ) {}

  async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'ACCOUNT_CREATE_SUCCESS',
    };

    try {
      status.data = await this.usersService.create(userDto);
    } catch (err) {
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.verifyLogin(loginUserDto);
    const token = this._createToken(user);
    return {
      ...token,
      data: user,
    };
  }

  private _createToken({ email, userId, flatId }): any {
    const userObject: JwtPayload = { email, userId, flatId };
    const token = this.jwtService.sign(userObject);
    return {
      tokens: {
        expiresIn: process.env.EXPIRESIN,
        access_token: token,
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('INVALID_TOKEN', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
