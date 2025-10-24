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
            <h1 className="text-4xl font-bold text-junot-text-dark">Biens Immobiliers</h1>
            <p className="text-junot-text-muted mt-2 text-sm">{properties.length} propriétés tokenisées disponibles</p>
          </div>
          <Link
            href="/properties/create"
            className="modern-button"
          >
            + Lister un Bien
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${
              filter === 'all' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Tous les Biens
          </button>
          <button
            onClick={() => setFilter('apartment')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${
              filter === 'apartment' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Appartements
          </button>
          <button
            onClick={() => setFilter('house')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${
              filter === 'house' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
            }`}
          >
            Maisons
          </button>
          <button
            onClick={() => setFilter('commercial')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${
              filter === 'commercial' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
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
            <h3 className="text-xl font-semibold mb-2 text-junot-text-dark">Aucune propriété</h3>
            <p className="text-junot-text-muted text-sm mb-4">Soyez le premier à tokeniser un bien sur SolEsTT</p>
            <Link
              href="/properties/create"
              className="text-junot-gold hover:text-junot-gold-light text-sm font-semibold"
            >
              Listez votre bien →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
