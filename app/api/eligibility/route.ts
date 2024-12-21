import { NextResponse } from "next/server";
import { EligibilityResponse } from "@/utils/types";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { address } = body;

    // Validate input
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

    // Fetch eligibility data from BARK Protocol
    const apiUrl = `https://api.barkprotocol.net/v0.1/airdrops/bark/eligibility/${address}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle non-successful responses
    if (!response.ok) {
      console.error(
        `Failed to fetch eligibility data. Status: ${response.status}, Text: ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch eligibility data" },
        { status: response.status }
      );
    }

    // Parse and validate the response
    const eligibilityData = (await response.json()) as EligibilityResponse;
    if (!eligibilityData || typeof eligibilityData.totalUnclaimed !== "number") {
      console.error("Invalid eligibility data received:", eligibilityData);
      return NextResponse.json(
        { error: "Invalid data received from the BARK Protocol server" },
        { status: 500 }
      );
    }

    // Check eligibility
    if (eligibilityData.totalUnclaimed === 0) {
      return NextResponse.json(
        {
          error: "You are either not eligible or have already claimed tokens",
        },
        { status: 400 }
      );
    }

    // Return eligibility data if successful
    return NextResponse.json(
      { eligibility: eligibilityData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing eligibility request:", error);

    return NextResponse.json(
      {
        error:
          "An error occurred while processing the request. Please try again later.",
      },
      { status: 500 }
    );
  }
};
