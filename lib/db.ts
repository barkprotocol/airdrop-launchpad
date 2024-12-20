import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// User-related functions
export async function getUserByWalletAddress(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress },
    include: { eligibility: true, claims: true, airdrops: true },
  })
}

export async function createUser(walletAddress: string) {
  return prisma.user.create({
    data: { walletAddress },
  })
}

export async function getUsers(
  page: number,
  limit: number,
  filter: string,
  search: string
): Promise<{ users: any[], total: number }> {
  const skip = (page - 1) * limit

  let whereClause: any = {}
  if (filter && filter !== 'all') {
    whereClause.status = filter.toUpperCase()
  }
  if (search) {
    whereClause.OR = [
      { walletAddress: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        walletAddress: true,
        email: true,
        createdAt: true,
        status: true,
      },
    }),
    prisma.user.count({ where: whereClause }),
  ])

  return { users, total }
}

export async function updateUserStatus(userId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<any> {
  return prisma.user.update({
    where: { id: userId },
    data: { status },
  })
}

// Eligibility-related functions
export async function getEligibility(userId: string) {
  return prisma.eligibility.findUnique({
    where: { userId },
    include: { categories: { include: { category: true } } },
  })
}

export async function createEligibility(userId: string, totalAmount: bigint, unclaimedAmount: bigint) {
  return prisma.eligibility.create({
    data: { userId, totalAmount, unclaimedAmount },
  })
}

export async function updateEligibility(id: string, totalAmount: bigint, unclaimedAmount: bigint) {
  return prisma.eligibility.update({
    where: { id },
    data: { totalAmount, unclaimedAmount },
  })
}

// Claim-related functions
export async function createClaim(userId: string, amount: bigint, status: string) {
  return prisma.claim.create({
    data: { userId, amount, status },
  })
}

export async function updateClaimStatus(claimId: string, status: string, transactionSignature?: string) {
  return prisma.claim.update({
    where: { id: claimId },
    data: { status, transactionSignature },
  })
}

// Airdrop-related functions
export async function createAirdrop(userId: string, amount: bigint, claimStatus: string, category: string, description: string | undefined) {
  return prisma.airdrop.create({
    data: { userId, amount, claimStatus },
  })
}

export async function updateAirdropStatus(airdropId: string, claimStatus: string, claimDate?: Date) {
  return prisma.airdrop.update({
    where: { id: airdropId },
    data: { claimStatus, claimDate },
  })
}

// Whitelist-related functions
export async function isWhitelisted(walletAddress: string) {
  const whitelist = await prisma.whitelist.findUnique({
    where: { walletAddress },
  })
  return !!whitelist
}

export async function addToWhitelist(walletAddress: string) {
  return prisma.whitelist.create({
    data: { walletAddress },
  })
}

// Subscription-related functions
export async function createSubscription(email: string) {
  return prisma.subscription.create({
    data: { email },
  })
}

export async function getSubscription(email: string) {
  return prisma.subscription.findUnique({
    where: { email },
  })
}

// Airdrop Wallet-related functions
export async function getAirdropWallet() {
  return prisma.airdropWallet.findFirst()
}

export async function createAirdropWallet(walletAddress: string, initialBalance: bigint) {
  return prisma.airdropWallet.create({
    data: { walletAddress, balance: initialBalance, usedBalance: BigInt(0) },
  })
}

export async function updateAirdropWalletBalance(id: string, newBalance: bigint, usedBalance: bigint) {
  return prisma.airdropWallet.update({
    where: { id },
    data: { balance: newBalance, usedBalance },
  })
}

export async function getAirdropWalletBalance() {
  const airdropWallet = await getAirdropWallet()
  if (!airdropWallet) {
    throw new Error('Airdrop wallet not found')
  }
  return {
    totalBalance: airdropWallet.balance,
    usedBalance: airdropWallet.usedBalance,
    availableBalance: airdropWallet.balance - airdropWallet.usedBalance
  }
}

// Transaction-related functions
export async function createTransaction(
  airdropWalletId: string,
  amount: bigint,
  recipientAddress: string,
  status: string,
  transactionSignature?: string
) {
  return prisma.$transaction.create({
    data: {
      airdropWalletId,
      amount,
      recipientAddress,
      status,
      transactionSignature,
    },
  })
}

export async function updateTransactionStatus(id: string, status: string, transactionSignature?: string) {
  return prisma.$transaction.update({
    where: { id },
    data: { status, transactionSignature },
  })
}

export async function getTransactionsByAirdropWallet(airdropWalletId: string) {
  return prisma.$transaction.findMany({
    where: { airdropWalletId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTransactionById(id: string) {
  return prisma.$transaction.findUnique({
    where: { id },
  })
}

export async function getUserTransactions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { claims: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const claimIds = user.claims.map(claim => claim.id)

  return prisma.$transaction.findMany({
    where: {
      OR: [
        { recipientAddress: user.walletAddress },
        { id: { in: claimIds } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Airdrop statistics functions
export async function getTotalDistributedAmount() {
  const result = await prisma.$transaction.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: 'completed',
    },
  })
  return result._sum.amount || BigInt(0)
}

export async function getTotalClaimedAmount() {
  const result = await prisma.claim.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: 'completed',
    },
  })
  return result._sum.amount || BigInt(0)
}

export async function getAirdropStatistics() {
  const totalDistributed = await getTotalDistributedAmount()
  const totalClaimed = await getTotalClaimedAmount()
  const airdropWalletBalance = await getAirdropWalletBalance()

  return {
    totalDistributed,
    totalClaimed,
    airdropWalletBalance,
    remainingToClaim: totalDistributed - totalClaimed,
  }
}

export async function getTotalParticipants(): Promise<number> {
  return prisma.user.count({
    where: {
      OR: [
        { claims: { some: {} } },
        { airdrops: { some: {} } }
      ]
    }
  });
}

export default prisma