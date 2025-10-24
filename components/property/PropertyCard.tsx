'use client';

import Link from 'next/link';
import { Property } from '@/lib/solana/types';
import { calculateROI, formatPrice } from '@/lib/solana/mockData';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const roi = calculateROI(property);
  const pricePerShare = property.totalValue / property.totalShares;
  const sharesPercentage = ((property.totalShares - property.availableShares) / property.totalShares) * 100;

  return (
    <div className="property-card overflow-hidden bg-white/60 backdrop-blur-sm">
      {/* Property Image */}
      <div className="relative h-48 bg-junot-cream-dark">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            🏠
          </div>
        )}
        <div className="absolute top-4 right-4 bg-junot-gold text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {roi}% ROI
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1 text-junot-text-dark">{property.name}</h3>
        <p className="text-junot-text-muted text-xs mb-4">📍 {property.location}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {property.metadata.bedrooms && (
            <div>
              <div className="text-junot-text-muted text-xs">Chambres</div>
              <div className="font-medium text-sm text-junot-text-dark">{property.metadata.bedrooms}</div>
            </div>
          )}
          {property.metadata.squareFeet && (
            <div>
              <div className="text-junot-text-muted text-xs">Surface</div>
              <div className="font-medium text-sm text-junot-text-dark">{Math.round(property.metadata.squareFeet * 0.092903)} m²</div>
            </div>
          )}
        </div>

        {/* Financial Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-junot-text-muted">Valeur Totale</span>
            <span className="font-medium text-junot-text-dark">{formatPrice(property.totalValue)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-junot-text-muted">Prix/Part</span>
            <span className="font-medium text-junot-text-dark">{formatPrice(pricePerShare)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-junot-text-muted">Loyer Mensuel</span>
            <span className="font-medium text-junot-gold">{formatPrice(property.rentPerMonth)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-junot-text-muted">Financé</span>
            <span className="font-medium text-junot-text-dark">{sharesPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-junot-cream-dark rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-junot-gold to-junot-gold-light h-1.5 rounded-full transition-all"
              style={{ width: `${sharesPercentage}%` }}
            />
          </div>
          <div className="text-xs text-junot-text-muted mt-1">
            {property.availableShares.toLocaleString()} sur {property.totalShares.toLocaleString()} parts disponibles
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/properties/${property.id}`}
          className="modern-button block w-full text-center"
        >
          Voir Détails
        </Link>
      </div>
    </div>
  );
}
