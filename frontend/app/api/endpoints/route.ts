// Base URL for the API
const BASE_URL = "https://api.barkprotocol.net/v0.1";

// Centralized API endpoints
export const endpoints = {
  airdrops: {
    eligibility: (address: string) => `${BASE_URL}/airdrops/bark/eligibility/${address}`,
    claim: (address: string) => `${BASE_URL}/airdrops/bark/claim/${address}`,
  },
  metadata: {
    upload: `${BASE_URL}/metadata/upload`,
  },
  tokens: {
    mint: `${BASE_URL}/tokens/mint`,
  },
};

// Default headers for API requests
export const defaultHeaders = {
  "Content-Type": "application/json",
};

// Fetch utility function with improved error handling
export const fetchData = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `Error fetching data from ${url}. Status: ${response.status} - ${response.statusText}. Details: ${errorDetails}`
      );
      throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    }

    // Check if the response is empty (no content)
    if (response.status === 204) {
      return {} as T; // Returning empty object for 204 No Content
    }

    // Check for different content types and parse accordingly
    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    } else if (contentType.includes("text/plain")) {
      return response.text() as unknown as T; // Returning text for plain text responses
    } else {
      throw new Error("Unsupported response type");
    }
  } catch (error) {
    console.error(`Fetch error: ${error}`);
    throw new Error("Network error occurred while fetching data.");
  }
};
