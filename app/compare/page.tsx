'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { getAllProperties, formatPrice, calculateROI, Property } from '@/lib/solana/mockData';
import PageTransition from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ComparePage() {
  const { t } = useLanguage();
  const properties = getAllProperties();
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [showSelector, setShowSelector] = useState(true);

  const toggleProperty = (property: Property) => {
    if (selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties(selectedProperties.filter(p => p.id !== property.id));
    } else {
      if (selectedProperties.length < 3) {
        setSelectedProperties([...selectedProperties, property]);
      } else {
        alert(t('compare.maxProperties'));
      }
    }
  };

  const getComparisonData = () => {
    if (selectedProperties.length === 0) return null;

    const metrics = selectedProperties.map(property => {
      const roi = calculateROI(property);
      const pricePerShare = property.totalValue / property.totalShares;
      const fundedPercent = ((property.totalShares - property.availableShares) / property.totalShares) * 100;
      const pricePerSqm = property.metadata.squareFeet
        ? property.totalValue / (property.metadata.squareFeet * 0.092903)
        : 0;

      return {
        property,
        roi,
        pricePerShare,
        fundedPercent,
        pricePerSqm,
        annualRent: property.rentPerMonth * 12,
        yieldPercent: ((property.rentPerMonth * 12) / property.totalValue) * 100,
      };
    });

    // Find best values for highlighting
    const bestROI = Math.max(...metrics.map(m => m.roi));
    const lowestPrice = Math.min(...metrics.map(m => m.property.totalValue));
    const highestYield = Math.max(...metrics.map(m => m.yieldPercent));
    const lowestPricePerSqm = Math.min(...metrics.filter(m => m.pricePerSqm > 0).map(m => m.pricePerSqm));

    return { metrics, bestROI, lowestPrice, highestYield, lowestPricePerSqm };
  };

  const comparisonData = getComparisonData();

  return (
    <div className="min-h-screen">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">{t('compare.title')}</h1>
            <p className="text-junot-text-muted">{t('compare.subtitle')}</p>
          </div>

          {/* Selection Info */}
          <div className="modern-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-junot-text-dark mb-1">
                  {t('compare.selectedProperties')}: {selectedProperties.length} / 3
                </h3>
                <p className="text-sm text-junot-text-muted">
                  {selectedProperties.length === 0 && t('compare.selectBelow')}
                  {selectedProperties.length > 0 && selectedProperties.length < 2 && t('compare.selectAtLeast2')}
                  {selectedProperties.length >= 2 && t('compare.comparisonReady')}
                </p>
              </div>
              {selectedProperties.length > 0 && (
                <button
                  onClick={() => setSelectedProperties([])}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-lg transition-colors border border-red-500/30 font-semibold"
                >
                  {t('compare.reset')}
                </button>
              )}
            </div>

            {selectedProperties.length > 0 && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {selectedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center gap-2 bg-junot-gold/10 border border-junot-gold/30 px-4 py-2 rounded-lg"
                  >
                    <span className="text-sm font-semibold text-junot-text-dark">{property.name}</span>
                    <button
                      onClick={() => toggleProperty(property)}
                      className="text-junot-text-muted hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Property Selector */}
          {showSelector && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-junot-text-dark">{t('compare.selectProperties')}</h2>
                <button
                  onClick={() => setShowSelector(!showSelector)}
                  className="text-junot-text-muted hover:text-junot-gold transition-colors text-sm"
                >
                  {showSelector ? t('compare.hide') : t('compare.show')}
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => {
                  const isSelected = selectedProperties.find(p => p.id === property.id);
                  const roi = calculateROI(property);

                  return (
                    <motion.div
                      key={property.id}
                      whileHover={{ scale: 1.02 }}
                      className={`modern-card p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-2 border-junot-gold shadow-lg shadow-junot-gold/20' : 'hover:border-junot-gold/40'
                      }`}
                      onClick={() => toggleProperty(property)}
                    >
                      {/* Image */}
                      <div className="w-full h-40 bg-junot-cream-dark rounded-lg overflow-hidden mb-4">
                        {property.images[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                            🏠
                          </div>
                        )}
                      </div>

                      {/* Checkbox */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'bg-junot-gold border-junot-gold' : 'border-junot-border'
                        }`}>
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </div>
                        <h3 className="text-sm font-bold text-junot-text-dark flex-1">{property.name}</h3>
                      </div>

                      <p className="text-xs text-junot-text-muted mb-2">📍 {property.location}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-junot-text-muted">Prix</div>
                          <div className="text-sm font-bold text-junot-text-dark">{formatPrice(property.totalValue)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-junot-text-muted">ROI</div>
                          <div className="text-sm font-bold text-junot-gold">{roi}%</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {comparisonData && selectedProperties.length >= 2 && (
            <div className="modern-card overflow-hidden">
              <div className="p-6 border-b border-junot-border bg-junot-gold/5">
                <h2 className="text-2xl font-bold text-junot-text-dark">{t('compare.comparisonTable')}</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/60 backdrop-blur-sm">
                    <tr>
                      <th className="text-left p-4 font-semibold text-junot-text-dark sticky left-0 bg-white/60 backdrop-blur-sm">
                        {t('compare.criteria')}
                      </th>
                      {selectedProperties.map((property) => (
                        <th key={property.id} className="text-center p-4 font-semibold text-junot-text-dark min-w-[250px]">
                          <Link href={`/properties/${property.id}`} className="hover:text-junot-gold transition-colors">
                            {property.name}
                          </Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Image */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        {t('compare.image')}
                      </td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center">
                          <div className="w-full h-32 bg-junot-cream-dark rounded-lg overflow-hidden mx-auto">
                            {property.images[0] ? (
                              <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Location */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        📍 {t('compare.location')}
                      </td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center text-junot-text">
                          {property.location}
                        </td>
                      ))}
                    </tr>

                    {/* Total Value */}
                    <tr className="border-t border-junot-border bg-junot-gold/5">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        💰 {t('compare.totalValue')}
                      </td>
                      {comparisonData.metrics.map((metric) => (
                        <td key={metric.property.id} className="p-4 text-center">
                          <div className={`font-bold ${
                            metric.property.totalValue === comparisonData.lowestPrice ? 'text-junot-gold' : 'text-junot-text-dark'
                          }`}>
                            {formatPrice(metric.property.totalValue)}
                          </div>
                          {metric.property.totalValue === comparisonData.lowestPrice && (
                            <div className="text-xs text-junot-gold mt-1">{t('compare.badges.lowestPrice')}</div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* ROI */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        📈 {t('compare.annualROI')}
                      </td>
                      {comparisonData.metrics.map((metric) => (
                        <td key={metric.property.id} className="p-4 text-center">
                          <div className={`font-bold text-2xl ${
                            metric.roi === comparisonData.bestROI ? 'text-junot-gold' : 'text-junot-text-dark'
                          }`}>
                            {metric.roi}%
                          </div>
                          {metric.roi === comparisonData.bestROI && (
                            <div className="text-xs text-junot-gold mt-1">{t('compare.badges.bestROI')}</div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Monthly Rent */}
                    <tr className="border-t border-junot-border bg-junot-gold/5">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        🏠 {t('compare.monthlyRent')}
                      </td>
                      {comparisonData.metrics.map((metric) => (
                        <td key={metric.property.id} className="p-4 text-center font-bold text-junot-text-dark">
                          {formatPrice(metric.property.rentPerMonth)}
                        </td>
                      ))}
                    </tr>

                    {/* Annual Yield */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        💵 {t('compare.annualYield')}
                      </td>
                      {comparisonData.metrics.map((metric) => (
                        <td key={metric.property.id} className="p-4 text-center">
                          <div className={`font-bold ${
                            metric.yieldPercent === comparisonData.highestYield ? 'text-junot-gold' : 'text-junot-text-dark'
                          }`}>
                            {formatPrice(metric.annualRent)}
                          </div>
                          <div className="text-sm text-junot-text-muted mt-1">
                            ({metric.yieldPercent.toFixed(2)}%)
                          </div>
                          {metric.yieldPercent === comparisonData.highestYield && (
                            <div className="text-xs text-junot-gold mt-1">{t('compare.badges.highestYield')}</div>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Total Shares */}
                    <tr className="border-t border-junot-border bg-junot-gold/5">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        📊 {t('compare.totalShares')}
                      </td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center font-bold text-junot-text-dark">
                          {property.totalShares.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* Available Shares */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        ✅ {t('compare.availableShares')}
                      </td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center font-bold text-junot-text-dark">
                          {property.availableShares.toLocaleString()}
                        </td>
                      ))}
                    </tr>

                    {/* Price per Share */}
                    <tr className="border-t border-junot-border bg-junot-gold/5">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        💎 {t('compare.pricePerShare')}
                      </td>
                      {comparisonData.metrics.map((metric) => (
                        <td key={metric.property.id} className="p-4 text-center font-bold text-junot-text-dark">
                          {formatPrice(metric.pricePerShare)}
                        </td>
                      ))}
                    </tr>

                    {/* Funding Progress */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        🎯 {t('compare.funding')}
                      </td>
                      {comparisonData.metrics.map((metric) => (
                        <td key={metric.property.id} className="p-4">
                          <div className="w-full bg-junot-cream-dark rounded-full h-3 mb-2">
                            <div
                              className="bg-gradient-to-r from-junot-gold to-junot-gold-light h-3 rounded-full transition-all shadow-md"
                              style={{ width: `${metric.fundedPercent}%` }}
                            />
                          </div>
                          <div className="text-sm text-center font-bold text-junot-text-dark">
                            {metric.fundedPercent.toFixed(1)}%
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Bedrooms */}
                    {selectedProperties.some(p => p.metadata.bedrooms) && (
                      <tr className="border-t border-junot-border bg-junot-gold/5">
                        <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                          🛏️ {t('compare.bedrooms')}
                        </td>
                        {selectedProperties.map((property) => (
                          <td key={property.id} className="p-4 text-center font-bold text-junot-text-dark">
                            {property.metadata.bedrooms || '-'}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Bathrooms */}
                    {selectedProperties.some(p => p.metadata.bathrooms) && (
                      <tr className="border-t border-junot-border">
                        <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                          🚿 {t('compare.bathrooms')}
                        </td>
                        {selectedProperties.map((property) => (
                          <td key={property.id} className="p-4 text-center font-bold text-junot-text-dark">
                            {property.metadata.bathrooms || '-'}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Square Meters */}
                    {selectedProperties.some(p => p.metadata.squareFeet) && (
                      <tr className="border-t border-junot-border bg-junot-gold/5">
                        <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                          📐 {t('compare.surface')}
                        </td>
                        {selectedProperties.map((property) => (
                          <td key={property.id} className="p-4 text-center font-bold text-junot-text-dark">
                            {property.metadata.squareFeet
                              ? `${Math.round(property.metadata.squareFeet * 0.092903)} m²`
                              : '-'
                            }
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Price per sqm */}
                    {selectedProperties.some(p => p.metadata.squareFeet) && (
                      <tr className="border-t border-junot-border">
                        <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                          💶 {t('compare.pricePerSqm')}
                        </td>
                        {comparisonData.metrics.map((metric) => (
                          <td key={metric.property.id} className="p-4 text-center">
                            {metric.pricePerSqm > 0 ? (
                              <>
                                <div className={`font-bold ${
                                  metric.pricePerSqm === comparisonData.lowestPricePerSqm ? 'text-junot-gold' : 'text-junot-text-dark'
                                }`}>
                                  {formatPrice(metric.pricePerSqm)}
                                </div>
                                {metric.pricePerSqm === comparisonData.lowestPricePerSqm && (
                                  <div className="text-xs text-junot-gold mt-1">{t('compare.badges.lowestPricePerSqm')}</div>
                                )}
                              </>
                            ) : '-'}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Year Built */}
                    {selectedProperties.some(p => p.metadata.yearBuilt) && (
                      <tr className="border-t border-junot-border bg-junot-gold/5">
                        <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                          📅 {t('compare.yearBuilt')}
                        </td>
                        {selectedProperties.map((property) => (
                          <td key={property.id} className="p-4 text-center font-bold text-junot-text-dark">
                            {property.metadata.yearBuilt || '-'}
                          </td>
                        ))}
                      </tr>
                    )}

                    {/* Action Buttons */}
                    <tr className="border-t border-junot-border">
                      <td className="p-4 font-semibold text-junot-text-dark sticky left-0 bg-junot-cream backdrop-blur-sm">
                        {t('compare.actions')}
                      </td>
                      {selectedProperties.map((property) => (
                        <td key={property.id} className="p-4 text-center">
                          <Link
                            href={`/properties/${property.id}`}
                            className="modern-button inline-block px-6 py-3 rounded-lg font-semibold"
                          >
                            {t('compare.viewDetails')}
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedProperties.length < 2 && (
            <div className="modern-card p-12 text-center">
              <div className="text-6xl mb-4">⚖️</div>
              <h3 className="text-2xl font-bold mb-2 text-junot-text-dark">{t('compare.emptyState.title')}</h3>
              <p className="text-junot-text-muted">
                {t('compare.emptyState.description')}
              </p>
            </div>
          )}
        </main>
      </PageTransition>
    </div>
  );
}
