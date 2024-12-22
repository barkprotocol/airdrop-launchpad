import { PrismaClient } from '@prisma/client';
import { SolanaConnection, getTokenMintInfo, createTransaction } from '@solana/web3.js';
import { NextApiResponse } from 'next';

const prisma = new PrismaClient();

// Check eligibility for token sale
export const checkEligibilityForSale = async (walletAddress: string) => {
  // Check eligibility logic
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    return { eligible: false, message: 'User not found' };
  }

  if (user.tokensClaimed >= user.tokenLimit) {
    return { eligible: false, message: 'Token limit reached' };
  }

  return { eligible: true };
};

// Handle token purchase
export const buyTokens = async (req: any, res: NextApiResponse) => {
  const { walletAddress, amount } = req.body;

  // Step 1: Check if the user is eligible
  const eligibility = await checkEligibilityForSale(walletAddress);
  if (!eligibility.eligible) {
    return res.status(400).json({ message: eligibility.message });
  }

  // Step 2: Create a Solana transaction
  try {
    const connection = new SolanaConnection('https://api.devnet.solana.com');
    const { tokenMint } = await getTokenMintInfo(); // Retrieve mint info from your database or an API

    // Step 3: Create and send the transaction (implement token transfer logic)
    const transaction = await createTransaction(walletAddress, amount, tokenMint);

    // Step 4: Send the transaction
    await connection.sendTransaction(transaction);

    // Step 5: Update the user's claim status in the database
    await prisma.user.update({
      where: { walletAddress },
      data: { tokensClaimed: { increment: amount } },
    });

    return res.status(200).json({ message: 'Tokens purchased successfully' });
  } catch (error) {
    console.error('Token purchase error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch token sale status (open/closed)
export const getTokenSaleStatus = async (res: NextApiResponse) => {
  try {
    // Logic to check if the token sale is open/closed (can be stored in DB or environment variables)
    const isOpen = true; // Placeholder for actual logic

    return res.status(200).json({ status: isOpen ? 'open' : 'closed' });
  } catch (error) {
    console.error('Error fetching sale status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
