export interface User {
    id: string;
    walletAddress: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
    status: string;
  }
  
  export interface WhereClause {
    status?: string;
    OR?: Array<{ [key: string]: { contains: string; mode: 'insensitive' } }>;
  }
  
  export interface AirdropWallet {
    id: string;
    walletAddress: string;
    balance: bigint;
    usedBalance: bigint;
  }
  
  export interface Transaction {
    id: string;
    amount: bigint;
    recipientAddress: string;
    status: string;
    transactionSignature: string | null;
    createdAt: Date;
  }
  
  export interface Claim {
    id: string;
    userId: string;
    amount: bigint;
    status: string;
    transactionSignature?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  