import { Request, Response } from 'express';
import { getUserEligibility, updateUserEligibility } from '../services/user';
import { Eligibility } from '@prisma/client';

// Controller to get user eligibility by wallet address
export async function getEligibilityByWalletAddress(req: Request, res: Response): Promise<Response> {
  const { walletAddress } = req.params;

  try {
    const eligibility = await getUserEligibility(walletAddress);

    if (!eligibility) {
      return res.status(404).json({ error: 'Eligibility not found for this wallet address' });
    }

    return res.status(200).json(eligibility);
  } catch (error) {
    console.error('Error fetching eligibility:', error);
    return res.status(500).json({ error: 'Unable to fetch eligibility' });
  }
}

// Controller to update user eligibility (e.g., totalAmount, unclaimedAmount)
export async function updateEligibility(req: Request, res: Response): Promise<Response> {
  const { userId } = req.params;
  const { totalAmount, unclaimedAmount } = req.body;

  if (typeof totalAmount !== 'bigint' || typeof unclaimedAmount !== 'bigint') {
    return res.status(400).json({ error: 'Total amount and unclaimed amount must be valid BigInt' });
  }

  try {
    const updatedEligibility = await updateUserEligibility(userId, totalAmount, unclaimedAmount);

    return res.status(200).json(updatedEligibility);
  } catch (error) {
    console.error('Error updating eligibility:', error);
    return res.status(500).json({ error: 'Unable to update eligibility' });
  }
}

// Controller to handle adding new eligibility (for a new user)
export async function createEligibility(req: Request, res: Response): Promise<Response> {
  const { userId, totalAmount, unclaimedAmount } = req.body;

  if (typeof totalAmount !== 'bigint' || typeof unclaimedAmount !== 'bigint') {
    return res.status(400).json({ error: 'Total amount and unclaimed amount must be valid BigInt' });
  }

  try {
    const eligibility = await updateUserEligibility(userId, totalAmount, unclaimedAmount);

    return res.status(201).json(eligibility);
  } catch (error) {
    console.error('Error creating eligibility:', error);
    return res.status(500).json({ error: 'Unable to create eligibility' });
  }
}

// Controller to delete user eligibility data
export async function deleteEligibility(req: Request, res: Response): Promise<Response> {
  const { userId } = req.params;

  try {
    // Find the eligibility record to delete (this should be handled by a service method in your system)
    const eligibility = await prisma.eligibility.delete({
      where: { userId },
    });

    return res.status(200).json({ message: 'Eligibility data deleted successfully', eligibility });
  } catch (error) {
    console.error('Error deleting eligibility:', error);
    return res.status(500).json({ error: 'Unable to delete eligibility' });
  }
}
