import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

let hashedPswd: string;
const prisma = new PrismaClient();

const testPassword = 'password';

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomCurrency() {
  return Number((Math.random() * 100).toFixed(2));
}

function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

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
  const flat = await prisma.flat.create({
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

  const netto = await prisma.tag.create({
    data: {
      name: 'Netto',
      flat: {
        connect: {
          flatId: flat.flatId,
        },
      },
    },
  });

  const drogerie = await prisma.tag.create({
    data: {
      name: 'Drogerie',
      flat: {
        connect: {
          flatId: flat.flatId,
        },
      },
    },
  });

  const away = await prisma.tag.create({
    data: {
      name: 'Auswärts',
      flat: {
        connect: {
          flatId: flat.flatId,
        },
      },
    },
  });

  function randomTag() {
    const tags = [netto, drogerie, away];
    return tags[randomIntFromInterval(0, 2)].tagId;
  }

  for (let i = 0; i < 1000; i++) {
    const randomNum = randomCurrency();
    const random = Math.random() > 0.5 ? flo : liz;
    const paidBy = random.userId;
    await prisma.expense.create({
      data: {
        amount: randomNum,
        date: randomDate(new Date(2020, 0, 1), new Date()),
        tag: {
          connect: {
            tagId: randomTag(),
          },
        },
        flat: {
          connect: {
            flatId: flat.flatId,
          },
        },
        paidBy: {
          connect: {
            userId: paidBy,
          },
        },
        expenseFor: {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
