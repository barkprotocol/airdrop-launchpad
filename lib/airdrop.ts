import { prisma } from './prisma';
import axios from 'axios';

// Fetch eligible users for a specific airdrop
export async function getEligibleUsers(airdropId: number) {
  try {
    const eligibleUsers = await prisma.user.findMany({
      where: {
        eligibility: {
          some: {
            airdropId,
            isEligible: true,
          },
        },
      },
      include: {
        wallet: true, // Include wallet info for each eligible user
      },
    });

    return eligibleUsers.map(user => ({
      userId: user.id,
      walletId: user.wallet.id,
    }));
  } catch (error) {
    console.error('Error fetching eligible users:', error);
    throw new Error('Unable to fetch eligible users');
  }
}

// Fetch pending claims for a specific airdrop
export async function getPendingClaims(airdropId: number) {
  try {
    const pendingClaims = await prisma.claim.findMany({
      where: {
        airdropId,
        status: 'PENDING',
      },
      include: {
        user: {
          include: {
            wallet: true,
          },
        },
      },
    });

    return pendingClaims.map(claim => ({
      claimId: claim.id,
      userId: claim.userId,
      walletId: claim.user.wallet.id,
      createdAt: claim.createdAt,
    }));
  } catch (error) {
    console.error('Error fetching pending claims:', error);
    throw new Error('Unable to fetch pending claims');
  }
}

// Update the claim status
export async function updateClaimStatus(claimId: number, newStatus: 'PENDING' | 'CLAIMED' | 'FAILED') {
  try {
    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: { status: newStatus },
    });

    return updatedClaim;
  } catch (error) {
    console.error('Error updating claim status:', error);
    throw new Error('Unable to update claim status');
  }
}

// Get statistics for a specific airdrop
export async function getAirdropStats(airdropId: number) {
  try {
    const claims = await prisma.claim.findMany({
      where: { airdropId },
    });

    const totalClaims = claims.length;
    const successfulClaims = claims.filter(claim => claim.status === 'CLAIMED').length;
    const failedClaims = claims.filter(claim => claim.status === 'FAILED').length;
    const pendingClaims = claims.filter(claim => claim.status === 'PENDING').length;

    return {
      airdropId,
      totalClaims,
      successfulClaims,
      failedClaims,
      pendingClaims,
    };
  } catch (error) {
    console.error('Error fetching airdrop statistics:', error);
    throw new Error('Unable to fetch airdrop statistics');
  }
}

// Fetch all airdrops
export async function getAllAirdrops() {
  try {
    const airdrops = await prisma.airdrop.findMany({
      include: {
        claims: true, // Include claims to calculate stats
      },
    });

    return airdrops.map(airdrop => ({
      airdropId: airdrop.id,
      name: airdrop.name,
      totalClaims: airdrop.claims.length,
    }));
  } catch (error) {
    console.error('Error fetching all airdrops:', error);
    throw new Error('Unable to fetch airdrop data');
  }
}

// Example of calling an external service for additional functionality (e.g., notifying the user)
export async function notifyUserAboutClaim(userId: number, claimStatus: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    // Example of notifying the user (could be an email, push notification, etc.)
    await axios.post('https://notification.barkprotocol.net/send', {
      userId: user.id,
      message: `Your claim status has been updated to: ${claimStatus}`,
    });

    return { success: true };
  } catch (error) {
    console.error('Error notifying user:', error);
    throw new Error('Unable to notify user');
  }
}
