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
      <div className="min-h-screen  text-white">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
            <button
              onClick={() => router.push('/properties')}
              className="text-white hover:text-neutral-300"
            >
              ← Back to Properties
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
          className="text-white hover:text-neutral-300 mb-6"
        >
          ← Back to Properties
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* View Mode Selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setViewMode('image')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === 'image' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                📸 Photos
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === '3d' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                🎨 3D View
              </button>
              <button
                onClick={() => setViewMode('ar')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  viewMode === 'ar' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
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
                  <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
                  <p className="text-neutral-400">📍 {property.location}</p>
                </div>
                <div className="bg-white text-black px-4 py-2 rounded-lg">
                  <div className="text-2xl font-bold">{roi}%</div>
                  <div className="text-sm">Annual ROI</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-neutral-800">
                {property.metadata.bedrooms && (
                  <div>
                    <div className="text-neutral-400 text-sm">Bedrooms</div>
                    <div className="text-2xl font-bold">{property.metadata.bedrooms}</div>
                  </div>
                )}
                {property.metadata.bathrooms && (
                  <div>
                    <div className="text-neutral-400 text-sm">Bathrooms</div>
                    <div className="text-2xl font-bold">{property.metadata.bathrooms}</div>
                  </div>
                )}
                {property.metadata.squareFeet && (
                  <div>
                    <div className="text-neutral-400 text-sm">Square Feet</div>
                    <div className="text-2xl font-bold">{property.metadata.squareFeet.toLocaleString()}</div>
                  </div>
                )}
                {property.metadata.yearBuilt && (
                  <div>
                    <div className="text-neutral-400 text-sm">Year Built</div>
                    <div className="text-2xl font-bold">{property.metadata.yearBuilt}</div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-neutral-300 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="modern-card p-8">
              <h2 className="text-2xl font-bold mb-6">Financial Overview</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-neutral-400 text-sm mb-2">Total Property Value</div>
                  <div className="text-2xl font-bold">{formatPrice(property.totalValue)}</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-sm mb-2">Monthly Rent</div>
                  <div className="text-2xl font-bold text-green-400">{formatPrice(property.rentPerMonth)}</div>
                </div>
                <div>
                  <div className="text-neutral-400 text-sm mb-2">Annual Return</div>
                  <div className="text-2xl font-bold text-white">{formatPrice(property.rentPerMonth * 12)}</div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-400">Total Shares</span>
                  <span className="font-semibold">{property.totalShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-400">Available Shares</span>
                  <span className="font-semibold">{property.availableShares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Price per Share</span>
                  <span className="font-semibold">{formatPrice(pricePerShare)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Investment Card */}
          <div className="lg:col-span-1">
            <div className="modern-card p-6 sticky top-6">
              <h3 className="text-2xl font-bold mb-6">Invest Now</h3>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-400">Funded</span>
                  <span className="font-semibold">{sharesPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-white text-black h-3 rounded-full transition-all"
                    style={{ width: `${sharesPercentage}%` }}
                  />
                </div>
                <div className="text-sm text-neutral-400 mt-2">
                  {property.availableShares.toLocaleString()} shares remaining
                </div>
              </div>

              {/* Share Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Number of Shares</label>
                <input
                  type="number"
                  min="1"
                  max={property.availableShares}
                  value={shares}
                  onChange={(e) => setShares(Math.max(1, Math.min(property.availableShares, Number(e.target.value))))}
                  className="w-full px-4 py-3 bg-gray-900 border border-neutral-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setShares(10)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    10
                  </button>
                  <button
                    onClick={() => setShares(50)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    50
                  </button>
                  <button
                    onClick={() => setShares(100)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    100
                  </button>
                </div>
              </div>

              {/* Investment Summary */}
              <div className="bg-gray-900 p-4 rounded-lg mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Investment</span>
                  <span className="font-bold text-lg">{formatPrice(totalCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Monthly Income</span>
                  <span className="font-semibold text-green-400">{formatPrice(monthlyIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Ownership</span>
                  <span className="font-semibold">{((shares / property.totalShares) * 100).toFixed(2)}%</span>
                </div>
              </div>

              {/* Buy Button */}
              {connected ? (
                <button
                  onClick={handleBuyShares}
                  disabled={loading || property.availableShares === 0}
                  className="w-full py-4 modern-button disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-colors"
                >
                  {loading ? 'Processing...' : property.availableShares === 0 ? 'Sold Out' : 'Buy Shares'}
                </button>
              ) : (
                <div className="text-center p-4 bg-gray-900 rounded-lg">
                  <p className="text-neutral-400 mb-2">Connect wallet to invest</p>
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
