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
    <div className="property-card overflow-hidden">
      {/* Property Image */}
      <div className="relative h-48 bg-neutral-900">
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
        <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold">
          {roi}% ROI
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
        <p className="text-neutral-500 text-xs mb-4">📍 {property.location}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {property.metadata.bedrooms && (
            <div>
              <div className="text-neutral-500 text-xs">Bedrooms</div>
              <div className="font-medium text-sm">{property.metadata.bedrooms}</div>
            </div>
          )}
          {property.metadata.squareFeet && (
            <div>
              <div className="text-neutral-500 text-xs">Sq Ft</div>
              <div className="font-medium text-sm">{property.metadata.squareFeet.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Financial Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500">Total Value</span>
            <span className="font-medium">{formatPrice(property.totalValue)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500">Price/Share</span>
            <span className="font-medium">{formatPrice(pricePerShare)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-500">Monthly Rent</span>
            <span className="font-medium text-green-400">{formatPrice(property.rentPerMonth)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-neutral-500">Funded</span>
            <span className="font-medium">{sharesPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-neutral-800 rounded-full h-1.5">
            <div
              className="bg-white h-1.5 rounded-full transition-all"
              style={{ width: `${sharesPercentage}%` }}
            />
          </div>
          <div className="text-xs text-neutral-600 mt-1">
            {property.availableShares.toLocaleString()} of {property.totalShares.toLocaleString()} shares available
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/properties/${property.id}`}
          className="modern-button block w-full text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
