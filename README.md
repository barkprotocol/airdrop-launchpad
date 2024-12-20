# BARK Claim Dapp

## Overview

BARK Claim Dapp is a decentralized application (dApp) built on the Solana blockchain that enables users to verify their eligibility and claim BARK tokens. This project leverages cutting-edge technologies like Next.js, TypeScript, and React while seamlessly integrating with Solana wallets to ensure an intuitive and secure user experience.

## Features

- **Wallet Connection**: Integrate with popular Solana wallets such as Phantom, Backpack, and Solflare.
- **Eligibility Check**: Verify eligibility for BARK token airdrops directly within the dApp.
- **Token Claim**: Claim BARK tokens with a single click.
- **Fee Calculation**: Automatically calculate and display operational and community fees.
- **Multiple Transfers**: The claim process includes separate transfers for the main claim, operational fee, and community fee.
- **Responsive Design**: Optimized for both mobile and desktop devices.
- **Blockchain Integration**: Direct interaction with the Solana blockchain for transparent and secure operations.
- **Shadcn/UI**: Prebuilt components for enhanced UI/UX.
- **Secure Transactions**: Handle sensitive operations with robust security measures.
- **Prisma Integration**: Utilize Prisma ORM for database interactions.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 15.0.0 or later
- **pnpm**: Version 9.15.0 or later
- **Solana.web3.js**: For blockchain interactions
- **Prisma**: Installed and configured for database management
- **Solana Wallet**: A supported wallet (e.g., Phantom, Backpack, Solflare)
- **Shadcn/UI**: Framework for reusable components

## Installation

To install the BARK Claim Dapp, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bark-protocol/bark-claim-dapp.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd bark-claim-dapp
   ```

3. **Install dependencies**:

   ```bash
   pnpm install
   ```

4. **Set up environment variables**:
   Create a `.env.local` file in the root directory and populate it with the required and optional environment variables. Example:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   NEXT_PUBLIC_MINT_API_URL=https://api.actions.barkprotocol.net/mint
   NEXT_PUBLIC_HELIUS_API_KEY=your-helius-api-key
   NEXT_PUBLIC_CLAIM_WALLET=your_claim_wallet_address_here
   NEXT_PUBLIC_OPERATIONAL_FEE_WALLET=your_operational_fee_wallet_address_here
   NEXT_PUBLIC_COMMUNITY_FEE_WALLET=your_community_fee_wallet_address_here
   NEXT_PUBLIC_TOKEN_PROGRAM_ID=TokenkegQfeZyiNwAJbNbGKPFXkQd5J8X8wnF8MPzYx
   NEXT_PUBLIC_NFT_PROGRAM_ID=
   NEXT_PUBLIC_METADATA_SERVICE_URL=https://api.example.com/upload-metadata
   SECRET_KEY=your-secret-key-here
   JWT_SECRET=your-jwt-secret-key-here
   NODE_ENV=development
   ```

5. **Run the development server**:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the dApp.

## Deployment

The BARK Claim Dapp is optimized for deployment on Vercel. To deploy:

1. Link your GitHub repository to your Vercel account.
2. Add the required environment variables in the Vercel project settings.
3. Deploy your application with a single click.

## Future Enhancements

- **Enhanced Analytics**: Provide users with real-time insights and metrics.
- **Multilingual Support**: Expand accessibility with support for multiple languages.
- **Advanced Security Features**: Implement additional layers of security for transactions.
- **Gamified Airdrops**: Introduce a gamified experience for claiming tokens.
- **Marketplace Integration**: Enable users to trade or stake claimed tokens.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request with your improvements.
