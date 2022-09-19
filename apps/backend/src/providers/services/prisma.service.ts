import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await prisma.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    prisma.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
