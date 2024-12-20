import { NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { checkEligibility } from "@/lib/claim";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address || !isValidSolanaAddress(address)) {
      return NextResponse.json({ error: "Invalid Solana address" }, { status: 400 });
    }

    const eligibilityResult = await checkEligibility(address);

    if (eligibilityResult.isEligible) {
      const user = await prisma.user.findUnique({
        where: { walletAddress: address },
        include: { eligibility: true },
      });

      if (user?.eligibility) {
        return NextResponse.json({
          isEligible: true,
          totalAmount: user.eligibility.totalAmount.toString(),
          unclaimedAmount: user.eligibility.unclaimedAmount.toString(),
        });
      }
    }

    return NextResponse.json({ 
      isEligible: false,
      reason: eligibilityResult.reason || "Unknown reason"
    });
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

