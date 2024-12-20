import { NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const ELIGIBLE_ADDRESSES = [
  'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo',
  // Add more eligible addresses here
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address || !isValidSolanaAddress(address)) {
      return NextResponse.json({ error: "Invalid Solana address" }, { status: 400 });
    }

    // Check if the address is in the ELIGIBLE_ADDRESSES array
    const isEligibleByList = ELIGIBLE_ADDRESSES.includes(address);

    // Check if the user exists and is eligible in the database
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: { eligibility: true },
    });

    const isEligibleByDatabase = user?.eligibility && user.eligibility.unclaimedAmount > BigInt(0);

    // Combine both eligibility checks
    const isEligible = isEligibleByList || isEligibleByDatabase;

    if (isEligible && user?.eligibility) {
      return NextResponse.json({
        isEligible: true,
        totalAmount: user.eligibility.totalAmount.toString(),
        unclaimedAmount: user.eligibility.unclaimedAmount.toString(),
      });
    } else {
      return NextResponse.json({ isEligible: false });
    }
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

