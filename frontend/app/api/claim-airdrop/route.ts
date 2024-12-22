import { processAirdropClaim } from '@/components/services/airdrop';

export default async function handler(req, res) {
  const { userId, airdropCampaignId } = req.body; // Get userId and airdropCampaignId from request

  if (!userId || !airdropCampaignId) {
    return res.status(400).json({ error: 'Missing userId or airdropCampaignId' });
  }

  try {
    const result = await processAirdropClaim(userId, airdropCampaignId);
    return res.status(200).json({
      success: true,
      message: 'Airdrop claim processed successfully!',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Something went wrong processing the airdrop',
    });
  }
}
