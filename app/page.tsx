'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Header />

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20">
          <h1 className="text-6xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Real Estate
            </span>
            <br />
            Meets Blockchain
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Tokenize properties, invest fractionally, and manage rentals on Solana.
            The future of real estate is here.
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link
              href="/properties"
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 py-20">
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold mb-4">Tokenized Properties</h3>
            <p className="text-gray-400">
              Convert real estate into NFTs on Solana. Transparent ownership with immutable records.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-2xl font-bold mb-4">Fractional Investing</h3>
            <p className="text-gray-400">
              Own a piece of premium properties. Start investing with as little as $100.
            </p>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-4">Smart Rentals</h3>
            <p className="text-gray-400">
              Automated rent collection with USDC. No middlemen, instant settlements.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-12 border border-purple-500/20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-400">$0M+</div>
              <div className="text-gray-400 mt-2">Total Value Locked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">0</div>
              <div className="text-gray-400 mt-2">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">0</div>
              <div className="text-gray-400 mt-2">Active Investors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400">~$0.0003</div>
              <div className="text-gray-400 mt-2">Avg Transaction Fee</div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-20">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold mb-2">Connect Wallet</h4>
              <p className="text-gray-400 text-sm">Link your Solana wallet to get started</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold mb-2">Browse Properties</h4>
              <p className="text-gray-400 text-sm">Explore tokenized real estate opportunities</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold mb-2">Invest</h4>
              <p className="text-gray-400 text-sm">Buy fractional shares with SOL or USDC</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold mb-2">Earn Returns</h4>
              <p className="text-gray-400 text-sm">Receive rental income directly to your wallet</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!connected && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to explore the platform</p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-400">
        <p>Built for Solana Colosseum Hackathon with Junot</p>
        <p className="text-sm mt-2">Powered by Solana Blockchain</p>
      </footer>
    </div>
  );
}
