import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

let hashedPswd: string;
const prisma = new PrismaClient();

const testPassword = 'test';

async function main() {
  const hash = await bcrypt.hash(testPassword, 10);
  const flo = await prisma.user.create({
    data: {
      firstName: 'Flo',
      lastName: 'Test',
      nickname: 'flo',
      email: 'test@test.de',
      password: hash,
    },
  });

  const liz = await prisma.user.create({
    data: {
      firstName: 'Liz',
      lastName: 'Test',
      nickname: 'liz',
      email: 'test2@test.de',
      password: hash,
    },
  });
  const flats = await prisma.flat.create({
    data: {
      name: 'Flo & Liz Butze',
      owner: {
        connect: {
          userId: flo.userId,
        },
      },
      flatmates: {
        connect: [
          {
            userId: flo.userId,
          },
          {
            userId: liz.userId,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
