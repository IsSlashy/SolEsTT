'use client';

import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Rentals() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">Rental Payments</h1>

        {!connected ? (
          <div className="bg-gray-800 p-12 rounded-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400">Connect your wallet to manage rental payments</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">As Tenant</h2>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💰</div>
                <p className="text-gray-400">No active rental agreements</p>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">As Landlord</h2>
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏠</div>
                <p className="text-gray-400">No properties rented out</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
