import { Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { logError, logInfo } from '@/utils/logger';
import { prisma } from '@/prisma/client';

// Helper function to send tokens to a user
async function sendTokens(
  connection: Connection,
  fromWallet: Keypair,
  toPublicKey: string,
  amount: bigint,
  tokenMintAddress: string
): Promise<string> {
  try {
    // Get the token account for the sender and receiver
    const senderTokenAccount = await Token.getAssociatedTokenAddress(
      TOKEN_PROGRAM_ID,
      tokenMintAddress,
      fromWallet.publicKey
    );

    const receiverTokenAccount = await Token.getAssociatedTokenAddress(
      TOKEN_PROGRAM_ID,
      tokenMintAddress,
      toPublicKey
    );

    const token = new Token(connection, tokenMintAddress, TOKEN_PROGRAM_ID, fromWallet);

    // Prepare the transaction to transfer tokens
    const transaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        senderTokenAccount,
        receiverTokenAccount,
        fromWallet.publicKey,
        [],
        amount
      )
    );

    // Send and confirm the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromWallet]);
    return signature;
  } catch (error) {
    logError('Error sending tokens', error);
    throw new Error('Token transfer failed');
  }
}

// Main function to distribute tokens to users
export async function distributeTokens(
  connection: Connection,
  fromWallet: Keypair,
  tokenMintAddress: string,
  users: { userId: string; publicKey: string; amount: bigint }[]
): Promise<void> {
  try {
    for (const user of users) {
      // Check if the user is eligible for the airdrop (this can be customized)
      const userEligibility = await prisma.user.findUnique({
        where: { id: user.userId },
      });

      if (!userEligibility || !userEligibility.isEligibleForAirdrop) {
        logInfo(`User ${user.userId} is not eligible for the airdrop`);
        continue;
      }

      // Send the tokens to the user
      const signature = await sendTokens(connection, fromWallet, user.publicKey, user.amount, tokenMintAddress);

      // Log success and update the database with the transaction signature
      logInfo(`Successfully sent tokens to ${user.userId} - Signature: ${signature}`);

      await prisma.airdropTransaction.create({
        data: {
          userId: user.userId,
          amount: user.amount.toString(),
          tokenMintAddress,
          transactionSignature: signature,
        },
      });
    }
  } catch (error) {
    logError('Error distributing tokens', error);
    throw new Error('Airdrop distribution failed');
  }
}
