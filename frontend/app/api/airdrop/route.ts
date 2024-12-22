import { NextApiRequest, NextApiResponse } from 'next';
import { getEligibleUsers, getPendingClaims, updateClaimStatus, getAirdropStats } from '@/lib/queries/airdrop-queries';

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get eligible users for airdrop
      if (req.query.action === 'eligible-users') {
        const eligibleUsers = await getEligibleUsers();
        return res.status(200).json(eligibleUsers);
      }
      
      // Get pending claims for a specific airdrop
      if (req.query.action === 'pending-claims' && req.query.airdropId) {
        const pendingClaims = await getPendingClaims(Number(req.query.airdropId));
        return res.status(200).json(pendingClaims);
      }
      
      // Get airdrop statistics
      if (req.query.action === 'airdrop-stats') {
        const stats = await getAirdropStats();
        return res.status(200).json(stats);
      }
    }
    
    if (req.method === 'POST') {
      // Update claim status
      if (req.body.action === 'update-claim-status' && req.body.claimId && req.body.newStatus) {
        await updateClaimStatus(Number(req.body.claimId), req.body.newStatus);
        return res.status(200).json({ message: 'Claim status updated successfully.' });
      }
    }

    res.status(400).json({ message: 'Invalid request.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;
