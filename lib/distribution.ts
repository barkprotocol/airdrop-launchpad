import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { BARK_TOKEN_MINT, RPC_ENDPOINT, AIRDROP_TOTAL_SUPPLY, MIN_CLAIM_AMOUNT, MAX_CLAIM_AMOUNT } from './constants';
import { User, Claim, ApiResponse, EligibilityCheckResponse } from './types';

// Solana connection
const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Function to distribute tokens to eligible users
export async function distributeTokens(eligibleUsers: User[], claims: Claim[]): Promise<ApiResponse<Claim[]>> {
  try {
    // Prepare transaction instructions for each claim
    const transactionInstructions: TransactionInstruction[] = [];

    for (const claim of claims) {
      const { walletAddress, amountClaimed } = claim;

      if (amountClaimed < MIN_CLAIM_AMOUNT || amountClaimed > MAX_CLAIM_AMOUNT) {
        return {
          success: false,
          message: `Claim amount for wallet ${walletAddress} is out of bounds.`,
          data: [],
        };
      }

      // Create the token transfer instruction for the claim
      const walletPublicKey = new PublicKey(walletAddress);
      const tokenMint = BARK_TOKEN_MINT;
      const userTokenAccount = await Token.getAssociatedTokenAddress(
        TOKEN_PROGRAM_ID,
        tokenMint,
        walletPublicKey
      );

      const transferInstruction = Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        userTokenAccount,
        walletPublicKey,
        walletPublicKey,
        [],
        amountClaimed
      );

      transactionInstructions.push(transferInstruction);
    }

    // Create a transaction to send all transfers in one batch
    const transaction = new Transaction().add(...transactionInstructions);

    // Send the transaction to the network
    const { signature } = await connection.sendTransaction(transaction, [], { skipPreflight: false, preflightCommitment: 'confirmed' });

    // Confirm the transaction
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    if (confirmation.value.err) {
      throw new Error('Transaction failed');
    }

    return {
      success: true,
      message: 'Tokens successfully distributed.',
      data: claims,
    };
  } catch (error) {
    console.error('Error distributing tokens:', error);
    return {
      success: false,
      message: 'Failed to distribute tokens. Please try again later.',
      data: [],
    };
  }
}

// Function to check eligibility of a user
export async function checkEligibility(walletAddress: string): Promise<EligibilityCheckResponse> {
  try {
    // Logic to check eligibility (could be based on balance or other criteria)
    const isEligible = await isBarkTokenHolder(walletAddress);  // A function that checks if the wallet holds BARK tokens
    return {
      walletAddress,
      isEligible,
    };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return {
      walletAddress,
      isEligible: false,
      reason: 'Error checking eligibility',
    };
  }
}

// Function to fetch and filter eligible users for the airdrop
export async function getEligibleUsers(): Promise<User[]> {
  try {
    // Fetch all users (this is a placeholder, replace with your actual data source)
    const users: User[] = await fetchAllUsers();

    // Filter users who meet eligibility criteria
    const eligibleUsers = users.filter(user => user.wallet.isEligible);

    return eligibleUsers;
  } catch (error) {
    console.error('Error fetching eligible users:', error);
    return [];
  }
}

// Helper function to fetch all users (replace with actual data fetching logic)
async function fetchAllUsers(): Promise<User[]> {
  // Simulating fetching users from an external source
  return [
    { id: 'user1', username: 'user1', email: 'user1@example.com', wallet: { walletAddress: 'address1', balance: 100, isEligible: true }, createdAt: new Date(), updatedAt: new Date() },
    { id: 'user2', username: 'user2', email: 'user2@example.com', wallet: { walletAddress: 'address2', balance: 0, isEligible: false }, createdAt: new Date(), updatedAt: new Date() },
    // Add more users as necessary
  ];
}

// Helper function to check if a wallet holds the BARK token
async function isBarkTokenHolder(walletAddress: string): Promise<boolean> {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    for (const account of tokenAccounts.value) {
      const tokenMint = account.account.data.parsed.info.mint;
      const tokenAmount = account.account.data.parsed.info.tokenAmount;

      if (tokenMint === BARK_TOKEN_MINT.toBase58() && parseInt(tokenAmount.amount) > 0) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking BARK token balance:', error);
    return false;
  }
}
