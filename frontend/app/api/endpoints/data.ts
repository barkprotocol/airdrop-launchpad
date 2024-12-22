// File: @/app/api/endpoints/data.ts

/**
 * Base URL for the API endpoints.
 * Replace with your actual base URL
 */
const BASE_URL = 'https://api.barkprotocol.net';

/**
 * Default headers to be used in API requests.
 * Can be customized as per your needs, e.g., adding Authorization tokens.
 */
export const defaultHeaders = {
  'Content-Type': 'application/json',
  // Example: 'Authorization': 'Bearer your_token_here',
};

/**
 * API endpoints for different actions related to airdrops.
 */
export const endpoints = {
  airdrops: {
    /**
     * Get eligibility status for the airdrop based on the user's address.
     * @param {string} address - The user's address (e.g., Solana wallet address)
     * @returns {string} - The URL for the eligibility API endpoint.
     */
    eligibility: (address: string) => `${BASE_URL}/airdrop/eligibility/${address}`,
    
    /**
     * Claim airdrop tokens based on the user's address.
     * @param {string} address - The user's address (e.g., Solana wallet address)
     * @returns {string} - The URL for the claim API endpoint.
     */
    claim: (address: string) => `${BASE_URL}/airdrop/claim/${address}`,
  },
  // Example additional endpoint:
  // users: {
  //   getUser: (id: string) => `${BASE_URL}/users/${id}`,
  // },
};

/**
 * Utility function to fetch data from an API endpoint.
 * @param {string} url - The URL to fetch data from.
 * @param {RequestInit} options - The options for the fetch request (method, headers, etc.).
 * @returns {Promise<any>} - The response data in JSON format.
 */
export const fetchData = async (url: string, options: RequestInit): Promise<any> => {
  try {
    const response = await fetch(url, options);

    // Check if the response status is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the response as JSON
    const data = await response.json();
    return data;
  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching data:', error);

    // Rethrow the error to be handled by the caller
    throw new Error(`Error fetching data from ${url}: ${error.message}`);
  }
};
