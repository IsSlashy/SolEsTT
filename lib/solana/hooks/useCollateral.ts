import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export interface CollateralPosition {
  id: string;
  owner: string;
  propertyAddress: string;
  tokensLocked: number;
  borrowedAmount: number;
  healthFactor: number; // Above 1.0 is healthy
  liquidationThreshold: number;
  createdAt: number;
  status: 'active' | 'liquidated' | 'closed';
}

export function useCollateral() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lock property tokens as collateral and borrow against them
   */
  const lockCollateral = async (
    propertyAddress: string,
    tokensToLock: number,
    borrowAmount: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate collateral value (assuming $100 per token for demo)
      const collateralValue = tokensToLock * 100;

      // Check LTV ratio (max 60% for safety)
      const ltvRatio = borrowAmount / collateralValue;
      if (ltvRatio > 0.6) {
        throw new Error('Borrow amount too high. Maximum LTV is 60%');
      }

      // Calculate health factor
      const liquidationThreshold = 0.75; // 75% liquidation threshold
      const healthFactor = (collateralValue * liquidationThreshold) / borrowAmount;

      const position: CollateralPosition = {
        id: `col_${Date.now()}`,
        owner: publicKey.toBase58(),
        propertyAddress,
        tokensLocked: tokensToLock,
        borrowedAmount: borrowAmount,
        healthFactor,
        liquidationThreshold,
        createdAt: Date.now(),
        status: 'active',
      };

      // Store in localStorage for demo
      const positions = JSON.parse(localStorage.getItem('collateral_positions') || '[]');
      positions.push(position);
      localStorage.setItem('collateral_positions', JSON.stringify(positions));

      setLoading(false);
      return { position };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Repay borrowed amount and unlock collateral
   */
  const repayAndUnlock = async (positionId: string, repayAmount: number) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const positions = JSON.parse(localStorage.getItem('collateral_positions') || '[]');
      const positionIndex = positions.findIndex((p: CollateralPosition) => p.id === positionId);

      if (positionIndex === -1) {
        throw new Error('Position not found');
      }

      const position = positions[positionIndex];

      if (position.owner !== publicKey.toBase58()) {
        throw new Error('Not the position owner');
      }

      // Update borrowed amount
      position.borrowedAmount -= repayAmount;

      if (position.borrowedAmount <= 0) {
        position.status = 'closed';
        position.borrowedAmount = 0;
      } else {
        // Recalculate health factor
        const collateralValue = position.tokensLocked * 100;
        position.healthFactor = (collateralValue * position.liquidationThreshold) / position.borrowedAmount;
      }

      positions[positionIndex] = position;
      localStorage.setItem('collateral_positions', JSON.stringify(positions));

      setLoading(false);
      return { positionId, newBorrowedAmount: position.borrowedAmount };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get user's collateral positions
   */
  const getMyPositions = (): CollateralPosition[] => {
    if (!publicKey) return [];

    const positions = JSON.parse(localStorage.getItem('collateral_positions') || '[]');
    return positions.filter((pos: CollateralPosition) =>
      pos.owner === publicKey.toBase58()
    );
  };

  /**
   * Calculate maximum borrow amount for given collateral
   */
  const calculateMaxBorrow = (tokensToLock: number): number => {
    const collateralValue = tokensToLock * 100;
    return collateralValue * 0.6; // 60% LTV
  };

  return {
    lockCollateral,
    repayAndUnlock,
    getMyPositions,
    calculateMaxBorrow,
    loading,
    error,
  };
}
