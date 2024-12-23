import { Request, Response } from 'express';
import { getUserByWalletAddress, getEligibilityByUserId, createClaim, updateEligibilityAfterClaim } from '@/lib/database/airdrop';
import { Claim, Eligibility } from '@prisma/client';
import { validationResult } from 'express-validator';
import { prisma } from '@/lib/prisma-client';

// Controller function for processing an airdrop claim
export const processClaim = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Fetch the user by wallet address
    const user = await getUserByWalletAddress(walletAddress);

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has eligibility
    const eligibility = await getEligibilityByUserId(user.id);

    // If the user doesn't have eligibility or if unclaimed amount is zero
    if (!eligibility || eligibility.unclaimedAmount <= 0) {
      return res.status(400).json({ error: 'No unclaimed airdrops available' });
    }

    // Process the claim by creating a new claim entry
    const claimAmount = eligibility.unclaimedAmount;
    const claim = await createClaim(user.id, claimAmount);

    // Update the user's eligibility after the claim
    await updateEligibilityAfterClaim(user.id);

    // Return success message with claim data
    res.status(200).json({
      message: 'Claim processed successfully!',
      claim,
    });
  } catch (error) {
    console.error('Error processing claim:', error);
    res.status(500).json({ error: 'Unable to process the claim' });
  }
};

// Controller function for retrieving the status of a specific claim
export const getClaimStatus = async (req: Request, res: Response) => {
  const { claimId } = req.params;

  try {
    // Fetch the claim by its ID
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: { user: true }, // Optionally include related user data
    });

    // If claim doesn't exist, return an error
    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    // Return the claim data
    res.status(200).json(claim);
  } catch (error) {
    console.error('Error fetching claim status:', error);
    res.status(500).json({ error: 'Unable to fetch claim status' });
  }
};
