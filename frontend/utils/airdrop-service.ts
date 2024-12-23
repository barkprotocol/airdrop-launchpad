import { prisma } from '@/prisma/client';
import { Airdrop, User, Eligibility } from '@prisma/client';
import { sendNotification } from './notification';
import { logger } from './logger';

// Function to initiate an airdrop
export async function initiateAirdrop(
  userId: string,
  amount: bigint,
  category: string,
  description?: string
): Promise<Airdrop> {
  try {
    // Check if user eligibility is valid
    const userEligibility = await prisma.eligibility.findUnique({
      where: { userId },
    });
    if (!userEligibility || userEligibility.unclaimedAmount < amount) {
      throw new Error('User is not eligible for this airdrop');
    }

    // Create the airdrop record
    const airdrop = await prisma.airdrop.create({
      data: {
        userId,
        amount: amount.toString(),
        claimStatus: 'pending', // Pending until claimed by the user
        category,
        description,
      },
    });

    // Optionally, notify the user about the airdrop
    await sendNotification(userId, 'New Airdrop Pending', `You have a pending airdrop of ${amount} tokens in the ${category} category.`);

    // Log the successful creation of the airdrop
    logger.info(`Airdrop initiated for user ${userId} with amount ${amount} in category ${category}`);

    return airdrop;
  } catch (error) {
    logger.error('Error initiating airdrop', error);
    throw new Error('Unable to initiate airdrop');
  }
}

// Function to update airdrop claim status
export async function updateAirdropClaimStatus(airdropId: string, claimStatus: boolean): Promise<Airdrop> {
  try {
    // Update the claim status of the airdrop
    const updatedAirdrop = await prisma.airdrop.update({
      where: { id: airdropId },
      data: {
        claimStatus: claimStatus ? 'claimed' : 'pending',
      },
    });

    // Log the status update
    logger.info(`Airdrop ${airdropId} status updated to ${claimStatus ? 'claimed' : 'pending'}`);

    return updatedAirdrop;
  } catch (error) {
    logger.error('Error updating airdrop claim status', error);
    throw new Error('Unable to update airdrop claim status');
  }
}

// Function to get airdrop by ID
export async function getAirdropById(airdropId: string): Promise<Airdrop | null> {
  try {
    return await prisma.airdrop.findUnique({
      where: { id: airdropId },
    });
  } catch (error) {
    logger.error('Error fetching airdrop by ID', error);
    throw new Error('Unable to fetch airdrop by ID');
  }
}

// Function to get all pending airdrops for a user
export async function getPendingAirdropsForUser(userId: string): Promise<Airdrop[]> {
  try {
    return await prisma.airdrop.findMany({
      where: {
        userId,
        claimStatus: 'pending',
      },
    });
  } catch (error) {
    logger.error('Error fetching pending airdrops for user', error);
    throw new Error('Unable to fetch pending airdrops');
  }
}

// Function to check if a user is eligible for an airdrop based on certain conditions
export async function isUserEligibleForAirdrop(userId: string, amount: bigint): Promise<boolean> {
  try {
    // Fetch user eligibility
    const eligibility = await prisma.eligibility.findUnique({
      where: { userId },
    });
    if (!eligibility) {
      throw new Error('User eligibility not found');
    }

    // Check if user has enough unclaimed amount
    return eligibility.unclaimedAmount >= amount;
  } catch (error) {
    logger.error('Error checking user eligibility', error);
    throw new Error('Unable to check user eligibility');
  }
}

// Function to get the total amount of distributed airdrops
export async function getTotalDistributedAmount(): Promise<bigint> {
  try {
    const totalDistributed = await prisma.airdrop.aggregate({
      _sum: { amount: true },
    });
    return totalDistributed._sum.amount ? BigInt(totalDistributed._sum.amount.toString()) : 0n;
  } catch (error) {
    logger.error('Error fetching total distributed amount', error);
    throw new Error('Unable to fetch total distributed amount');
  }
}

// Function to get the total amount of claimed airdrops
export async function getTotalClaimedAmount(): Promise<bigint> {
  try {
    const totalClaimed = await prisma.airdrop.aggregate({
      where: { claimStatus: 'claimed' },
      _sum: { amount: true },
    });
    return totalClaimed._sum.amount ? BigInt(totalClaimed._sum.amount.toString()) : 0n;
  } catch (error) {
    logger.error('Error fetching total claimed amount', error);
    throw new Error('Unable to fetch total claimed amount');
  }
}

// Function to get the remaining unclaimed airdrop amount
export async function getRemainingUnclaimedAmount(): Promise<bigint> {
  try {
    const totalDistributed = await getTotalDistributedAmount();
    const totalClaimed = await getTotalClaimedAmount();

    return totalDistributed - totalClaimed;
  } catch (error) {
    logger.error('Error fetching remaining unclaimed amount', error);
    throw new Error('Unable to fetch remaining unclaimed amount');
  }
}
