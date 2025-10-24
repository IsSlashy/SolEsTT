'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import { getAllProperties, formatPrice, calculateROI } from '@/lib/solana/mockData';
import { useBadges } from '@/lib/solana/hooks/useBadges';

export default function Portfolio() {
  const { connected, publicKey } = useWallet();
  const [view, setView] = useState<'overview' | 'properties' | 'transactions'>('overview');
  const { getUnlockedBadges, stats } = useBadges();

  // Mock user investments - simulate user has bought shares
  const mockInvestments = connected ? [
    {
      propertyId: '1',
      shares: 50,
      purchasePrice: 25000,
      purchaseDate: Date.now() - 86400000 * 45,
      currentValue: 26250, // +5%
    },
    {
      propertyId: '2',
      shares: 20,
      purchasePrice: 10000,
      purchaseDate: Date.now() - 86400000 * 20,
      currentValue: 10300, // +3%
    },
  ] : [];

  const properties = getAllProperties();
  const investedProperties = mockInvestments.map(inv => {
    const property = properties.find(p => p.id === inv.propertyId);
    return property ? { ...inv, property } : null;
  }).filter(Boolean);

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.purchasePrice, 0);
  const currentValue = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalReturn = currentValue - totalInvested;
  const returnPercentage = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : '0';
  const monthlyIncome = investedProperties.reduce((sum, inv) => {
    if (!inv?.property) return sum;
    return sum + (inv.property.rentPerMonth / inv.property.totalShares) * inv.shares;
  }, 0);

  // Mock transaction history
  const mockTransactions = connected ? [
    {
      id: '1',
      type: 'buy' as const,
      propertyName: 'Luxury Apartment - Paris 16th',
      shares: 50,
      price: 25000,
      date: Date.now() - 86400000 * 45,
    },
    {
      id: '2',
      type: 'buy' as const,
      propertyName: 'Modern Villa - Côte d\'Azur',
      shares: 20,
      price: 10000,
      date: Date.now() - 86400000 * 20,
    },
    {
      id: '3',
      type: 'income' as const,
      propertyName: 'Luxury Apartment - Paris 16th',
      shares: null,
      price: 125,
      date: Date.now() - 86400000 * 5,
    },
  ] : [];

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-8 text-junot-text-dark">Mon Portfolio</h1>
          <div className="modern-card p-12 text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h3 className="text-2xl font-semibold mb-4 text-junot-text-dark">Connectez Votre Wallet</h3>
            <p className="text-junot-text-muted text-sm">Connectez votre wallet pour voir votre portfolio</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">Mon Portfolio</h1>
          <p className="text-junot-text-muted text-sm">{publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}</p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Total Investi</div>
            <div className="text-3xl font-bold text-junot-text-dark">{formatPrice(totalInvested)}</div>
            <div className="text-sm text-junot-text-muted mt-1">Capital initial</div>
          </div>
          <div className="modern-card p-6 border-junot-gold/40">
            <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Valeur Actuelle</div>
            <div className="text-3xl font-bold text-junot-text-dark">{formatPrice(currentValue)}</div>
            <div className="text-junot-gold text-sm mt-1 font-semibold">+{returnPercentage}%</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Gain Total</div>
            <div className="text-3xl font-bold text-junot-gold">+{formatPrice(totalReturn)}</div>
            <div className="text-sm text-junot-text-muted mt-1">Plus-value latente</div>
          </div>
          <div className="modern-card p-6 border-junot-gold/40">
            <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Revenu Mensuel</div>
            <div className="text-3xl font-bold text-junot-text-dark">{formatPrice(monthlyIncome)}</div>
            <div className="text-sm text-junot-text-muted mt-1">Rendement locatif</div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setView('overview')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'overview' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setView('properties')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'properties' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Propriétés ({investedProperties.length})
          </button>
          <button
            onClick={() => setView('transactions')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              view === 'transactions' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Transactions ({mockTransactions.length})
          </button>
        </div>

        {/* Content based on view */}
        {view === 'overview' && (
          <div className="space-y-6">
            {/* Badges Widget */}
            <div className="modern-card p-6 border-junot-gold/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-junot-text-dark">🏆 Vos Badges NFT</h3>
                  <p className="text-sm text-junot-text-muted">
                    {stats.unlocked} badges débloqués ({stats.completion}% complétion)
                  </p>
                </div>
                <Link
                  href="/badges"
                  className="px-4 py-2 bg-junot-gold hover:bg-junot-gold-dark text-white rounded-lg transition-colors font-semibold text-sm"
                >
                  Voir Tous
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {getUnlockedBadges().slice(0, 6).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex-shrink-0 w-24 text-center group cursor-pointer"
                    title={badge.name}
                  >
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">
                      {badge.icon}
                    </div>
                    <div className="text-xs font-semibold text-junot-text-dark truncate">
                      {badge.name}
                    </div>
                  </div>
                ))}
                {stats.unlocked === 0 && (
                  <div className="flex-1 text-center py-8 text-junot-text-muted">
                    Investissez pour débloquer votre premier badge!
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Portfolio Allocation */}
              <div className="modern-card p-6">
                <h3 className="text-xl font-bold mb-4">Portfolio Allocation</h3>
              <div className="space-y-4">
                {investedProperties.map((inv) => {
                  if (!inv?.property) return null;
                  const percentage = ((inv.currentValue / currentValue) * 100).toFixed(1);
                  return (
                    <div key={inv.propertyId}>
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{inv.property.name}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-white/60 border border-junot-border rounded-full h-2">
                        <div
                          className="bg-white text-black h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-junot-text-muted mt-1">
                        <span>{inv.shares} shares</span>
                        <span>{formatPrice(inv.currentValue)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Recent Activity */}
              <div className="modern-card p-6">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-3 border-b border-junot-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'buy' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {tx.type === 'buy' ? '📥' : '💰'}
                        </div>
                        <div>
                          <div className="font-semibold text-junot-text-dark">{tx.type === 'buy' ? 'Purchased' : 'Rental Income'}</div>
                          <div className="text-sm text-junot-text-muted">{tx.propertyName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-junot-text-dark">{formatPrice(tx.price)}</div>
                        <div className="text-sm text-junot-text-muted">
                          {new Date(tx.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'properties' && (
          <div className="space-y-4">
            {investedProperties.map((inv) => {
              if (!inv?.property) return null;
              const roi = calculateROI(inv.property);
              const returnAmount = inv.currentValue - inv.purchasePrice;
              const returnPercent = ((returnAmount / inv.purchasePrice) * 100).toFixed(2);

              return (
                <div key={inv.propertyId} className="modern-card p-6">
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 bg-white/60 border border-junot-border rounded-lg overflow-hidden flex-shrink-0">
                      {inv.property.images[0] ? (
                        <img
                          src={inv.property.images[0]}
                          alt={inv.property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                          🏠
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/properties/${inv.property.id}`}
                        className="text-2xl font-bold hover:text-white transition-colors"
                      >
                        {inv.property.name}
                      </Link>
                      <p className="text-junot-text-muted mt-1">📍 {inv.property.location}</p>

                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <div className="text-junot-text-muted text-sm">Shares Owned</div>
                          <div className="text-xl font-bold">{inv.shares}</div>
                          <div className="text-sm text-junot-text-muted">
                            {((inv.shares / inv.property.totalShares) * 100).toFixed(2)}% ownership
                          </div>
                        </div>
                        <div>
                          <div className="text-junot-text-muted text-sm">Purchase Price</div>
                          <div className="text-xl font-bold">{formatPrice(inv.purchasePrice)}</div>
                          <div className="text-sm text-junot-text-muted">
                            {new Date(inv.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-junot-text-muted text-sm">Current Value</div>
                          <div className="text-xl font-bold">{formatPrice(inv.currentValue)}</div>
                          <div className={`text-sm ${returnAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {returnAmount >= 0 ? '+' : ''}{returnPercent}%
                          </div>
                        </div>
                        <div>
                          <div className="text-junot-text-muted text-sm">Monthly Income</div>
                          <div className="text-xl font-bold text-green-400">
                            {formatPrice((inv.property.rentPerMonth / inv.property.totalShares) * inv.shares)}
                          </div>
                          <div className="text-sm text-junot-text-muted">{roi}% ROI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === 'transactions' && (
          <div className="modern-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/60 backdrop-blur-sm">
                <tr>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Property</th>
                  <th className="text-left p-4 font-semibold">Shares</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-neutral-800">
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        tx.type === 'buy' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {tx.type === 'buy' ? 'Purchase' : 'Income'}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{tx.propertyName}</td>
                    <td className="p-4">{tx.shares ? `${tx.shares} shares` : '-'}</td>
                    <td className="p-4 font-semibold">{formatPrice(tx.price)}</td>
                    <td className="p-4 text-junot-text-muted">
                      {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 p-6 bg-junot-gold/10 border border-junot-gold/30 rounded-xl text-center">
          <p className="text-junot-text">
            📊 <span className="font-bold text-junot-gold">Mode Démo</span> - Les données du portfolio sont simulées. Les investissements réels seront suivis une fois l'intégration blockchain terminée.
          </p>
        </div>
      </main>
    </div>
  );
}
