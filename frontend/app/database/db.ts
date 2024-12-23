import prisma from '@/prisma/client';

/**
 * Fetch a user by their wallet address.
 */
export async function getUserByWalletAddress(walletAddress: string) {
  try {
    return await prisma.user.findUnique({
      where: { walletAddress },
    });
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    throw new Error('Unable to retrieve user by wallet address.');
  }
}

/**
 * Check eligibility for a user in a specific airdrop campaign.
 */
export async function getEligibility(userId: string, airdropCampaignId: string) {
  try {
    return await prisma.eligibility.findUnique({
      where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
    });
  } catch (error) {
    console.error('Error fetching eligibility:', error);
    throw new Error('Unable to check eligibility.');
  }
}

/**
 * Create a new claim record for a user.
 */
export async function createClaim(userId: string, airdropCampaignId: string) {
  try {
    return await prisma.claim.create({
      data: {
        userId,
        airdropCampaignId,
        status: 'pending', // Default status
      },
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    throw new Error('Unable to create a claim record.');
  }
}

/**
 * Update the status of an airdrop campaign.
 */
export async function updateAirdropStatus(airdropCampaignId: string, status: string) {
  try {
    return await prisma.airdropCampaign.update({
      where: { id: airdropCampaignId },
      data: { status },
    });
  } catch (error) {
    console.error('Error updating airdrop status:', error);
    throw new Error('Unable to update airdrop status.');
  }
}

/**
 * Check if a user is whitelisted for a specific airdrop campaign.
 */
export async function isWhitelisted(userId: string, airdropCampaignId: string) {
  try {
    const whitelist = await prisma.whitelist.findFirst({
      where: { userId, airdropCampaignId },
    });
    return !!whitelist; // Returns true if the user is whitelisted
  } catch (error) {
    console.error('Error checking whitelist status:', error);
    throw new Error('Unable to verify whitelist status.');
  }
}

/**
 * Get the wallet associated with an airdrop campaign.
 */
export async function getAirdropWallet(airdropCampaignId: string) {
  try {
    return await prisma.airdropWallet.findUnique({
      where: { airdropCampaignId },
    });
  } catch (error) {
    console.error('Error fetching airdrop wallet:', error);
    throw new Error('Unable to fetch the associated airdrop wallet.');
  }
}

/**
 * Update the balance of an airdrop wallet.
 */
export async function updateAirdropWalletBalance(airdropCampaignId: string, newBalance: number) {
  try {
    return await prisma.airdropWallet.update({
      where: { airdropCampaignId },
      data: { balance: newBalance },
    });
  } catch (error) {
    console.error('Error updating airdrop wallet balance:', error);
    throw new Error('Unable to update wallet balance.');
  }
}

/**
 * Create a new transaction record.
 */
export async function createTransaction(userId: string, transactionHash: string, status: string) {
  try {
    return await prisma.transaction.create({
      data: {
        userId,
        transactionHash,
        status, // e.g., 'pending', 'success', 'failed'
      },
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Unable to create transaction record.');
  }
}

/**
 * Update the status of a claim.
 */
export async function updateClaimStatus(claimId: string, status: string) {
  try {
    return await prisma.claim.update({
      where: { id: claimId },
      data: { status },
    });
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw new Error('Unable to update claim status.');
  }
}

/**
 * Update eligibility status for a user in an airdrop campaign.
 */
export async function updateEligibility(userId: string, airdropCampaignId: string, isEligible: boolean) {
  try {
    return await prisma.eligibility.update({
      where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
      data: { isEligible },
    });
  } catch (error) {
    console.error('Error updating eligibility:', error);
    throw new Error('Unable to update eligibility status.');
  }
}
