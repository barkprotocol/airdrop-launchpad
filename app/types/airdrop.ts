export interface CreateAirdropFormData {
  recipientAddress: string;
  amount: string;
  category: string;
  description?: string;
}

export interface AirdropResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    amount: string;
    recipientAddress: string;
  };
}