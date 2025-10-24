'use client';

import Link from 'next/link';
import WalletButton from './wallet/WalletButton';
import NotificationCenter from './notifications/NotificationCenter';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-filter backdrop-blur-xl bg-junot-cream-light/80 border-b border-junot-border shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="text-2xl font-bold bg-gradient-to-r from-junot-text-dark to-junot-gold bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
              SolEsTT
            </div>
            <div className="hidden md:block px-3 py-1 bg-junot-gold/10 border border-junot-gold/40 rounded-full">
              <span className="text-xs font-semibold text-junot-gold uppercase tracking-wider">× Junot</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Biens
            </Link>
            <Link href="/compare" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Comparer
            </Link>
            <Link href="/marketplace" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Marché
            </Link>
            <Link href="/governance" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Gouvernance
            </Link>
            <Link href="/defi" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              DeFi
            </Link>
            <Link href="/portfolio" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Portfolio
            </Link>
            <Link href="/badges" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Badges
            </Link>
            <Link href="/rentals" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              Locations
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <WalletButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
