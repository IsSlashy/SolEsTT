'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import PropertyCard from '@/components/property/PropertyCard';
import { getAllProperties } from '@/lib/solana/mockData';

export default function Properties() {
  const properties = getAllProperties();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Properties</h1>
            <p className="text-gray-400 mt-2">{properties.length} tokenized properties available</p>
          </div>
          <Link
            href="/properties/create"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            + List Property
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <button className="px-4 py-2 bg-purple-600 rounded-lg">All Properties</button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Apartment</button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">House</button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">Commercial</button>
        </div>

        {/* Property Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="bg-gray-800 p-12 rounded-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">No properties yet</h3>
            <p className="text-gray-400 mb-4">Be the first to tokenize a property on SolEsTT</p>
            <Link
              href="/properties/create"
              className="text-purple-400 hover:text-purple-300"
            >
              List your property →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
