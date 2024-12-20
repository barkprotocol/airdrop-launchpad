import { NextResponse } from "next/server";
import { distributeAirdrop } from "@/lib/distribution";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, amount, category, description } = body;

    if (!walletAddress || !amount || !category) {
      return NextResponse.json(
        { error: "Wallet address, amount, and category are required" },
        { status: 400 }
      );
    }

    const result = await distributeAirdrop(walletAddress, BigInt(amount), category, description);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error distributing airdrop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}