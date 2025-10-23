import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';

export interface MortgageApplication {
  id: string;
  propertyAddress: string;
  borrower: string;
  loanAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'paid';
  collateralTokens: number;
  createdAt: number;
}

export function useMortgage() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Apply for a mortgage
   */
  const applyForMortgage = async (
    propertyAddress: string,
    loanAmount: number,
    termMonths: number,
    collateralTokens: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate interest rate (simplified for demo)
      const ltvRatio = loanAmount / (collateralTokens * 100); // Assuming $100 per token
      const baseRate = 0.045; // 4.5% base rate
      const interestRate = baseRate + (ltvRatio * 0.02); // Higher LTV = higher rate

      // Calculate monthly payment
      const monthlyRate = interestRate / 12;
      const monthlyPayment = loanAmount *
        (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);

      const application: MortgageApplication = {
        id: `mort_${Date.now()}`,
        propertyAddress,
        borrower: publicKey.toBase58(),
        loanAmount,
        interestRate,
        termMonths,
        monthlyPayment,
        status: 'pending',
        collateralTokens,
        createdAt: Date.now(),
      };

      // Store in localStorage for demo
      const applications = JSON.parse(localStorage.getItem('mortgage_applications') || '[]');
      applications.push(application);
      localStorage.setItem('mortgage_applications', JSON.stringify(applications));

      setLoading(false);
      return { application };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get user's mortgage applications
   */
  const getMyApplications = (): MortgageApplication[] => {
    if (!publicKey) return [];

    const applications = JSON.parse(localStorage.getItem('mortgage_applications') || '[]');
    return applications.filter((app: MortgageApplication) =>
      app.borrower === publicKey.toBase58()
    );
  };

  /**
   * Make a mortgage payment
   */
  const makePayment = async (mortgageId: string, amount: number) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Record payment (demo)
      const payments = JSON.parse(localStorage.getItem('mortgage_payments') || '{}');
      if (!payments[mortgageId]) {
        payments[mortgageId] = [];
      }

      payments[mortgageId].push({
        amount,
        timestamp: Date.now(),
        payer: publicKey.toBase58(),
      });

      localStorage.setItem('mortgage_payments', JSON.stringify(payments));

      setLoading(false);
      return { mortgageId, amount };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    applyForMortgage,
    getMyApplications,
    makePayment,
    loading,
    error,
  };
}
