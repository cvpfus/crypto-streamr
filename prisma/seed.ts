import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const admin: Prisma.UserCreateInput = {
  username: "admin",
  address: "0x0",
};

const history: Prisma.HistoryCreateInput = {
  sender: "CryptoStreamr",
  message: "This is just a test.",
  amount: new Prisma.Decimal(100),
  ticker: "APT",
  isTest: true,
  user: {
    connect: {
      username: "admin",
    },
  },
};

async function main() {
  console.log(`Start seeding ...`);
  await prisma.user.create({
    data: admin,
  });
  await prisma.history.create({
    data: history,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log(`Seeding finished.`);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
