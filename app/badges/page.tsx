'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import { useBadges, Badge } from '@/lib/solana/hooks/useBadges';
import PageTransition from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';

export default function BadgesPage() {
  const { connected } = useWallet();
  const { badges, stats, mintBadge, loading } = useBadges();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
    }
  };

  const getRarityBorder = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400/50';
      case 'rare': return 'border-blue-400/50';
      case 'epic': return 'border-purple-400/50';
      case 'legendary': return 'border-yellow-400/50 shadow-lg shadow-yellow-400/20';
    }
  };

  const getRarityText = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'Commun';
      case 'rare': return 'Rare';
      case 'epic': return 'Épique';
      case 'legendary': return 'Légendaire';
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === 'unlocked') return badge.isUnlocked;
    if (filter === 'locked') return !badge.isUnlocked;
    return true;
  });

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="modern-card p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-3xl font-bold mb-4 text-junot-text-dark">Connectez Votre Wallet</h2>
            <p className="text-junot-text-muted">Connectez votre wallet pour voir vos badges NFT</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">Collection de Badges NFT</h1>
            <p className="text-junot-text-muted">Débloquez des badges exclusifs en investissant et en participant</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Total Badges</div>
              <div className="text-3xl font-bold text-junot-text-dark">{stats.total}</div>
            </div>
            <div className="modern-card p-6 border-junot-gold/40">
              <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Débloqués</div>
              <div className="text-3xl font-bold text-junot-text-dark">{stats.unlocked}</div>
            </div>
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Verrouillés</div>
              <div className="text-3xl font-bold text-junot-text-dark">{stats.locked}</div>
            </div>
            <div className="modern-card p-6 border-junot-gold/40">
              <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Completion</div>
              <div className="text-3xl font-bold text-junot-text-dark">{stats.completion}%</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="modern-card p-6 mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-junot-text-dark font-semibold">Progression Globale</span>
              <span className="text-junot-gold font-semibold">{stats.unlocked} / {stats.total}</span>
            </div>
            <div className="w-full bg-junot-cream-dark rounded-full h-4">
              <div
                className="bg-gradient-to-r from-junot-gold to-junot-gold-light h-4 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${stats.completion}%` }}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === 'all' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Tous ({badges.length})
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === 'unlocked' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Débloqués ({stats.unlocked})
            </button>
            <button
              onClick={() => setFilter('locked')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === 'locked' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Verrouillés ({stats.locked})
            </button>
          </div>

          {/* Badges Grid */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBadge(badge)}
                className={`modern-card p-6 cursor-pointer hover:scale-105 transition-all ${
                  badge.isUnlocked ? getRarityBorder(badge.rarity) : 'opacity-60 grayscale'
                }`}
              >
                {/* Badge Icon */}
                <div className={`text-6xl mb-4 text-center ${!badge.isUnlocked && 'blur-sm'}`}>
                  {badge.icon}
                </div>

                {/* Badge Name */}
                <h3 className="text-lg font-bold text-center mb-2 text-junot-text-dark">
                  {badge.isUnlocked ? badge.name : '???'}
                </h3>

                {/* Rarity Badge */}
                <div className="text-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>
                    {getRarityText(badge.rarity)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-junot-text-muted text-center mb-4">
                  {badge.isUnlocked ? badge.description : badge.requirement}
                </p>

                {/* Progress Bar (for locked badges) */}
                {!badge.isUnlocked && badge.progress !== undefined && badge.maxProgress !== undefined && (
                  <div>
                    <div className="w-full bg-junot-cream-dark rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-junot-gold to-junot-gold-light h-2 rounded-full transition-all"
                        style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-junot-text-muted text-center">
                      {badge.progress.toLocaleString()} / {badge.maxProgress.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Unlocked Date */}
                {badge.isUnlocked && badge.unlockedAt && (
                  <div className="text-xs text-junot-gold text-center mt-2">
                    Débloqué le {new Date(badge.unlockedAt).toLocaleDateString('fr-FR')}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Demo Notice */}
          <div className="mt-8 p-6 bg-junot-gold/10 border border-junot-gold/30 rounded-xl text-center">
            <p className="text-junot-text">
              🏆 <span className="font-bold text-junot-gold">Mode Démo</span> - Les badges seront mintés en tant que NFT Solana une fois l'intégration blockchain terminée.
            </p>
          </div>
        </main>
      </PageTransition>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedBadge(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className={`modern-card p-8 max-w-md w-full border-2 ${getRarityBorder(selectedBadge.rarity)}`}
          >
            <div className={`text-8xl mb-6 text-center ${!selectedBadge.isUnlocked && 'blur-sm'}`}>
              {selectedBadge.icon}
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 text-junot-text-dark">
              {selectedBadge.isUnlocked ? selectedBadge.name : 'Badge Verrouillé'}
            </h2>

            <div className="text-center mb-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getRarityColor(selectedBadge.rarity)} text-white`}>
                {getRarityText(selectedBadge.rarity)}
              </span>
            </div>

            <p className="text-junot-text text-center mb-6">
              {selectedBadge.description}
            </p>

            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg mb-6">
              <div className="text-sm text-junot-text-muted mb-2">Condition de déblocage:</div>
              <div className="text-junot-text-dark font-semibold">{selectedBadge.requirement}</div>
            </div>

            {!selectedBadge.isUnlocked && selectedBadge.progress !== undefined && selectedBadge.maxProgress !== undefined && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-junot-text-muted">Progression</span>
                  <span className="text-junot-gold font-semibold">
                    {Math.round((selectedBadge.progress / selectedBadge.maxProgress) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-junot-cream-dark rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-junot-gold to-junot-gold-light h-3 rounded-full transition-all shadow-md"
                    style={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                  />
                </div>
                <div className="text-sm text-junot-text-muted text-center mt-2">
                  {selectedBadge.progress.toLocaleString()} / {selectedBadge.maxProgress.toLocaleString()}
                </div>
              </div>
            )}

            {selectedBadge.isUnlocked && selectedBadge.unlockedAt && (
              <div className="bg-junot-gold/10 p-4 rounded-lg mb-6 text-center">
                <div className="text-junot-gold text-sm font-semibold">
                  🎉 Débloqué le {new Date(selectedBadge.unlockedAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full modern-button py-3 rounded-lg font-semibold"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
