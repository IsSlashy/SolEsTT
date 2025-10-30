'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HackathonBanner() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen the banner in this session
    const hasSeenBanner = sessionStorage.getItem('hackathon_banner_seen');

    if (!hasSeenBanner) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hackathon_banner_seen', 'true');
  };

  const content = {
    en: {
      title: '🏆 Solana Colosseum Hackathon Demo',
      subtitle: 'Cypherpunk Track - Real Estate & RWA Innovation',
      description: 'This is a demonstration platform built for the Solana Colosseum Hackathon in partnership with Junot. All features are functional on Solana Devnet with 6 deployed smart contracts.',
      features: [
        '✅ 6 Smart Contracts Live on Devnet',
        '✅ Full RWA Tokenization Platform',
        '✅ DeFi Integration (Mortgages, Collateral, Staking)',
        '✅ Complete Property Lifecycle Coverage'
      ],
      disclaimer: 'Demo version - Using Solana Devnet for testing',
      cta: 'Explore the Platform',
      learn: 'Learn More',
    },
    fr: {
      title: '🏆 Démo Hackathon Solana Colosseum',
      subtitle: 'Track Cypherpunk - Innovation Immobilière & RWA',
      description: 'Plateforme de démonstration construite pour le Hackathon Solana Colosseum en partenariat avec Junot. Toutes les fonctionnalités sont opérationnelles sur Solana Devnet avec 6 smart contracts déployés.',
      features: [
        '✅ 6 Smart Contracts Live sur Devnet',
        '✅ Plateforme Complète de Tokenization RWA',
        '✅ Intégration DeFi (Hypothèques, Collatéral, Staking)',
        '✅ Couverture Totale du Cycle Immobilier'
      ],
      disclaimer: 'Version démo - Utilise Solana Devnet pour les tests',
      cta: 'Explorer la Plateforme',
      learn: 'En Savoir Plus',
    }
  };

  const t = content[language];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="relative w-full max-w-2xl">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute -top-4 -right-4 w-10 h-10 bg-black/90 text-white border-2 border-junot-gold rounded-full flex items-center justify-center hover:bg-junot-gold/20 hover:border-white transition-colors shadow-lg z-10"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal content */}
              <div className="modern-card p-6 sm:p-8 bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border-2 border-junot-gold/30 relative overflow-hidden">
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-junot-gold/5 via-transparent to-purple-500/5 animate-pulse" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="inline-block mb-4"
                    >
                      <div className="text-6xl sm:text-7xl">🏆</div>
                    </motion.div>

                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-junot-gold via-white to-junot-gold bg-clip-text text-transparent">
                      {t.title}
                    </h2>

                    <p className="text-junot-gold font-semibold text-sm sm:text-base uppercase tracking-wider">
                      {t.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-neutral-300 text-center mb-6 leading-relaxed text-sm sm:text-base">
                    {t.description}
                  </p>

                  {/* Features */}
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    {t.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-2 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/10"
                      >
                        <span className="text-xs sm:text-sm text-neutral-200">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-6">
                    <p className="text-purple-300 text-xs sm:text-sm text-center flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      {t.disclaimer}
                    </p>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleClose}
                      className="flex-1 modern-button text-center py-3 text-sm sm:text-base font-semibold"
                    >
                      {t.cta} →
                    </button>

                    <a
                      href="https://github.com/IsSlashy/SolEsTT"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg transition-colors text-center text-sm sm:text-base font-semibold"
                      onClick={() => sessionStorage.setItem('hackathon_banner_seen', 'true')}
                    >
                      {t.learn} ↗
                    </a>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-neutral-400">6 Contracts Live</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                      <span className="text-xs text-neutral-400">Solana Devnet</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
