import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';

export interface LoyaltyAccount {
  owner: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  stakedTokens: number;
  totalRewardsEarned: number;
  lastClaimTime: number;
}

export interface StakingPosition {
  id: string;
  owner: string;
  propertyAddress: string;
  tokensStaked: number;
  apy: number;
  startTime: number;
  rewardsAccrued: number;
}

export function useLoyalty() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get or create loyalty account
   */
  const getLoyaltyAccount = (): LoyaltyAccount => {
    if (!publicKey) {
      return {
        owner: '',
        points: 0,
        tier: 'bronze',
        stakedTokens: 0,
        totalRewardsEarned: 0,
        lastClaimTime: 0,
      };
    }

    const accounts = JSON.parse(localStorage.getItem('loyalty_accounts') || '{}');
    const userKey = publicKey.toBase58();

    if (!accounts[userKey]) {
      accounts[userKey] = {
        owner: userKey,
        points: 0,
        tier: 'bronze',
        stakedTokens: 0,
        totalRewardsEarned: 0,
        lastClaimTime: Date.now(),
      };
      localStorage.setItem('loyalty_accounts', JSON.stringify(accounts));
    }

    return accounts[userKey];
  };

  /**
   * Award loyalty points for actions
   */
  const awardPoints = async (action: string, points: number) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const accounts = JSON.parse(localStorage.getItem('loyalty_accounts') || '{}');
      const userKey = publicKey.toBase58();
      const account = accounts[userKey] || getLoyaltyAccount();

      account.points += points;

      // Update tier based on points
      if (account.points >= 10000) {
        account.tier = 'platinum';
      } else if (account.points >= 5000) {
        account.tier = 'gold';
      } else if (account.points >= 1000) {
        account.tier = 'silver';
      } else {
        account.tier = 'bronze';
      }

      accounts[userKey] = account;
      localStorage.setItem('loyalty_accounts', JSON.stringify(accounts));

      setLoading(false);
      return { points, newTotal: account.points, tier: account.tier };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Stake tokens to earn rewards
   */
  const stakeTokens = async (
    propertyAddress: string,
    tokensToStake: number
  ) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // APY based on staking amount
      let apy = 0.08; // 8% base
      if (tokensToStake >= 1000) apy = 0.12; // 12% for large stakes
      else if (tokensToStake >= 100) apy = 0.10; // 10% for medium stakes

      const position: StakingPosition = {
        id: `stake_${Date.now()}`,
        owner: publicKey.toBase58(),
        propertyAddress,
        tokensStaked: tokensToStake,
        apy,
        startTime: Date.now(),
        rewardsAccrued: 0,
      };

      // Store position
      const positions = JSON.parse(localStorage.getItem('staking_positions') || '[]');
      positions.push(position);
      localStorage.setItem('staking_positions', JSON.stringify(positions));

      // Update loyalty account
      const accounts = JSON.parse(localStorage.getItem('loyalty_accounts') || '{}');
      const userKey = publicKey.toBase58();
      const account = accounts[userKey] || getLoyaltyAccount();
      account.stakedTokens += tokensToStake;
      accounts[userKey] = account;
      localStorage.setItem('loyalty_accounts', JSON.stringify(accounts));

      setLoading(false);
      return { position };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Calculate rewards for a staking position
   */
  const calculateRewards = (position: StakingPosition): number => {
    const timeStaked = Date.now() - position.startTime;
    const daysStaked = timeStaked / (1000 * 60 * 60 * 24);
    const yearlyRewards = position.tokensStaked * position.apy;
    const rewardsEarned = (yearlyRewards / 365) * daysStaked;
    return rewardsEarned;
  };

  /**
   * Claim staking rewards
   */
  const claimRewards = async (positionId: string) => {
    if (!publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      const positions = JSON.parse(localStorage.getItem('staking_positions') || '[]');
      const positionIndex = positions.findIndex((p: StakingPosition) => p.id === positionId);

      if (positionIndex === -1) {
        throw new Error('Position not found');
      }

      const position = positions[positionIndex];
      const rewards = calculateRewards(position);

      // Reset rewards
      position.rewardsAccrued = 0;
      position.startTime = Date.now();
      positions[positionIndex] = position;
      localStorage.setItem('staking_positions', JSON.stringify(positions));

      // Update loyalty account
      const accounts = JSON.parse(localStorage.getItem('loyalty_accounts') || '{}');
      const userKey = publicKey.toBase58();
      const account = accounts[userKey] || getLoyaltyAccount();
      account.totalRewardsEarned += rewards;
      account.lastClaimTime = Date.now();
      accounts[userKey] = account;
      localStorage.setItem('loyalty_accounts', JSON.stringify(accounts));

      setLoading(false);
      return { rewards };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  /**
   * Get user's staking positions
   */
  const getMyPositions = (): StakingPosition[] => {
    if (!publicKey) return [];

    const positions = JSON.parse(localStorage.getItem('staking_positions') || '[]');
    return positions.filter((pos: StakingPosition) =>
      pos.owner === publicKey.toBase58()
    );
  };

  return {
    getLoyaltyAccount,
    awardPoints,
    stakeTokens,
    claimRewards,
    calculateRewards,
    getMyPositions,
    loading,
    error,
  };
}
