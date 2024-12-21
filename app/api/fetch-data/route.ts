import { NextResponse } from "next/server";
import { fetchData, endpoints, defaultHeaders } from "@/app/api/endpoints/data";

export const POST = async (req: Request) => {
  try {
    const { address } = await req.json();  // Get the address from the request body

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Construct the eligibility URL using the address
    const eligibilityUrl = endpoints.airdrops.eligibility(address);

    // Fetch eligibility data using the fetchData utility
    const eligibilityData = await fetchData(eligibilityUrl, {
      method: "GET",
      headers: defaultHeaders,
    });

    // Check if the user is eligible or has claimed
    if (eligibilityData.totalUnclaimed === 0) {
      return NextResponse.json(
        { error: "You are either not eligible or have already claimed tokens" },
        { status: 400 }
      );
    }

    // Return eligibility data if the user can claim
    return NextResponse.json({ eligibility: eligibilityData }, { status: 200 });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
};
