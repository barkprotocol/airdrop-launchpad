import { Request, Response } from 'express';
import { getUserByWalletAddress, createAirdrop, getAirdropStatistics } from '@/lib/database/airdrop';
import { createEligibility } from '@/lib/database/airdrop';
import { User, Airdrop, Eligibility } from '@prisma/client';
import { validationResult } from 'express-validator';

// Controller function for creating a new airdrop
export const initiateAirdrop = async (req: Request, res: Response) => {
  const { walletAddress, amount, claimStatus, category, description } = req.body;

  // Validate the request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user already exists
    let user = await getUserByWalletAddress(walletAddress);

    // If user doesn't exist, create a new user
    if (!user) {
      user = await createUser(walletAddress);
    }

    // Check if eligibility exists for this user
    let eligibility = await prisma.eligibility.findUnique({
      where: { userId: user.id },
    });

    // If eligibility does not exist, create eligibility
    if (!eligibility) {
      eligibility = await createEligibility(user.id, 1000n, 1000n); // Example values
    }

    // Create the airdrop entry
    const airdrop = await createAirdrop(user.id, amount, claimStatus, category, description);

    res.status(201).json({
      message: 'Airdrop initiated successfully!',
      airdrop,
    });
  } catch (error) {
    console.error('Error initiating airdrop:', error);
    res.status(500).json({ error: 'Unable to initiate airdrop' });
  }
};

// Controller function to retrieve airdrop statistics
export const getAirdropStats = async (req: Request, res: Response) => {
  try {
    const stats = await getAirdropStatistics();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching airdrop statistics:', error);
    res.status(500).json({ error: 'Unable to fetch airdrop statistics' });
  }
};

// Controller function for processing an airdrop claim
export const claimAirdrop = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  try {
    // Fetch user by wallet address
    const user = await getUserByWalletAddress(walletAddress);

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has unclaimed eligibility
    const eligibility = await prisma.eligibility.findUnique({
      where: { userId: user.id },
    });

    if (!eligibility || eligibility.unclaimedAmount <= 0) {
      return res.status(400).json({ error: 'No unclaimed airdrops available' });
    }

    // Proceed to claim the airdrop
    const claimAmount = eligibility.unclaimedAmount;
    const claim = await prisma.claim.create({
      data: {
        userId: user.id,
        amount: claimAmount,
        status: 'claimed',
      },
    });

    // Update the user's eligibility after claim
    await prisma.eligibility.update({
      where: { userId: user.id },
      data: { unclaimedAmount: 0n },
    });

    res.status(200).json({
      message: 'Airdrop claimed successfully!',
      claim,
    });
  } catch (error) {
    console.error('Error processing airdrop claim:', error);
    res.status(500).json({ error: 'Unable to process airdrop claim' });
  }
};
