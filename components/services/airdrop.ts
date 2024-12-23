// /components/services/airdrop.ts

import prisma from '../../app/database/db'; // Prisma Client instance
import { createUserWithRole } from '../../lib/user'; // Example of another service
import { getUserById, userExistsByEmail } from '../../lib/user'; // Import user-related services
import { mintNFT } from '../../lib/nft'; // Example for minting NFTs or similar actions
import { SolanaTransactionError } from '../../lib/errors';

// Function to create an airdrop campaign
export async function createAirdropCampaign(data: { title: string; description: string; token: string }) {
  const { title, description, token } = data;

  try {
    // Using Prisma transaction to ensure atomic operations
    const result = await prisma.$transaction(async (prisma) => {
      const campaign = await prisma.airdropCampaign.create({
        data: {
          title,
          description,
          token,
        },
      });

      return campaign; // Return created campaign
    });

    return result; // Return campaign result after transaction
  } catch (error) {
    console.error('Error creating airdrop campaign:', error);
    throw new Error('Unable to create airdrop campaign');
  }
}

// Function to process a user claiming an airdrop (with eligibility check)
export async function processAirdropClaim(userId: string, airdropCampaignId: string) {
  try {
    // Check if the user is eligible for the airdrop
    const isEligible = await checkAirdropEligibility(userId, airdropCampaignId);
    if (!isEligible) {
      throw new Error('User is not eligible for the airdrop');
    }

    // Process the claim inside a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update the eligibility status of the user
      await prisma.eligibility.update({
        where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
        data: { isEligible: true },
      });

      // Mint NFT or perform other actions (such as token transfer)
      const user = await getUserById(userId);
      const nftMintResult = await mintNFT(user, airdropCampaignId); // Mint NFT or transfer token logic

      // Log the claim transaction or insert a record if necessary
      await prisma.claimTransaction.create({
        data: {
          userId,
          airdropCampaignId,
          nftMintResult: nftMintResult.transactionHash, // Example for NFT minting
        },
      });

      return { user, nftMintResult }; // Return the user and mint result
    });

    return result;
  } catch (error) {
    console.error('Error processing airdrop claim:', error);
    throw new Error('Unable to process airdrop claim');
  }
}

// Function to check if a user is eligible for an airdrop campaign
export async function checkAirdropEligibility(userId: string, airdropCampaignId: string) {
  try {
    const eligibility = await prisma.eligibility.findUnique({
      where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
    });

    if (!eligibility) {
      return false;
    }

    return eligibility.isEligible; // Return eligibility status
  } catch (error) {
    console.error('Error checking airdrop eligibility:', error);
    throw new Error('Unable to check airdrop eligibility');
  }
}

// Function to update the eligibility status of a user for a specific airdrop campaign
export async function updateAirdropEligibility(userId: string, airdropCampaignId: string, status: boolean) {
  try {
    const updatedEligibility = await prisma.eligibility.upsert({
      where: { userId_airdropCampaignId: { userId, airdropCampaignId } },
      update: { isEligible: status },
      create: {
        userId,
        airdropCampaignId,
        isEligible: status,
      },
    });

    return updatedEligibility; // Return updated eligibility status
  } catch (error) {
    console.error('Error updating eligibility status:', error);
    throw new Error('Unable to update eligibility status');
  }
}

// Function to retrieve the list of all active airdrop campaigns
export async function getAllActiveAirdrops() {
  try {
    const campaigns = await prisma.airdropCampaign.findMany({
      where: { active: true },
    });

    return campaigns; // Return active campaigns
  } catch (error) {
    console.error('Error fetching active airdrop campaigns:', error);
    throw new Error('Unable to fetch active airdrop campaigns');
  }
}
