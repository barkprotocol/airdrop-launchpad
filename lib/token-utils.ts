import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const BARK_TOKEN_MINT = new PublicKey('2NTvEssJ2i998V2cMGT4Fy3JhyFnAzHFonDo9dbAkVrg');
const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string, 'confirmed');

export async function isBarkTokenHolder(walletAddress: string): Promise<boolean> {
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