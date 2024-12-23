# BARK | Airdrop Launchpad

## Overview

BARK Protocol´s Airdrop Launchpad is a decentralized application (dApp) built on the Solana blockchain that enables users to verify their eligibility and claim BARK tokens. This project leverages cutting-edge technologies like Next.js, TypeScript, and React while seamlessly integrating with Solana wallets to ensure an intuitive and secure user experience.

[WebUI/UX](/github/assets/frontend.png)

- **Frontend**: 
  - **Next.js**: For server-side rendering and static site generation.
  - **React**: A component-based library for creating dynamic user interfaces.
  - **Shadcn/UI**: A collection of prebuilt UI components for faster development.
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI design.
  - **Solana Wallet Adapter**: For integrating popular Solana wallets like Phantom, Backpack, and Solflare.
  
- **Backend**:
  - **Admin Dashboard**: 
  - **Solana Blockchain**: For decentralized token transfers, eligibility checks, and interaction with the BARK ecosystem.
  - **Prisma ORM**: For seamless database interaction and data management.
  - **Helius API**: For interacting with the Solana blockchain to gather transaction data and process eligibility.

- **Deployment**:
  - **Vercel**: Used for deploying the dApp with automatic CI/CD workflows for efficient updates and scaling.

## Features

- **Wallet Connection**: Integrates with popular Solana wallets such as Phantom, Backpack, and Solflare.
- **Eligibility Check**: Verifies eligibility for BARK token airdrops directly within the dApp.
- **Token Claim**: Allows users to claim BARK tokens with a single click.
- **Fee Calculation**: Automatically calculates and displays operational and community fees.
- **Multiple Transfers**: The claim process includes separate transfers for the main claim, operational fee, and community fee.
- **Responsive Design**: Optimized for both mobile and desktop devices for a seamless experience.
- **Blockchain Integration**: Direct interaction with the Solana blockchain for transparent and secure operations.
- **Shadcn/UI**: Provides reusable components for enhanced UI/UX.
- **Secure Transactions**: Implements robust security measures for handling sensitive operations.
- **Prisma Integration**: Utilizes Prisma ORM for smooth and efficient database interactions.
- **API**: Well-documented API endpoints for developers.
- **Documentation**: Comprehensive [technical documentation](/document) available for better understanding and integration.

## How it Works

The eligibility check combines multiple sources:

- Being a BARK token holder
- The `api/eligibility/route.ts` file by using the centralized `checkEligibility` function.
- Presence in the hardcoded `ELIGIBLE_ADDRESSES` array
- Presence in the CSV whitelist
- Having unclaimed BARK tokens in the database

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 20.0.0 or later.
- **pnpm**: Version 9.15.0 or later.
- **Solana.web3.js**: For blockchain interactions.
- **Prisma**: Installed and configured for database management.
- **Solana Wallet**: A supported wallet (e.g., Phantom, Backpack, Solflare).
- **Shadcn/UI**: Framework for reusable components

## Installation

To install the BARK Claim Dapp, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bark-protocol/airdrop-lauchpad.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd airdrop-lauchpad
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

## API

- **Endpoints**: The application has several endpoints: /api/eligibility, /api/claim, and /api/status, etc..

## Future Enhancements

- **Enhanced Analytics**: Provide users with real-time insights and metrics.
- **Implement Token Sale**: Build, create an Initial Wallet Offering (IWO), token sale campaign, and distribution.
- **Advanced Security Features**: Implement additional layers of security for transactions.
- **Gamified Airdrops**: Introduce a gamified experience for claiming tokens.
- **Marketplace Integration**: Enable users to trade or stake claimed tokens.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request with your improvements.
