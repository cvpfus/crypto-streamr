import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const admin: Prisma.UserCreateInput = {
  username: "admin",
  address: "0xc250e5cfb6ae3a628846b1412b85d92a02c67acc9c6979b5748cdc4a6dddd97c",
};

const history: Prisma.HistoryCreateInput = {
  sender: "CryptoStreamr",
  message: "This is just a test notification.",
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
