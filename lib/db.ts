import prisma from '@/prisma/client';

// Get user by wallet address
export async function getUserByWalletAddress(walletAddress: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { walletAddress },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by wallet address:', error);
    throw new Error('Unable to get user by wallet address');
  }
}

// Get eligibility for a user in a specific airdrop campaign
export async function getEligibility(userId: string, airdropCampaignId: string) {
  try {
    const eligibility = await prisma.eligibility.findUnique({
      where: {
        userId_airdropCampaignId: {
          userId,
          airdropCampaignId,
        },
      },
    });
    return eligibility;
  } catch (error) {
    console.error('Error fetching eligibility:', error);
    throw new Error('Unable to fetch eligibility');
  }
}

// Create a new claim record for a user
export async function createClaim(userId: string, airdropCampaignId: string) {
  try {
    const claim = await prisma.claim.create({
      data: {
        userId,
        airdropCampaignId,
        status: 'pending', // Default status as 'pending'
      },
    });
    return claim;
  } catch (error) {
    console.error('Error creating claim:', error);
    throw new Error('Unable to create claim');
  }
}

// Update airdrop status (e.g., 'completed' or 'in-progress')
export async function updateAirdropStatus(airdropCampaignId: string, status: string) {
  try {
    const updatedAirdrop = await prisma.airdropCampaign.update({
      where: { id: airdropCampaignId },
      data: { status },
    });
    return updatedAirdrop;
  } catch (error) {
    console.error('Error updating airdrop status:', error);
    throw new Error('Unable to update airdrop status');
  }
}

// Check if a user is whitelisted for a specific airdrop
export async function isWhitelisted(userId: string, airdropCampaignId: string) {
  try {
    const whitelist = await prisma.whitelist.findFirst({
      where: {
        userId,
        airdropCampaignId,
      },
    });
    return whitelist !== null;
  } catch (error) {
    console.error('Error checking whitelist status:', error);
    throw new Error('Unable to check whitelist status');
  }
}

// Get the wallet address associated with an airdrop campaign
export async function getAirdropWallet(airdropCampaignId: string) {
  try {
    const wallet = await prisma.airdropWallet.findUnique({
      where: { airdropCampaignId },
    });
    return wallet;
  } catch (error) {
    console.error('Error fetching airdrop wallet:', error);
    throw new Error('Unable to fetch airdrop wallet');
  }
}

// Get the balance of an airdrop wallet
export async function getAirdropWalletBalance(airdropCampaignId: string) {
  try {
    const wallet = await prisma.airdropWallet.findUnique({
      where: { airdropCampaignId },
      select: { balance: true }, // Only select the balance field
    });
    if (!wallet) {
      throw new Error('Airdrop wallet not found');
    }
    return wallet.balance;
  } catch (error) {
    console.error('Error fetching airdrop wallet balance:', error);
    throw new Error('Unable to fetch airdrop wallet balance');
  }
}

// Update the balance of an airdrop wallet (e.g., after distributing tokens)
export async function updateAirdropWalletBalance(airdropCampaignId: string, newBalance: number) {
  try {
    const updatedWallet = await prisma.airdropWallet.update({
      where: { airdropCampaignId },
      data: { balance: newBalance },
    });
    return updatedWallet;
  } catch (error) {
    console.error('Error updating airdrop wallet balance:', error);
    throw new Error('Unable to update airdrop wallet balance');
  }
}

// Create a new transaction record for tracking claims, transfers, etc.
export async function createTransaction(userId: string, transactionHash: string, status: string) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        transactionHash,
        status, // e.g., 'pending', 'success', 'failed'
      },
    });
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw new Error('Unable to create transaction');
  }
}

// Update the status of a claim (e.g., 'approved', 'rejected', etc.)
export async function updateClaimStatus(claimId: string, status: string) {
  try {
    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: { status },
    });
    return updatedClaim;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw new Error('Unable to update claim status');
  }
}

// Update eligibility status (e.g., after claim approval)
export async function updateEligibility(userId: string, airdropCampaignId: string, isEligible: boolean) {
  try {
    const updatedEligibility = await prisma.eligibility.update({
      where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
      data: { isEligible },
    });
    return updatedEligibility;
  } catch (error) {
    console.error('Error updating eligibility:', error);
    throw new Error('Unable to update eligibility');
  }
}

// Example of a transaction that groups multiple queries together atomically
export async function createClaimAndUpdateEligibility(userId: string, airdropCampaignId: string, isEligible: boolean) {
  try {
    const transaction = await prisma.$transaction([
      prisma.claim.create({
        data: {
          userId,
          airdropCampaignId,
          status: 'pending',
        },
      }),
      prisma.eligibility.update({
        where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
        data: { isEligible },
      }),
    ]);
    return transaction;
  } catch (error) {
    console.error('Error in transaction:', error);
    throw new Error('Unable to process transaction');
  }
}
