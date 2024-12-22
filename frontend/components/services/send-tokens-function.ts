import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferCheckedInstruction, getAssociatedTokenAddress } from '@solana/spl-token';

// Define constants for connection and token program
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const BARK_TOKEN_DECIMALS = 9;  // Adjust this to the correct decimal places for your token
const connection = new Connection(SOLANA_RPC_URL);

/**
 * Sends tokens from a predefined source wallet to a target wallet.
 * @param destinationWallet - The wallet address of the recipient.
 * @param amount - The amount to send, adjusted for token decimals.
 * @returns Promise<{ success: boolean; txSignature?: string; message?: string }>
 */
export async function sendTokens(
  destinationWallet: string,
  amount: bigint
): Promise<{ success: boolean; txSignature?: string; message?: string }> {
  try {
    // Security Consideration: Ensure the sender's secret key is not exposed in the frontend.
    const senderSecretKey = process.env.SENDER_SECRET_KEY;
    if (!senderSecretKey) throw new Error('Sender secret key not set in environment variables.');

    // Convert the sender's secret key to a Keypair
    const senderKeypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(senderSecretKey)));
    const senderPublicKey = senderKeypair.publicKey;

    // Ensure token mint address is set in environment variables
    const tokenMintAddress = process.env.TOKEN_PROGRAM_ID;
    if (!tokenMintAddress) throw new Error('Token mint address not set in environment variables.');

    // Get associated token addresses for sender and recipient
    const senderTokenAddress = await getAssociatedTokenAddress(
      new PublicKey(tokenMintAddress),
      senderPublicKey
    );
    const recipientTokenAddress = await getAssociatedTokenAddress(
      new PublicKey(tokenMintAddress),
      new PublicKey(destinationWallet)
    );

    // Validate the amount (ensure it's greater than zero)
    if (amount <= 0) throw new Error('Amount must be greater than zero.');

    // Create the transfer instruction
    const transferInstruction: TransactionInstruction = createTransferCheckedInstruction(
      senderTokenAddress,
      new PublicKey(tokenMintAddress),
      recipientTokenAddress,
      senderPublicKey,
      Number(amount),  // Convert to number for the transfer instruction
      BARK_TOKEN_DECIMALS,  // Use the correct decimals for the token
      [],
      TOKEN_PROGRAM_ID
    );

    // Create and configure the transaction
    const transaction = new Transaction().add(transferInstruction);
    transaction.feePayer = senderPublicKey;
    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = latestBlockhash.blockhash;

    // Sign the transaction with the sender's keypair
    transaction.sign(senderKeypair);

    // Send the transaction
    const txSignature = await connection.sendRawTransaction(transaction.serialize());

    // **Transaction Confirmation**: Ensure the transaction has been processed.
    await connection.confirmTransaction(txSignature, 'processed');  // You can adjust the confirmation level: 'processed', 'confirmed', or 'finalized'

    // Return the success result with the transaction signature
    return { success: true, txSignature };
  } catch (error: any) {
    // Detailed error logging
    console.error(`Error transferring tokens to ${destinationWallet}: ${error.message}`);
    return { success: false, message: error.message };
  }
}
