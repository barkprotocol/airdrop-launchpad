// Wallet-related types
export interface Wallet {
    walletAddress: string;
    balance: number;  // Representing the balance of the wallet in the token unit
    isEligible: boolean;  // Whether the wallet is eligible for the airdrop
  }
  
  // User-related types
  export interface User {
    id: string;
    username: string;
    email: string;
    wallet: Wallet;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Airdrop-related types
  export interface Airdrop {
    id: string;
    name: string;
    totalSupply: bigint;  // The total supply of tokens for the airdrop
    startDate: Date;
    endDate: Date;
    eligibilityCriteria: string;  // The eligibility criteria for the airdrop
    isActive: boolean;  // Whether the airdrop is currently active
  }
  
  // Claim-related types
  export interface Claim {
    id: string;
    walletAddress: string;
    amountClaimed: bigint;  // The amount of tokens claimed
    claimDate: Date;
    airdropId: string;  // The airdrop this claim is associated with
    status: 'pending' | 'successful' | 'failed';  // The status of the claim
  }
  
  // Response types for API calls
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;  // Generic type for API response data
  }
  
  // Eligibility check response type
  export interface EligibilityCheckResponse {
    walletAddress: string;
    isEligible: boolean;
    reason?: string;  // Optional reason if ineligible
  }
  
  // Token-related types
  export interface TokenAccount {
    mint: string;  // The mint address of the token
    amount: number;  // The amount of the token in the account
  }
  
  // Utility types
  export type Nullable<T> = T | null;  // A type to represent nullable values
  export type Maybe<T> = T | undefined;  // A type to represent values that can be undefined
  