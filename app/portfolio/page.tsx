'use client';

import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Portfolio() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-8">My Portfolio</h1>

        {!connected ? (
          <div className="bg-gray-800 p-12 rounded-xl border border-gray-700 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
            <p className="text-gray-400">Connect your wallet to view your portfolio</p>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-purple-500/20 mb-8">
              <h2 className="text-2xl font-bold mb-4">Portfolio Overview</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="text-gray-400">Total Value</div>
                  <div className="text-3xl font-bold">$0</div>
                </div>
                <div>
                  <div className="text-gray-400">Properties Owned</div>
                  <div className="text-3xl font-bold">0</div>
                </div>
                <div>
                  <div className="text-gray-400">Monthly Income</div>
                  <div className="text-3xl font-bold">$0</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">No investments yet</h3>
              <p className="text-gray-400">Start investing in tokenized properties to build your portfolio</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
