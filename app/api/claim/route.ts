import { NextResponse } from "next/server";
import type { ClaimItem } from "@/utils/types";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { address } = body;

    // Validate address
    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Optional: Validate Solana address format
    const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    if (!SOLANA_ADDRESS_REGEX.test(address)) {
      return NextResponse.json(
        { error: "Invalid Solana address format" },
        { status: 400 }
      );
    }

    // Fetch claim data from BARK Protocol
    const apiUrl = `https://api.barkprotocol.net/v0.1/airdrops/bark/claim/${address}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle non-successful responses
    if (!response.ok) {
      console.error(
        `Failed to fetch claim data. Status: ${response.status}, Text: ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch claim data" },
        { status: response.status }
      );
    }

    // Parse and validate claim data
    const claimData = (await response.json()) as ClaimItem[];
    if (!claimData || !Array.isArray(claimData)) {
      console.error("Invalid claim data received from the BARK Protocol server");
      return NextResponse.json(
        { error: "Invalid claim data received from the BARK Protocol server" },
        { status: 400 }
      );
    }

    // Return claim data if successful
    return NextResponse.json(
      { claim: claimData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing claim request:", error);

    return NextResponse.json(
      {
        error:
          "An error occurred while processing the request. Please try again later.",
      },
      { status: 500 }
    );
  }
};
