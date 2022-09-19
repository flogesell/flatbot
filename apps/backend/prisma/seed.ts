import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

let hashedPswd: string;
const prisma = new PrismaClient();

fuc
bcrypt.genSalt(10, function (err, salt) {
  bcrypt.hash('password', salt, function (err, hash) {
    hashedPswd = hash;
  });
});

async function main() {
  const exampleFlat = await prisma.flat.create({
    data: {
      flatId: '8e3399e6-1d94-11ec-9621-0242ac130002',
      name: 'Flos Testwohnung',
      flatmates: {
        create: {
          email: 'test@test.de',
          password: await hashedPswd,
          nickname: 'Liz',
          firstName: 'Liz',
          lastName: 'Test',
        },
      },
      owner: {
        connect: { email: 'test@test.de' },
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
