import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const BARK_TOKEN_MINT = new PublicKey('2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg');
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string, 'confirmed');

/**
 * Checks if a wallet address holds any BARK tokens.
 * @param walletAddress - The Solana wallet address to check.
 * @returns boolean - Returns true if the wallet holds BARK tokens, false otherwise.
 */
export async function isBarkTokenHolder(walletAddress: string): Promise<boolean> {
  try {
    const walletPublicKey = new PublicKey(walletAddress);
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
      programId: TOKEN_PROGRAM_ID,
    });

    // Check if any of the token accounts hold BARK tokens
    for (const account of tokenAccounts.value) {
      const tokenMint = account.account.data.parsed.info.mint;
      const tokenAmount = account.account.data.parsed.info.tokenAmount;

      if (tokenMint === BARK_TOKEN_MINT.toBase58()) {
        const amount = parseInt(tokenAmount.amount);

        // Ensure the amount is valid and greater than 0
        if (amount > 0) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    // Enhanced error logging
    if (error instanceof Error) {
      console.error(`Error checking BARK token balance for wallet ${walletAddress}: ${error.message}`);
    } else {
      console.error(`Unknown error while checking BARK token balance for wallet ${walletAddress}:`, error);
    }

    return false;
  }
}

/**
 * Example function to check and log whether a wallet holds BARK tokens.
 * @param walletAddress - The Solana wallet address to check.
 */
async function checkBarkTokenHolder(walletAddress: string) {
  const isHolder = await isBarkTokenHolder(walletAddress);
  if (isHolder) {
    console.log(`${walletAddress} holds BARK tokens.`);
  } else {
    console.log(`${walletAddress} does not hold BARK tokens.`);
  }
}
