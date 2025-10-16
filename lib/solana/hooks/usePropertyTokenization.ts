import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, Keypair, SystemProgram } from '@solana/web3.js';
import { useState } from 'react';
import {
  createPropertyInstruction,
  tokenizePropertyInstruction,
  buySharesInstruction,
  derivePropertyPDA,
  derivePropertyMintPDA,
} from '../instructions/propertyTokenization';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

export function usePropertyTokenization() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Creates a new property on-chain
   */
  const createProperty = async (propertyData: {
    name: string;
    location: string;
    totalValue: number;
    totalShares: number;
    rentPerMonth: number;
    metadataUri: string;
  }) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Derive property PDA
      const [propertyPDA] = derivePropertyPDA(publicKey, propertyData.name);

      // Create instruction
      const instruction = await createPropertyInstruction(
        publicKey,
        propertyPDA,
        propertyData
      );

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setLoading(false);
      return { signature, propertyAddress: propertyPDA.toBase58() };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Tokenizes a property (creates SPL tokens)
   */
  const tokenizeProperty = async (propertyName: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Derive PDAs
      const [propertyPDA] = derivePropertyPDA(publicKey, propertyName);
      const [mintPDA] = derivePropertyMintPDA(propertyPDA);

      // Get or create token account
      const tokenAccount = await getAssociatedTokenAddress(mintPDA, publicKey);

      // Create instruction
      const instruction = await tokenizePropertyInstruction(
        publicKey,
        propertyPDA,
        mintPDA,
        tokenAccount
      );

      // Create and send transaction
      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      setLoading(false);
      return { signature, mintAddress: mintPDA.toBase58() };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Buys shares of a property
   */
  const buyShares = async (
    propertyAddress: string,
    mintAddress: string,
    amount: number,
    pricePerShare: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const propertyPubkey = new (await import('@solana/web3.js')).PublicKey(propertyAddress);
      const mintPubkey = new (await import('@solana/web3.js')).PublicKey(mintAddress);

      // Get buyer's token account
      const buyerTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        publicKey
      );

      // Derive vault token account (PDA that holds the tokens)
      const [vaultTokenAccount] = await (await import('@solana/web3.js')).PublicKey.findProgramAddress(
        [Buffer.from('vault'), propertyPubkey.toBuffer()],
        (await import('../programs')).PROPERTY_TOKENIZATION_PROGRAM_ID
      );

      // Create instruction
      const instruction = await buySharesInstruction(
        publicKey,
        propertyPubkey,
        mintPubkey,
        buyerTokenAccount,
        vaultTokenAccount,
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
    createProperty,
    tokenizeProperty,
    buyShares,
    loading,
    error,
  };
}
