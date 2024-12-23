import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByWalletAddress, getAirdropById, claimAirdropForUser, updateAirdropClaimStatus } from '@/utils/services/airdrop-service';
import { sendClaimNotification } from '@/utils/notification';
import { logger } from '@/utils/logger';

// Claim an airdrop for a user
export async function handleClaimAirdrop(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, airdropId } = req.body;
  
  // Validate request data
  if (!walletAddress || !airdropId) {
    return res.status(400).json({ error: 'Wallet address and airdrop ID are required' });
  }

  try {
    // Fetch user from wallet address
    const user = await getUserByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch airdrop data by airdropId
    const airdrop = await getAirdropById(airdropId);
    if (!airdrop) {
      return res.status(404).json({ error: 'Airdrop not found' });
    }

    // Check if the user is eligible for the airdrop (ensure the airdrop hasn't been claimed already)
    if (airdrop.claimed || !airdrop.isActive) {
      return res.status(400).json({ error: 'Airdrop has already been claimed or is not active' });
    }

    // Claim the airdrop for the user
    const claimResult = await claimAirdropForUser(user.id, airdropId);
    if (!claimResult) {
      return res.status(500).json({ error: 'Failed to claim airdrop' });
    }

    // Update the airdrop claim status in the database
    const updatedAirdrop = await updateAirdropClaimStatus(airdropId, true);

    // Optionally, send a notification about the successful claim
    await sendClaimNotification(user.walletAddress, airdrop.amount);

    // Respond with success
    return res.status(200).json({
      message: 'Airdrop claimed successfully',
      airdrop: updatedAirdrop,
      user: user,
    });
  } catch (error) {
    // Log any unexpected errors
    logger.error('Error claiming airdrop', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
