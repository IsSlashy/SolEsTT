'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
  requirement: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

export function useBadges() {
  const { connected, publicKey } = useWallet();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(false);

  // Define all available badges
  const allBadges: Badge[] = [
    {
      id: 'first-investment',
      name: 'Premier Pas',
      description: 'Effectuez votre premier investissement immobilier',
      icon: '🏠',
      rarity: 'common',
      requirement: 'Achetez au moins 1 part',
      isUnlocked: false,
      progress: 0,
      maxProgress: 1,
    },
    {
      id: 'big-investor',
      name: 'Investisseur Confirmé',
      description: 'Investissez plus de 50 000€',
      icon: '💎',
      rarity: 'rare',
      requirement: 'Total investi: 50 000€',
      isUnlocked: false,
      progress: 0,
      maxProgress: 50000,
    },
    {
      id: 'portfolio-master',
      name: 'Maître du Portfolio',
      description: 'Possédez des parts dans 5 propriétés différentes',
      icon: '🏆',
      rarity: 'epic',
      requirement: '5 propriétés différentes',
      isUnlocked: false,
      progress: 0,
      maxProgress: 5,
    },
    {
      id: 'early-adopter',
      name: 'Pionnier Junot',
      description: 'Parmi les 100 premiers investisseurs',
      icon: '🚀',
      rarity: 'legendary',
      requirement: 'Top 100 des premiers utilisateurs',
      isUnlocked: true,
      unlockedAt: Date.now() - 86400000 * 30,
    },
    {
      id: 'governance-voter',
      name: 'Citoyen Actif',
      description: 'Votez sur 10 propositions de gouvernance',
      icon: '🗳️',
      rarity: 'rare',
      requirement: '10 votes',
      isUnlocked: false,
      progress: 3,
      maxProgress: 10,
    },
    {
      id: 'rental-collector',
      name: 'Rentier',
      description: 'Recevez 10 000€ de revenus locatifs',
      icon: '💰',
      rarity: 'epic',
      requirement: '10 000€ de loyers perçus',
      isUnlocked: false,
      progress: 232,
      maxProgress: 10000,
    },
    {
      id: 'loyalty-gold',
      name: 'Membre Gold',
      description: 'Atteignez le niveau Gold du programme de fidélité',
      icon: '⭐',
      rarity: 'rare',
      requirement: 'Niveau Gold',
      isUnlocked: true,
      unlockedAt: Date.now() - 86400000 * 15,
    },
    {
      id: 'whale',
      name: 'Baleine Immobilière',
      description: 'Investissez plus de 500 000€',
      icon: '🐋',
      rarity: 'legendary',
      requirement: '500 000€ investis',
      isUnlocked: false,
      progress: 35000,
      maxProgress: 500000,
    },
    {
      id: 'marketplace-trader',
      name: 'Trader Aguerri',
      description: 'Effectuez 20 transactions sur le marché secondaire',
      icon: '📈',
      rarity: 'rare',
      requirement: '20 trades',
      isUnlocked: false,
      progress: 0,
      maxProgress: 20,
    },
    {
      id: 'property-owner',
      name: 'Propriétaire Majoritaire',
      description: 'Possédez plus de 50% d\'une propriété',
      icon: '👑',
      rarity: 'legendary',
      requirement: '>50% d\'une propriété',
      isUnlocked: false,
      progress: 0,
      maxProgress: 50,
    },
    {
      id: 'staking-master',
      name: 'Maître du Staking',
      description: 'Stakez plus de 100 000 tokens',
      icon: '🔒',
      rarity: 'epic',
      requirement: '100 000 tokens stakés',
      isUnlocked: false,
      progress: 0,
      maxProgress: 100000,
    },
    {
      id: 'referral-champion',
      name: 'Ambassadeur',
      description: 'Parrainez 10 nouveaux investisseurs',
      icon: '🤝',
      rarity: 'epic',
      requirement: '10 parrainages',
      isUnlocked: false,
      progress: 0,
      maxProgress: 10,
    },
  ];

  useEffect(() => {
    if (connected) {
      // Mock user progress - in production, fetch from blockchain
      const userBadges = allBadges.map(badge => {
        if (badge.id === 'first-investment') {
          return { ...badge, isUnlocked: true, unlockedAt: Date.now() - 86400000 * 45, progress: 1 };
        }
        if (badge.id === 'big-investor') {
          return { ...badge, progress: 35000 };
        }
        if (badge.id === 'portfolio-master') {
          return { ...badge, progress: 2 };
        }
        return badge;
      });
      setBadges(userBadges);
    } else {
      setBadges([]);
    }
  }, [connected]);

  const mintBadge = async (badgeId: string) => {
    if (!connected || !publicKey) {
      throw new Error('Wallet not connected');
    }

    setLoading(true);
    try {
      // TODO: Implement actual NFT minting on Solana
      console.log('Minting badge NFT:', badgeId);

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update badge status
      setBadges(prev => prev.map(badge =>
        badge.id === badgeId
          ? { ...badge, isUnlocked: true, unlockedAt: Date.now() }
          : badge
      ));

      return true;
    } catch (error) {
      console.error('Error minting badge:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUnlockedBadges = () => badges.filter(b => b.isUnlocked);
  const getLockedBadges = () => badges.filter(b => !b.isUnlocked);
  const getBadgesByRarity = (rarity: Badge['rarity']) => badges.filter(b => b.rarity === rarity);

  const stats = {
    total: badges.length,
    unlocked: getUnlockedBadges().length,
    locked: getLockedBadges().length,
    completion: badges.length > 0 ? Math.round((getUnlockedBadges().length / badges.length) * 100) : 0,
  };

  return {
    badges,
    loading,
    mintBadge,
    getUnlockedBadges,
    getLockedBadges,
    getBadgesByRarity,
    stats,
  };
}
