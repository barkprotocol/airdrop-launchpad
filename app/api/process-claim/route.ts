import { NextResponse } from "next/server";
import { PublicKey, Transaction, SystemProgram, Connection } from "@solana/web3.js";
import * as bs58 from "bs58";

const LAMPORTS_PER_SOL = 1_000_000_000;
const CLAIM_FEE = 0.2 * LAMPORTS_PER_SOL;
const COMMUNITY_FEE_PERCENTAGE = 0.001;

const ELIGIBLE_PUBLIC_KEY = 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo';
const ADMIN_PUBLIC_KEY = process.env.ADMIN_PUBLIC_KEY;
const CLAIM_WALLET = process.env.NEXT_PUBLIC_CLAIM_WALLET;
const OPERATIONAL_FEE_WALLET = process.env.NEXT_PUBLIC_OPERATIONAL_FEE_WALLET;
const COMMUNITY_FEE_WALLET = process.env.NEXT_PUBLIC_COMMUNITY_FEE_WALLET;
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

if (!ADMIN_PUBLIC_KEY || !CLAIM_WALLET || !OPERATIONAL_FEE_WALLET || !COMMUNITY_FEE_WALLET || !RPC_ENDPOINT) {
  throw new Error("Missing required environment variables");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 });
    }

    let publicKey;
    try {
      publicKey = new PublicKey(address);
    } catch (err) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
    }

    // Check if the address is eligible for the claim (admin or eligible public key)
    const isAdmin = publicKey.toBase58() === ADMIN_PUBLIC_KEY;
    const isEligible = publicKey.toBase58() === ELIGIBLE_PUBLIC_KEY;

    if (!isEligible && !isAdmin) {
      return NextResponse.json({ error: "Not eligible for claim" }, { status: 403 });
    }

    const claimAmount = 1000 * LAMPORTS_PER_SOL; // 1000 BARK tokens
    const operationalFeeAmount = CLAIM_FEE;
    const communityFeeAmount = Math.floor(claimAmount * COMMUNITY_FEE_PERCENTAGE);

    const connection = new Connection(RPC_ENDPOINT);

    // Check if the account has enough balance to cover the claim and fees
    const accountInfo = await connection.getAccountInfo(publicKey);
    if (!accountInfo || accountInfo.lamports < claimAmount + operationalFeeAmount + communityFeeAmount) {
      return NextResponse.json({ error: "Insufficient funds for claim and fees" }, { status: 400 });
    }

    const transaction = new Transaction();

    // Add transfer instructions for claim, operational fee, and community fee
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(CLAIM_WALLET),
        lamports: claimAmount,
      }),
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(OPERATIONAL_FEE_WALLET),
        lamports: operationalFeeAmount,
      }),
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(COMMUNITY_FEE_WALLET),
        lamports: communityFeeAmount,
      })
    );

    // Fetch the latest blockhash for the transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    // Serialize the transaction for signing
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });
    const base64Transaction = serializedTransaction.toString("base64");

    // Return the base64-encoded transaction and details
    return NextResponse.json({
      transaction: base64Transaction,
      amount: claimAmount,
      operationalFee: operationalFeeAmount,
      communityFee: communityFeeAmount,
    });
  } catch (error) {
    console.error("Error processing claim:", error);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
