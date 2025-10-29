'use client';

import Link from 'next/link';
import WalletButton from './wallet/WalletButton';
import NotificationCenter from './notifications/NotificationCenter';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

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
              {t('nav.properties')}
            </Link>
            <Link href="/marketplace" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              {t('nav.marketplace')}
            </Link>
            <Link href="/rentals" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              {t('nav.rentals')}
            </Link>
            <Link href="/defi" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              {t('nav.defi')}
            </Link>
            <Link href="/governance" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              {t('nav.governance')}
            </Link>
            <Link href="/portfolio" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              {t('nav.portfolio')}
            </Link>
            <Link href="/badges" className="text-sm text-junot-text hover:text-junot-gold transition-colors font-medium">
              {t('nav.badges')}
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-white/60 backdrop-blur-sm border border-junot-border rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-junot-gold text-white shadow-sm'
                    : 'text-junot-text hover:text-junot-gold'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'fr'
                    ? 'bg-junot-gold text-white shadow-sm'
                    : 'text-junot-text hover:text-junot-gold'
                }`}
              >
                FR
              </button>
            </div>

            <NotificationCenter />
            <WalletButton />
          </div>
        </div>
      </nav>
    </header>
  );
}
