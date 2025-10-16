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
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500 transition-all">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-700">
        {property.images && property.images.length > 0 ? (
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
        <div className="absolute top-4 right-4 bg-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
          {roi}% ROI
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{property.name}</h3>
        <p className="text-gray-400 text-sm mb-4">📍 {property.location}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {property.metadata.bedrooms && (
            <div>
              <div className="text-gray-400 text-sm">Bedrooms</div>
              <div className="font-semibold">{property.metadata.bedrooms}</div>
            </div>
          )}
          {property.metadata.squareFeet && (
            <div>
              <div className="text-gray-400 text-sm">Sq Ft</div>
              <div className="font-semibold">{property.metadata.squareFeet.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Financial Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Value</span>
            <span className="font-semibold">{formatPrice(property.totalValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price/Share</span>
            <span className="font-semibold">{formatPrice(pricePerShare)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Monthly Rent</span>
            <span className="font-semibold text-green-400">{formatPrice(property.rentPerMonth)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Funded</span>
            <span className="font-semibold">{sharesPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all"
              style={{ width: `${sharesPercentage}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {property.availableShares.toLocaleString()} of {property.totalShares.toLocaleString()} shares available
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/properties/${property.id}`}
          className="block w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-center transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
