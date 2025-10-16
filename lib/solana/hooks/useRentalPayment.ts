import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import {
  createRentalAgreementInstruction,
  payRentInstruction,
  distributeIncomeInstruction,
  deriveRentalAgreementPDA,
  getUsdcTokenAccount,
} from '../instructions/rentalPayment';

export function useRentalPayment() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a rental agreement on-chain
   */
  const createRentalAgreement = async (
    tenantAddress: string,
    propertyId: string,
    rentAmount: number,
    paymentFrequency: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const tenantPubkey = new PublicKey(tenantAddress);
      const propertyPubkey = new PublicKey(propertyId);

      // Derive rental agreement PDA
      const [rentalAgreementPDA] = deriveRentalAgreementPDA(
        propertyPubkey,
        tenantPubkey
      );

      // Create instruction
      const instruction = await createRentalAgreementInstruction(
        publicKey, // landlord
        tenantPubkey,
        rentalAgreementPDA,
        propertyPubkey,
        rentAmount,
        paymentFrequency
      );

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setLoading(false);
      return { signature, agreementAddress: rentalAgreementPDA.toBase58() };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Pays rent using USDC
   */
  const payRent = async (
    landlordAddress: string,
    agreementAddress: string,
    amount: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const landlordPubkey = new PublicKey(landlordAddress);
      const agreementPubkey = new PublicKey(agreementAddress);

      // Get USDC token accounts
      const tenantUsdcAccount = await getUsdcTokenAccount(connection, publicKey);
      const landlordUsdcAccount = await getUsdcTokenAccount(
        connection,
        landlordPubkey
      );

      // Create instruction
      const instruction = await payRentInstruction(
        publicKey, // tenant
        landlordPubkey,
        agreementPubkey,
        tenantUsdcAccount,
        landlordUsdcAccount,
        amount
      );

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setLoading(false);
      return { signature, amount };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Distributes rental income to token holders
   */
  const distributeIncome = async (
    agreementAddress: string,
    propertyMintAddress: string,
    amount: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const agreementPubkey = new PublicKey(agreementAddress);
      const mintPubkey = new PublicKey(propertyMintAddress);

      // Create instruction
      const instruction = await distributeIncomeInstruction(
        publicKey, // landlord
        agreementPubkey,
        mintPubkey,
        amount
      );

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setLoading(false);
      return { signature, amount };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    createRentalAgreement,
    payRent,
    distributeIncome,
    loading,
    error,
  };
}
