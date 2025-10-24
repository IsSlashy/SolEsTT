'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import { getPropertyById, calculateROI, formatPrice } from '@/lib/solana/mockData';
import Property3DViewer from '@/components/3d/Property3DViewer';
import ARPropertyViewer from '@/components/ar/ARPropertyViewer';
import PageTransition from '@/components/animations/PageTransition';
import ImageGallery from '@/components/gallery/ImageGallery';
import { motion } from 'framer-motion';

export default function PropertyDetails() {
  const params = useParams();
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const property = getPropertyById(params.id as string);

  const [shares, setShares] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen  text-junot-text-dark">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-junot-text-dark">Propriété Non Trouvée</h1>
            <button
              onClick={() => router.push('/properties')}
              className="text-junot-text hover:text-junot-gold font-medium"
            >
              ← Retour aux Biens
            </button>
          </div>
        </main>
      </div>
    );
  }

  const roi = calculateROI(property);
  const pricePerShare = property.totalValue / property.totalShares;
  const totalCost = pricePerShare * shares;
  const monthlyIncome = (property.rentPerMonth / property.totalShares) * shares;
  const sharesPercentage = ((property.totalShares - property.availableShares) / property.totalShares) * 100;

  const handleBuyShares = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    if (shares > property.availableShares) {
      alert(`Only ${property.availableShares} shares available`);
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual blockchain transaction
      console.log('Buying shares:', { property: property.id, shares, totalCost });

      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Successfully purchased ${shares} shares! (Demo mode - not yet on blockchain)`);
      router.push('/portfolio');
    } catch (err) {
      console.error('Error buying shares:', err);
      alert('Failed to purchase shares. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [viewMode, setViewMode] = useState<'image' | '3d' | 'ar'>('image');

  return (
    <div className="min-h-screen">
      <Header />

      <PageTransition>
      <main className="container mx-auto px-6 py-12">
        <button
          onClick={() => router.push('/properties')}
          className="text-junot-text hover:text-junot-gold mb-6 font-medium"
        >
          ← Retour aux Biens
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setViewMode('image')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === 'image' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 backdrop-blur-sm text-junot-text-muted hover:bg-white/70 border border-neutral-800'
                }`}
              >
                📸 Photos
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === '3d' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 backdrop-blur-sm text-junot-text-muted hover:bg-white/70 border border-neutral-800'
                }`}
              >
                🎨 3D View
              </button>
              <button
                onClick={() => setViewMode('ar')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === 'ar' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 backdrop-blur-sm text-junot-text-muted hover:bg-white/70 border border-neutral-800'
                }`}
              >
                📱 AR View
              </button>
            </div>

            {/* Dynamic View */}
            {viewMode === 'image' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ImageGallery
                  images={property.images || []}
                  propertyName={property.name}
                />
              </motion.div>
            )}

            {viewMode === '3d' && <Property3DViewer propertyName={property.name} />}

            {viewMode === 'ar' && <ARPropertyViewer propertyName={property.name} />}

            {/* Details */}
            <div className="modern-card p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-junot-text-dark">{property.name}</h1>
                  <p className="text-junot-text-muted">📍 {property.location}</p>
                </div>
                <div className="bg-junot-gold text-white shadow-md px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold">{roi}%</div>
                  <div className="text-sm">ROI Annuel</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-junot-border">
                {property.metadata.bedrooms && (
                  <div>
                    <div className="text-junot-text-muted text-sm">Chambres</div>
                    <div className="text-2xl font-bold text-junot-text-dark">{property.metadata.bedrooms}</div>
                  </div>
                )}
                {property.metadata.bathrooms && (
                  <div>
                    <div className="text-junot-text-muted text-sm">Salles de bain</div>
                    <div className="text-2xl font-bold text-junot-text-dark">{property.metadata.bathrooms}</div>
                  </div>
                )}
                {property.metadata.squareFeet && (
                  <div>
                    <div className="text-junot-text-muted text-sm">Surface</div>
                    <div className="text-2xl font-bold text-junot-text-dark">{Math.round(property.metadata.squareFeet * 0.092903)} m²</div>
                  </div>
                )}
                {property.metadata.yearBuilt && (
                  <div>
                    <div className="text-junot-text-muted text-sm">Année</div>
                    <div className="text-2xl font-bold text-junot-text-dark">{property.metadata.yearBuilt}</div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4 text-junot-text-dark">Description</h2>
                <p className="text-junot-text leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-junot-text-dark">Vue d'ensemble Financière</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-junot-text-muted text-sm mb-2">Valeur Totale</div>
                  <div className="text-2xl font-bold text-junot-text-dark">{formatPrice(property.totalValue)}</div>
                </div>
                <div>
                  <div className="text-junot-text-muted text-sm mb-2">Loyer Mensuel</div>
                  <div className="text-2xl font-bold text-junot-gold">{formatPrice(property.rentPerMonth)}</div>
                </div>
                <div>
                  <div className="text-junot-text-muted text-sm mb-2">Rendement Annuel</div>
                  <div className="text-2xl font-bold text-junot-text-dark">{formatPrice(property.rentPerMonth * 12)}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-junot-text-muted">Total Shares</span>
                  <span className="font-semibold">{property.totalShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-junot-text-muted">Available Shares</span>
                  <span className="font-semibold">{property.availableShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-junot-text-muted">Price per Share</span>
                  <span className="font-semibold">{formatPrice(pricePerShare)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Investment Card */}
          <div className="lg:col-span-1">
            <div className="modern-card p-6 sticky top-6">
              <h3 className="text-2xl font-bold mb-6 text-junot-text-dark">Investir Maintenant</h3>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-junot-text-muted">Financé</span>
                  <span className="font-semibold text-junot-text-dark">{sharesPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-junot-cream-dark rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-junot-gold to-junot-gold-light h-3 rounded-full transition-all shadow-md"
                    style={{ width: `${sharesPercentage}%` }}
                  />
                </div>
                <div className="text-sm text-junot-text-muted mt-2">
                  {property.availableShares.toLocaleString()} parts restantes
                </div>
              </div>

              {/* Share Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-junot-text-dark">Nombre de Parts</label>
                <input
                  type="number"
                  min="1"
                  max={property.availableShares}
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, Math.min(property.availableShares, Number(e.target.value))))}
                  className="modern-input"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setShares(10)}
                    className="flex-1 py-2 bg-white/60 hover:bg-junot-gold hover:text-white border border-junot-border rounded text-sm transition-colors font-semibold text-junot-text-dark"
                  >
                    10
                  </button>
                  <button
                    onClick={() => setShares(50)}
                    className="flex-1 py-2 bg-white/60 hover:bg-junot-gold hover:text-white border border-junot-border rounded text-sm transition-colors font-semibold text-junot-text-dark"
                  >
                    50
                  </button>
                  <button
                    onClick={() => setShares(100)}
                    className="flex-1 py-2 bg-white/60 hover:bg-junot-gold hover:text-white border border-junot-border rounded text-sm transition-colors font-semibold text-junot-text-dark"
                  >
                    100
                  </button>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-junot-text-muted">Investissement Total</span>
                  <span className="font-bold text-lg text-junot-text-dark">{formatPrice(totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-junot-text-muted">Revenu Mensuel</span>
                  <span className="font-semibold text-junot-gold">{formatPrice(monthlyIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-junot-text-muted">Propriété</span>
                  <span className="font-semibold text-junot-text-dark">{((shares / property.totalShares) * 100).toFixed(2)}%</span>
                </div>
              </div>

              {/* Buy Button */}
              {connected ? (
                <button
                  onClick={handleBuyShares}
                  disabled={loading || property.availableShares === 0}
                  className="w-full py-4 modern-button disabled:bg-junot-cream-dark disabled:text-junot-text-muted disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors"
                >
                  {loading ? 'Traitement...' : property.availableShares === 0 ? 'Épuisé' : 'Acheter des Parts'}
                </button>
              ) : (
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg">
                  <p className="text-junot-text-muted mb-2">Connect wallet to invest</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 text-center">
                Demo mode - Transactions not on blockchain yet
              </p>
            </div>
          </div>
        </div>
      </main>
      </PageTransition>
    </div>
  );
}
