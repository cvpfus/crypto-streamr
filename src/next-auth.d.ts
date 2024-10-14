import type { User as PrismaUser } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: PrismaUser;
  }
}
