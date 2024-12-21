// Represents an individual address and the amount associated with it
export interface EligibilityItem {
  address: string; // Solana address
  amount: number;  // Amount eligible for airdrop
}

// Represents a category of eligibility and its associated items
export interface EligibilityCategory {
  category: string;          // Category name (e.g., "Loyal Users")
  items: EligibilityItem[];  // List of eligibility items in this category
  total: number;             // Total amount for the category
}

// Represents the response structure for eligibility data
export interface EligibilityResponse {
  total: number;                // Total amount eligible across all categories
  totalUnclaimed: number;       // Total amount still unclaimed
  categories: EligibilityCategory[]; // List of eligibility categories
  addresses: string[];          // List of all eligible addresses
}

// Represents an individual claim item with its data and associated signatures
export interface ClaimItem {
  data: string;           // Claim-specific data (e.g., metadata or token info)
  signatures: string[];   // Array of signatures required for the claim
}

// Represents the response structure for claim data
export interface ClaimResponse {
  claim: ClaimItem[];     // List of claim items
}

// Represents the request body structure for a claim submission
export interface ClaimRequestBody {
  address: string;        // Solana address submitting the claim
  signature: string;      // Signature authorizing the claim
}

// Represents the response data after successfully processing a claim
export interface ClaimResponseData {
  txId: string;           // Transaction ID for the claim
  message: string;        // Success message
  amount: number;         // Amount of tokens claimed
  operationalFee: number; // Fee charged for processing the claim
  communityFee: number;   // Fee allocated to community initiatives
}
