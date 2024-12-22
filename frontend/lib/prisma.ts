import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Example: Close Prisma Client when app is terminated
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
