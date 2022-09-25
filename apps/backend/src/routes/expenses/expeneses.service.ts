import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/providers/services/prisma.service';
import { ErrorService } from '../../providers/services/error/error.service';

import {
  CreateUserDto,
  FormatLogin,
  LoginUserDto,
  UpdatePasswordDto,
} from '../../validation/users.user.dto';
import { Expense, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { CreateExpenese } from 'src/validation/expenese.types';
import { UserWithoutPassword } from 'src/validation/flat.types';

@Injectable()
export class ExpenesesService {
  loggerContext = 'ExpenesesService';

  constructor(
    private readonly errorService: ErrorService,
    private readonly logger: Logger,
    private prisma: PrismaService,
  ) {}

  async getAllExpeneses({ userId }: { userId: string }): Promise<any> {
    const flat = await this.prisma.flat.findFirst({
      where: {
        OR: [{ ownerId: userId }, { flatmates: { some: { userId: userId } } }],
      },
      include: {
        expenses: {
          include: {
            tag: true,
            paidBy: {
              select: UserWithoutPassword,
            },
            expenseFor: {
              select: UserWithoutPassword,
            },
          },
        },
      },
    });
    if (!flat) {
      throw new HttpException('user_does_not_exist', HttpStatus.CONFLICT);
    }
    return flat.expenses;
  }

  async getSpecific(
    { userId }: { userId: string },
    expenseId,
  ): Promise<Expense> {
    const expense = await this.prisma.expense.findFirst({
      where: {
        expenseId,
        OR: [
          { flat: { ownerId: userId } },
          { flat: { flatmates: { some: { userId: userId } } } },
        ],
      },
      orderBy: {
        date: 'desc',
      },
      include: {
        paidBy: true,
        expenseFor: true,
        tag: true,
      },
    });
    if (!expense) {
      throw new HttpException('expense_does_not_exist', HttpStatus.CONFLICT);
    }
    return expense;
  }

  async createExpense(
    { userId }: { userId: string },
    createExpenese: CreateExpenese,
  ): Promise<any> {
    const flat = await this.prisma.user.findFirst({
      where: {
        OR: [
          { flat: { ownerId: userId } },
          { flat: { flatmates: { some: { userId: userId } } } },
        ],
      },
    });
    if (flat) {
      throw new HttpException('no_flat_found', HttpStatus.CONFLICT);
    }
    return await this.prisma.expense.create({
      data: {
        date: createExpenese.date,
        flat: {
          connect: {
            flatId: flat.flatId,
          },
        },
        tag: {
          connect: {
            tagId: createExpenese.tag,
          },
        },
        paidBy: {
          connect: {
            userId: createExpenese.paidBy,
          },
        },
        expenseFor: {
          connect: createExpenese.expenseFor.map((id) => ({ userId: id })),
        },
        amount: createExpenese.amount,
      },
    });
  }

  // VERIFY LOGIN
  async verifyLogin(loginUserDto: LoginUserDto): Promise<FormatLogin> {
    const { username, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });
    if (!user) {
      throw new HttpException('invalid_credentials', HttpStatus.UNAUTHORIZED);
    }
    const areEqual = await compare(password, user.password);
    Logger.log(password, user.password);
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
