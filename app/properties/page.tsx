'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function Properties() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Properties</h1>
          <Link
            href="/properties/create"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            + List Property
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Placeholder for property listings */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">No properties yet</h3>
            <p className="text-gray-400 mb-4">Be the first to tokenize a property on SolEstate</p>
            <Link
              href="/properties/create"
              className="text-purple-400 hover:text-purple-300"
            >
              List your property →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
