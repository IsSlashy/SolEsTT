import { PublicKey } from '@solana/web3.js';

export interface Property {
  id: string;
  address: PublicKey;
  name: string;
  description: string;
  location: string;
  price: number;
  totalValue: number;
  totalShares: number;
  availableShares: number;
  rentPerMonth: number;
  images: string[];
  owner: PublicKey;
  tokenMint?: PublicKey;
  isTokenized: boolean;
  createdAt: number;
  metadata: {
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    yearBuilt?: number;
    propertyType?: 'apartment' | 'house' | 'condo' | 'commercial';
  };
}

export interface Investment {
  id: string;
  propertyId: string;
  investor: PublicKey;
  shares: number;
  investmentAmount: number;
  purchaseDate: number;
  currentValue: number;
}

export interface RentalPayment {
  id: string;
  propertyId: string;
  tenant: PublicKey;
  landlord: PublicKey;
  amount: number;
  dueDate: number;
  paidDate?: number;
  status: 'pending' | 'paid' | 'overdue';
  transactionSignature?: string;
}

export interface User {
  wallet: PublicKey;
  properties: Property[];
  investments: Investment[];
  totalPortfolioValue: number;
}

export enum TransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Failed = 'failed',
}
