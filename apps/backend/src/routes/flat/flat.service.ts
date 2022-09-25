import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/providers/services/prisma.service';
import { ErrorService } from '../../providers/services/error/error.service';

import { Flat } from '@prisma/client';
import { UserWithoutPassword } from 'src/validation/users.user.dto';
import { UpdateFlat } from 'src/validation/flat.types';
import { Status } from 'src/validation';

@Injectable()
export class FlatService {
  loggerContext = 'FlatService';

  constructor(
    private readonly errorService: ErrorService,
    private readonly logger: Logger,
    private prisma: PrismaService,
  ) {}

  async getFlat({ userId }: { userId: string }): Promise<any> {
    const flat = await this.prisma.flat.findFirst({
      where: {
        OR: [{ owner: { userId } }, { flatmates: { some: { userId } } }],
      },
      include: {
        flatmates: {
          select: UserWithoutPassword,
        },
      },
    });
    if (!flat) {
      throw new HttpException('flat_does_not_exist', HttpStatus.CONFLICT);
    }
    return flat;
  }

  async updateFlat(
    { userId }: { userId: string },
    updateFlat: UpdateFlat,
  ): Promise<Status<Flat>> {
    let status: Status<Flat> = {
      status: true,
      message: 'flat_updated',
    };
    try {
      const flat = await this.prisma.flat.findFirst({
        where: {
          OR: [{ owner: { userId } }, { flatmates: { some: { userId } } }],
        },
      });
      if (!flat) {
        throw new HttpException('flat_does_not_exist', HttpStatus.CONFLICT);
      }
      status.data = await this.prisma.flat.update({
        where: { flatId: flat.flatId },
        data: updateFlat,
      });
    } catch (e) {
      status = {
        status: false,
        message: e.message,
      };
    }

    return status;
  }
}
