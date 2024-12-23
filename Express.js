import express from 'express';
import { getUserByWalletAddress, createClaim, updateAirdropStatus, createClaimAndUpdateEligibility } from '@/lib/db';
import { body, validationResult } from 'express-validator';

const app = express();
app.use(express.json());

// Validation middleware
const validateWalletAddress = [
  body('walletAddress').isString().withMessage('Wallet address must be a string').matches(/^([1-9A-HJ-NP-Za-km-z]{32,44})$/).withMessage('Invalid Solana wallet address'),
];
const validateAirdropCampaignId = body('airdropCampaignId').isString().withMessage('Airdrop campaign ID must be a string');

app.post('/claim', validateWalletAddress, validateAirdropCampaignId, async (req, res) => {
  const { walletAddress, airdropCampaignId } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Step 1: Fetch user by wallet address
    const user = await getUserByWalletAddress(walletAddress);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Step 2: Create claim for the user and update eligibility in a transaction
    const [claim, eligibility] = await createClaimAndUpdateEligibility(user.id, airdropCampaignId, true);

    // Step 3: Update the status of the airdrop campaign
    await updateAirdropStatus(airdropCampaignId, 'in-progress');

    return res.status(201).json({
      message: 'Claim created successfully',
      claim,
      eligibility,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
