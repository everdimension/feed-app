import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (process.env.NODE_ENV === 'production') {
  prismaInstance = new PrismaClient();
  prismaInstance.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  prismaInstance = global.__db;
}

export { prismaInstance as prisma };
