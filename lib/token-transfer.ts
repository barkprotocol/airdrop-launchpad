import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, Keypair } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'

const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string, 'confirmed')
const BARK_TOKEN_MINT = new PublicKey(process.env.NEXT_PUBLIC_BARK_TOKEN_MINT as string)

export async function transferBArkTokens(
  fromWallet: string,
  toWallet: string,
  amount: bigint
): Promise<{ success: boolean; message: string; txSignature?: string }> {
  try {
    const fromPubkey = new PublicKey(fromWallet)
    const toPubkey = new PublicKey(toWallet)

    // Create a new keypair for the transaction
    const payer = Keypair.generate()

    // Get the associated token accounts for sender and receiver
    const fromTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      BARK_TOKEN_MINT,
      fromPubkey
    )
    const toTokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      BARK_TOKEN_MINT,
      toPubkey
    )

    // Check if the receiver's token account exists
    const receiverAccount = await connection.getAccountInfo(toTokenAccount)

    const transaction = new Transaction()

    if (receiverAccount === null) {
      // If the receiver's token account doesn't exist, create it
      transaction.add(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          BARK_TOKEN_MINT,
          toTokenAccount,
          toPubkey,
          payer.publicKey
        )
      )
    }

    // Add transfer instruction to transaction
    transaction.add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount,
        toTokenAccount,
        fromPubkey,
        [],
        Number(amount)
      )
    )

    // Sign and send the transaction
    const txSignature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer] // Use the generated keypair as the signer
    )

    return { success: true, message: 'Token transfer successful', txSignature }
  } catch (error) {
    console.error('Error transferring tokens:', error)
    return { success: false, message: 'Error transferring tokens' }
  }
}

