import { PrismaClient } from '@prisma/client';

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Optional: Handle Prisma client disconnection in serverless environments
// If you're using a serverless environment, you may want to ensure the Prisma Client instance is reused
if (process.env.NODE_ENV === 'production') {
  prisma.$connect();
} else {
  let prismaInstance: PrismaClient;

  if (globalThis.prisma) {
    prismaInstance = globalThis.prisma as PrismaClient;
  } else {
    prismaInstance = new PrismaClient();
    globalThis.prisma = prismaInstance;
  }

  // Export the instance for use in your application
  export default prismaInstance;
} else {
  // For non-serverless environments (e.g., local dev), create a single PrismaClient instance
  export default prisma;
}