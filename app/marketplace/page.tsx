'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import { getAllProperties, formatPrice, calculateROI } from '@/lib/solana/mockData';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Marketplace() {
  const { t } = useLanguage();
  const properties = getAllProperties();
  const [sortBy, setSortBy] = useState<'price' | 'roi' | 'funded'>('roi');

  // Generate mock listings for secondary market
  let mockListings = properties.flatMap(property => {
    const pricePerShare = property.totalValue / property.totalShares;
    const soldShares = property.totalShares - property.availableShares;
    const roi = calculateROI(property);
    const fundedPercent = ((property.totalShares - property.availableShares) / property.totalShares) * 100;

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
        roi,
        fundedPercent,
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
        roi,
        fundedPercent,
      },
    ];
  });

  // Sort listings based on selected filter
  mockListings = [...mockListings].sort((a, b) => {
    if (sortBy === 'roi') return b.roi - a.roi;
    if (sortBy === 'price') return a.pricePerShare - b.pricePerShare;
    if (sortBy === 'funded') return b.fundedPercent - a.fundedPercent;
    return 0;
  });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">{t('marketplace.title')}</h1>
          <p className="text-junot-text-muted text-sm">{t('marketplace.subtitle')}</p>
        </div>

        {/* Market Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-xs mb-2 uppercase tracking-wider">{t('marketplace.stats.volume24h')}</div>
            <div className="text-2xl font-bold text-junot-text-dark">127 450€</div>
            <div className="text-junot-gold text-xs mt-1 font-semibold">+12.5%</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-xs mb-2 uppercase tracking-wider">{t('marketplace.stats.activeListings')}</div>
            <div className="text-2xl font-bold text-junot-text-dark">{mockListings.length}</div>
            <div className="text-junot-text-muted text-xs mt-1">{properties.length} {t('marketplace.stats.properties')}</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-xs mb-2 uppercase tracking-wider">{t('marketplace.stats.avgChange')}</div>
            <div className="text-2xl font-bold text-junot-text-dark">+3.2%</div>
            <div className="text-junot-gold text-xs mt-1 font-semibold">{t('marketplace.stats.last7Days')}</div>
          </div>
          <div className="modern-card p-6">
            <div className="text-junot-text-muted text-xs mb-2 uppercase tracking-wider">{t('marketplace.stats.totalTrades')}</div>
            <div className="text-2xl font-bold text-junot-text-dark">1 234</div>
            <div className="text-junot-text-muted text-xs mt-1">{t('marketplace.stats.thisMonth')}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSortBy('roi')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'roi' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            {t('marketplace.filters.bestROI')}
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'price' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            {t('marketplace.filters.lowestPrice')}
          </button>
          <button
            onClick={() => setSortBy('funded')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              sortBy === 'funded' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            {t('marketplace.filters.mostFunded')}
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
                className="modern-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 flex-1">
                    {/* Property Info */}
                    <div className="w-20 h-20 bg-neutral-900 rounded-lg overflow-hidden flex-shrink-0">
                      {property.images[0] ? (
                        <img
                          src={property.images[0]}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🏠
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <Link
                        href={`/properties/${property.id}`}
                        className="text-lg font-semibold hover:text-neutral-300 transition-colors"
                      >
                        {listing.propertyName}
                      </Link>
                      <div className="text-xs text-neutral-500 mt-1">
                        {t('marketplace.listing.seller')}: {listing.seller}
                      </div>
                      <div className="flex gap-4 mt-2">
                        <div className="text-xs">
                          <span className="text-neutral-500">{t('marketplace.listing.roi')}:</span>{' '}
                          <span className="font-medium">{calculateROI(property)}%</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-neutral-500">{t('marketplace.listing.location')}:</span>{' '}
                          <span className="font-medium">{property.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Listing Details */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-neutral-500 text-xs">{t('marketplace.listing.sharesAvailable')}</div>
                      <div className="text-xl font-bold">{listing.shares.toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-neutral-500 text-xs">{t('marketplace.listing.pricePerShare')}</div>
                      <div className="text-xl font-bold">{formatPrice(listing.pricePerShare)}</div>
                      <div className={`text-xs mt-1 ${
                        listing.trending === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {listing.change}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-neutral-500 text-xs">{t('marketplace.listing.totalValue')}</div>
                      <div className="text-xl font-bold">{formatPrice(listing.totalPrice)}</div>
                    </div>

                    <button className="modern-button whitespace-nowrap">
                      {t('marketplace.listing.buyNow')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 p-6 modern-card text-center">
          <p className="text-junot-text-muted text-sm">
            📊 {t('marketplace.demoNotice')}
          </p>
        </div>
      </main>
    </div>
  );
}
