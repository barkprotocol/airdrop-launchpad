export interface APIEndpoint {
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    description: string;
    parameters: {
      name: string;
      type: string;
      description: string;
    }[];
    responseExample: string;
  }
  
  export const endpoints: APIEndpoint[] = [
    {
      name: 'Check Eligibility',
      method: 'POST',
      path: '/api/eligibility',
      description: 'Check if a wallet address is eligible for the BARK token airdrop.',
      parameters: [
        { name: 'address', type: 'string', description: 'Solana wallet address to check for eligibility' }
      ],
      responseExample: `
  {
    "isEligible": true,
    "totalAmount": "1000000000",
    "unclaimedAmount": "1000000000"
  }
      `,
    },
    {
      name: 'Claim Tokens',
      method: 'POST',
      path: '/api/claim',
      description: 'Claim BARK tokens for an eligible wallet address.',
      parameters: [
        { name: 'walletAddress', type: 'string', description: 'Solana wallet address claiming the tokens' },
        { name: 'signature', type: 'string', description: 'Signed message to verify the claim request' }
      ],
      responseExample: `
  {
    "success": true,
    "message": "BARK tokens claimed successfully",
    "txSignature": "5UYkT4UsFv8P8vVs9e4xLUM9cNyLEHdGBYRYjakMB5xY3NWRs3xFkEJna3gVp1pVAS1zwqFZgq1MuNWfPp2KeQae"
  }
      `,
    },
    {
      name: 'Get Airdrop Statistics',
      method: 'GET',
      path: '/api/stats',
      description: 'Retrieve current statistics about the BARK token airdrop.',
      parameters: [],
      responseExample: `
  {
    "totalDistributed": "10000000000",
    "totalClaimed": "5000000000",
    "remainingToClaim": "5000000000",
    "totalParticipants": 1000
  }
      `,
    },
    {
      name: 'Subscribe to Newsletter',
      method: 'POST',
      path: '/api/subscribe',
      description: 'Subscribe an email address to the BARK token newsletter.',
      parameters: [
        { name: 'email', type: 'string', description: 'Email address to subscribe' }
      ],
      responseExample: `
  {
    "message": "Subscription successful",
    "data": {
      "id": "clh2x3z0b0000qwer1234asdf",
      "email": "user@example.com",
      "createdAt": "2024-12-20T12:34:56.789Z"
    }
  }
      `,
    },
  ];
  
  