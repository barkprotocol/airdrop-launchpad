import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createAirdrop(userId: string, amount: bigint) {
  try {
    if (amount <= BigInt(0)) {
      throw new Error('Amount must be greater than 0')
    }

    return await prisma.airdrop.create({
      data: {
        userId,
        amount,
        claimStatus: 'pending',
      },
    })
  } catch (error) {
    console.error('Error creating airdrop:', error)
    throw error
  }
}

export async function getAirdropsByUser(userId: string) {
  try {
    return await prisma.airdrop.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching airdrops for user:', error)
    throw error
  }
}

export async function updateAirdropStatus(airdropId: string, status: string, claimDate?: Date) {
  try {
    return await prisma.airdrop.update({
      where: {
        id: airdropId,
      },
      data: {
        claimStatus: status,
        claimDate,
      },
    })
  } catch (error) {
    console.error('Error updating airdrop status:', error)
    throw error
  }
}

export async function getAirdropById(airdropId: string) {
  try {
    return await prisma.airdrop.findUnique({
      where: {
        id: airdropId,
      },
    })
  } catch (error) {
    console.error('Error fetching airdrop by ID:', error)
    throw error
  }
}

export async function getTotalAirdropAmount(userId: string) {
  try {
    const result = await prisma.airdrop.aggregate({
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    })
    return result._sum.amount || BigInt(0)
  } catch (error) {
    console.error('Error calculating total airdrop amount:', error)
    throw error
  }
}

export async function deleteAirdrop(airdropId: string) {
  try {
    return await prisma.airdrop.delete({
      where: {
        id: airdropId,
      },
    })
  } catch (error) {
    console.error('Error deleting airdrop:', error)
    throw error
  }
}

