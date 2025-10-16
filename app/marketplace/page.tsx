'use client';

import Header from '@/components/Header';

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Marketplace</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-xl font-bold mb-2">Trade Property Shares</h3>
            <p className="text-gray-400">Buy and sell fractional ownership of tokenized properties</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-gray-400">Secondary market for property shares launching soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}
