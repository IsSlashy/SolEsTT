'use client';

import Link from 'next/link';
import WalletButton from './wallet/WalletButton';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-filter backdrop-blur-xl bg-black/80 text-white border-b border-neutral-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-semibold transition-opacity group-hover:opacity-80">
              SolEsTT
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Properties
            </Link>
            <Link href="/marketplace" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Marketplace
            </Link>
            <Link href="/governance" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Governance
            </Link>
            <Link href="/defi" className="text-sm text-neutral-400 hover:text-white transition-colors">
              DeFi
            </Link>
            <Link href="/portfolio" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Portfolio
            </Link>
            <Link href="/rentals" className="text-sm text-neutral-400 hover:text-white transition-colors">
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
