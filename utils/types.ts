export interface EligibilityItem {
  address: string;
  amount: number;
}

export interface EligibilityCategory {
  category: string;
  items: EligibilityItem[];
  total: number;
}

export interface EligibilityResponse {
  total: number;
  totalUnclaimed: number;
  categories: EligibilityCategory[];
  addresses: string[];
}

export interface ClaimItem {
  data: string;
  signatures: string[];
}

export interface ClaimResponse {
  claim: ClaimItem[];
}

export interface ClaimRequestBody {
  address: string;
  signature: string;
}

export interface ClaimResponseData {
  txId: string;
  message: string;
  amount: number;
  operationalFee: number;
  communityFee: number;
}

