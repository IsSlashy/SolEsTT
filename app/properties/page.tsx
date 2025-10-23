'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import PropertyCard from '@/components/property/PropertyCard';
import { getAllProperties } from '@/lib/solana/mockData';

export default function Properties() {
  const allProperties = getAllProperties();
  const [filter, setFilter] = useState<'all' | 'apartment' | 'house' | 'commercial'>('all');

  // Filter properties based on type
  const properties = filter === 'all'
    ? allProperties
    : allProperties.filter(p => p.metadata.propertyType?.toLowerCase() === filter);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Properties</h1>
            <p className="text-neutral-400 mt-2 text-sm">{properties.length} tokenized properties available</p>
          </div>
          <Link
            href="/properties/create"
            className="modern-button"
          >
            + List Property
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'all' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setFilter('apartment')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'apartment' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            Apartment
          </button>
          <button
            onClick={() => setFilter('house')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'house' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            House
          </button>
          <button
            onClick={() => setFilter('commercial')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              filter === 'commercial' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            Commercial
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="modern-card p-12 text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold mb-2">No properties yet</h3>
            <p className="text-neutral-400 text-sm mb-4">Be the first to tokenize a property on SolEsTT</p>
            <Link
              href="/properties/create"
              className="text-white hover:text-neutral-300 text-sm"
            >
              List your property →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
