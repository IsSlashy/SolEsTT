'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getAllProperties, formatPrice, calculateROI } from '@/lib/solana/mockData';

export default function Marketplace() {
  const properties = getAllProperties();
  const [sortBy, setSortBy] = useState<'price' | 'roi' | 'funded'>('roi');

  // Generate mock listings for secondary market
  const mockListings = properties.flatMap(property => {
    const pricePerShare = property.totalValue / property.totalShares;
    const soldShares = property.totalShares - property.availableShares;

    // Create 2-3 listings per property
    return [
      {
        id: `${property.id}-1`,
        propertyId: property.id,
        propertyName: property.name,
        seller: '7fUA...oLS7',
        shares: Math.floor(soldShares * 0.1),
        pricePerShare: pricePerShare * 1.05, // 5% premium
        totalPrice: pricePerShare * 1.05 * Math.floor(soldShares * 0.1),
        change: '+5%',
        trending: 'up' as const,
      },
      {
        id: `${property.id}-2`,
        propertyId: property.id,
        propertyName: property.name,
        seller: 'GZWq...NcML',
        shares: Math.floor(soldShares * 0.05),
        pricePerShare: pricePerShare * 0.98, // 2% discount
        totalPrice: pricePerShare * 0.98 * Math.floor(soldShares * 0.05),
        change: '-2%',
        trending: 'down' as const,
      },
    ];
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">Trade property shares on the secondary market</p>
        </div>

        {/* Market Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">24h Volume</div>
            <div className="text-2xl font-bold">$127,450</div>
            <div className="text-green-400 text-sm mt-1">+12.5%</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Active Listings</div>
            <div className="text-2xl font-bold">{mockListings.length}</div>
            <div className="text-gray-400 text-sm mt-1">Across {properties.length} properties</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Avg. Price Change</div>
            <div className="text-2xl font-bold">+3.2%</div>
            <div className="text-green-400 text-sm mt-1">Last 7 days</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="text-gray-400 text-sm mb-2">Total Trades</div>
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-purple-400 text-sm mt-1">This month</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSortBy('roi')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'roi' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Best ROI
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'price' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Lowest Price
          </button>
          <button
            onClick={() => setSortBy('funded')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              sortBy === 'funded' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            Most Funded
          </button>
        </div>

        {/* Listings */}
        <div className="space-y-4">
          {mockListings.map((listing) => {
            const property = properties.find(p => p.id === listing.propertyId);
            if (!property) return null;

            return (
              <div
                key={listing.id}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Property Info */}
                    <div className="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {property.images[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🏠
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-xl font-bold hover:text-purple-400 transition-colors"
                      >
                        {listing.propertyName}
                      </Link>
                      <div className="text-sm text-gray-400 mt-1">
                        Seller: {listing.seller}
                      </div>
                      <div className="flex gap-4 mt-2">
                        <div className="text-sm">
                          <span className="text-gray-400">ROI:</span>{' '}
                          <span className="font-semibold text-purple-400">{calculateROI(property)}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Location:</span>{' '}
                          <span className="font-semibold">{property.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Listing Details */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-gray-400 text-sm">Shares Available</div>
                      <div className="text-2xl font-bold">{listing.shares.toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-gray-400 text-sm">Price per Share</div>
                      <div className="text-2xl font-bold">{formatPrice(listing.pricePerShare)}</div>
                      <div className={`text-sm mt-1 ${
                        listing.trending === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {listing.change}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-gray-400 text-sm">Total Value</div>
                      <div className="text-2xl font-bold">{formatPrice(listing.totalPrice)}</div>
                    </div>

                    <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors whitespace-nowrap">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-6 bg-purple-900/30 border border-purple-500/30 rounded-xl text-center">
          <p className="text-purple-300">
            📊 Demo Mode - Marketplace data is simulated. Real trading will be available once blockchain integration is complete.
          </p>
        </div>
      </main>
    </div>
  );
}
