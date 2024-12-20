import { NextResponse } from "next/server";
import { PublicKey, Transaction, SystemProgram, Connection } from "@solana/web3.js";
import * as bs58 from "bs58";

const LAMPORTS_PER_SOL = 1000000000;
const CLAIM_FEE = 0.2 * LAMPORTS_PER_SOL;
const COMMUNITY_FEE_PERCENTAGE = 0.001;
const ELIGIBLE_PUBLIC_KEY = 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo';
const ADMIN_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY as string;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    const publicKey = new PublicKey(address);
    const isAdmin = publicKey.toBase58() === ADMIN_PUBLIC_KEY;
    const isEligible = publicKey.toBase58() === ELIGIBLE_PUBLIC_KEY;

    if (!isEligible && !isAdmin) {
      return NextResponse.json({ error: "Not eligible for claim" }, { status: 403 });
    }

    const claimAmount = 1000 * LAMPORTS_PER_SOL; // 1000 BARK tokens
    const operationalFeeAmount = CLAIM_FEE;
    const communityFeeAmount = Math.floor(claimAmount * COMMUNITY_FEE_PERCENTAGE);

    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT as string);
    const transaction = new Transaction();

    // Add transfer instructions
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(process.env.NEXT_PUBLIC_CLAIM_WALLET as string),
        lamports: claimAmount,
      }),
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(process.env.NEXT_PUBLIC_OPERATIONAL_FEE_WALLET as string),
        lamports: operationalFeeAmount,
      }),
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(process.env.NEXT_PUBLIC_COMMUNITY_FEE_WALLET as string),
        lamports: communityFeeAmount,
      })
    );

    // Get the recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Serialize the transaction
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
    const base64Transaction = serializedTransaction.toString('base64');

    return NextResponse.json({
      transaction: base64Transaction,
      amount: claimAmount,
      operationalFee: operationalFeeAmount,
      communityFee: communityFeeAmount,
    });

  } catch (error) {
    console.error("Error processing claim:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

