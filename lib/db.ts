import { PrismaClient, User, Airdrop, Eligibility } from '@prisma/client';

const prisma = new PrismaClient();

// User-related functions
export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { walletAddress },
      include: { eligibility: true, claims: true, airdrops: true },
    });
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    throw new Error('Unable to fetch user by wallet address');
  }
}

export async function createUser(walletAddress: string): Promise<User> {
  try {
    return await prisma.user.create({
      data: { walletAddress },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Unable to create user');
  }
}

// Eligibility-related functions
export async function createEligibility(userId: string, totalAmount: bigint, unclaimedAmount: bigint) {
  try {
    return await prisma.eligibility.create({
      data: { userId, totalAmount, unclaimedAmount },
    });
  } catch (error) {
    console.error('Error creating eligibility:', error);
    throw new Error('Unable to create eligibility');
  }
}

// Airdrop-related functions
export async function createAirdrop(userId: string, amount: bigint, claimStatus: string, category: string, description: string | undefined) {
  try {
    return await prisma.airdrop.create({
      data: { userId, amount, claimStatus, category, description },
    });
  } catch (error) {
    console.error('Error creating airdrop:', error);
    throw new Error('Unable to create airdrop');
  }
}

// Airdrop statistics functions
export async function getAirdropStatistics() {
  try {
    const totalDistributed = await getTotalDistributedAmount();
    const totalClaimed = await getTotalClaimedAmount();
    const airdropWalletBalance = await airdropWalletBalance();

    return {
      totalDistributed: totalDistributed.toString(),
      totalClaimed: totalClaimed.toString(),
      airdropWalletBalance: airdropWalletBalance.toString(),
      remainingToClaim: (totalDistributed - totalClaimed).toString(),
    };
  } catch (error) {
    console.error('Error fetching airdrop statistics:', error);
    throw new Error('Unable to fetch airdrop statistics');
  }
}

// Implement the missing functions with Prisma aggregation
async function getTotalDistributedAmount(): Promise<bigint> {
  try {
    const totalDistributed = await prisma.airdrop.aggregate({
      _sum: { amount: true },
    });
    return totalDistributed._sum.amount || 0n;
  } catch (error) {
    console.error('Error fetching total distributed amount:', error);
    throw new Error('Unable to fetch total distributed amount');
  }
}

async function getTotalClaimedAmount(): Promise<bigint> {
  try {
    const totalClaimed = await prisma.airdrop.aggregate({
      where: { claimStatus: 'claimed' },
      _sum: { amount: true },
    });
    return totalClaimed._sum.amount || 0n;
  } catch (error) {
    console.error('Error fetching total claimed amount:', error);
    throw new Error('Unable to fetch total claimed amount');
  }
}

async function airdropWalletBalance(): Promise<bigint> {
  // Implement logic to fetch the balance of the airdrop wallet
  return 1000000n; // Example placeholder
}
