import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser(walletAddress: string, email?: string) {
  return prisma.user.create({
    data: {
      walletAddress,
      email,
    },
  })
}

export async function getUserByWalletAddress(walletAddress: string) {
  return prisma.user.findUnique({
    where: {
      walletAddress,
    },
  })
}
