'use client';

import Link from 'next/link';
import WalletButton from './wallet/WalletButton';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white border-b border-gray-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              SolEsTT
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="hover:text-purple-400 transition-colors">
              Properties
            </Link>
            <Link href="/marketplace" className="hover:text-purple-400 transition-colors">
              Marketplace
            </Link>
            <Link href="/portfolio" className="hover:text-purple-400 transition-colors">
              Portfolio
            </Link>
            <Link href="/rentals" className="hover:text-purple-400 transition-colors">
              Rentals
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <WalletButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
