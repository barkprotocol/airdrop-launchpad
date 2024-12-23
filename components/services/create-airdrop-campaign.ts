import { createAirdropCampaign } from '@/components/services/airdrop';

async function addAirdropCampaign() {
  const campaignData = {
    title: 'Exclusive BARK Airdrop',
    description: 'Claim your exclusive BARK tokens!',
    token: 'BARK_TOKEN',
  };

  try {
    const campaign = await createAirdropCampaign(campaignData);
    console.log('Created Airdrop Campaign:', campaign);
  } catch (error) {
    console.error('Error creating airdrop campaign:', error);
  }
}

addAirdropCampaign();