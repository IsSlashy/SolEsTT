'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletButton from './wallet/WalletButton';
import NotificationCenter from './notifications/NotificationCenter';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/properties', label: t('nav.properties') },
    { href: '/marketplace', label: t('nav.marketplace') },
    { href: '/rentals', label: t('nav.rentals') },
    { href: '/defi', label: t('nav.defi') },
    { href: '/governance', label: t('nav.governance') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/badges', label: t('nav.badges') },
  ];

  const isActive = (href: string) => pathname === href;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 backdrop-filter backdrop-blur-xl bg-junot-cream-light/80 border-b border-junot-border shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group" onClick={closeMobileMenu}>
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-junot-text-dark to-junot-gold bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
              SolEsTT
            </div>
            <div className="hidden sm:block px-2 sm:px-3 py-1 bg-junot-gold/10 border border-junot-gold/40 rounded-full">
              <span className="text-[10px] sm:text-xs font-semibold text-junot-gold uppercase tracking-wider">× Junot</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm text-junot-text hover:text-junot-gold transition-colors font-medium relative ${
                  isActive(link.href) ? 'text-junot-gold' : ''
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-junot-gold"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center space-x-1 bg-white/60 backdrop-blur-sm border border-junot-border rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'en'
                    ? 'bg-junot-gold text-white shadow-sm'
                    : 'text-junot-text hover:text-junot-gold'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold transition-all ${
                  language === 'fr'
                    ? 'bg-junot-gold text-white shadow-sm'
                    : 'text-junot-text hover:text-junot-gold'
                }`}
              >
                FR
              </button>
            </div>

            {/* Mobile: Compact actions */}
            <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
              <NotificationCenter />
              <WalletButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-junot-text hover:text-junot-gold transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-junot-gold text-white'
                        : 'text-junot-text hover:bg-junot-gold/10 hover:text-junot-gold'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Language Switcher */}
                <div className="sm:hidden px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-junot-text-muted font-medium">{t('nav.language')}:</span>
                    <div className="flex space-x-1 bg-white/60 backdrop-blur-sm border border-junot-border rounded-lg p-1">
                      <button
                        onClick={() => {
                          setLanguage('en');
                          closeMobileMenu();
                        }}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          language === 'en'
                            ? 'bg-junot-gold text-white shadow-sm'
                            : 'text-junot-text hover:text-junot-gold'
                        }`}
                      >
                        EN
                      </button>
                      <button
                        onClick={() => {
                          setLanguage('fr');
                          closeMobileMenu();
                        }}
                        className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                          language === 'fr'
                            ? 'bg-junot-gold text-white shadow-sm'
                            : 'text-junot-text hover:text-junot-gold'
                        }`}
                      >
                        FR
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Wallet & Notifications */}
                <div className="sm:hidden px-4 py-3 space-y-3 border-t border-junot-border mt-2 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-junot-text-muted font-medium">{t('nav.wallet')}:</span>
                    <WalletButton />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-junot-text-muted font-medium">{t('nav.notifications')}:</span>
                    <NotificationCenter />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
