import { NextResponse } from "next/server";
import { claim } from "@/lib/claim";
import { isValidSolanaAddress } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, signature } = body;

    if (!walletAddress || !signature) {
      return NextResponse.json(
        { error: "Wallet address and signature are required" },
        { status: 400 }
      );
    }

    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    const result = await claim(walletAddress, signature);

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        txSignature: result.txSignature
      }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing claim:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

