'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import AnimatedStats from '@/components/animations/AnimatedStats';
import PageTransition from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { connected } = useWallet();
  const { t } = useLanguage();

  const stats = [
    { label: t('home.stats.tvl'), value: 0, prefix: '€', suffix: 'M+', decimals: 0 },
    { label: t('home.stats.properties'), value: 0, suffix: '', decimals: 0 },
    { label: t('home.stats.investors'), value: 0, suffix: '', decimals: 0 },
    { label: t('home.stats.fees'), value: 0.0003, prefix: '~€', suffix: '', decimals: 4 },
  ];

  return (
    <div className="min-h-screen relative">
      <Header />

      <PageTransition>
      <main className="container mx-auto px-6 py-16 relative z-10">
        {/* Hero Section with Junot Branding */}
        <div className="text-center space-y-8 py-20 fade-in-up visible">
          <div className="inline-block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-7xl font-bold mb-4 bg-gradient-to-r from-junot-text-dark via-junot-gold to-junot-gold-light bg-clip-text text-transparent">
                {t('home.title')}
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-junot-gold to-junot-gold-light mx-auto mb-6"></div>
            </motion.div>
            <h2 className="text-4xl font-serif font-normal text-junot-text-light">
              {t('home.subtitle')}
            </h2>
            <p className="text-sm text-junot-gold mt-4 uppercase tracking-widest font-semibold">
              {t('home.partnership')}
            </p>
          </div>

          <p className="text-lg text-junot-text max-w-2xl mx-auto leading-relaxed">
            {t('home.description')}
            <br />
            <span className="text-junot-text-dark font-semibold">{t('home.expertiseTag')}</span>
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/properties" className="modern-button">
              {t('home.discoverBtn')}
            </Link>
            <Link
              href="/marketplace"
              className="modern-button-secondary"
            >
              {t('home.exploreBtn')}
            </Link>
          </div>
        </div>

        {/* Junot Partnership Section */}
        <div className="py-20 border-t border-junot-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-8 text-junot-gold">
              {t('home.whyJunot')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="modern-card">
                <h3 className="text-xl font-semibold mb-3 text-junot-gold">{t('home.excellenceTitle')}</h3>
                <p className="text-junot-text text-sm leading-relaxed">
                  {t('home.excellenceDesc')}
                </p>
              </div>
              <div className="modern-card">
                <h3 className="text-xl font-semibold mb-3 text-junot-gold">{t('home.innovationTitle')}</h3>
                <p className="text-junot-text text-sm leading-relaxed">
                  {t('home.innovationDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section with Junot Identity */}
        <div className="grid md:grid-cols-3 gap-6 py-20">
          <div className="modern-card group">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-3 text-junot-gold">{t('home.feature1Title')}</h3>
            <p className="text-junot-text text-sm leading-relaxed">
              {t('home.feature1Desc')}
            </p>
          </div>

          <div className="modern-card group">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-3 text-junot-gold">{t('home.feature2Title')}</h3>
            <p className="text-junot-text text-sm leading-relaxed">
              {t('home.feature2Desc')}
            </p>
          </div>

          <div className="modern-card group">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-junot-gold">{t('home.feature3Title')}</h3>
            <p className="text-junot-text text-sm leading-relaxed">
              {t('home.feature3Desc')}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <AnimatedStats stats={stats} />

        {/* How It Works */}
        <div className="py-20">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-junot-gold">
            {t('home.howItWorks')}
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                1
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">{t('home.step1Title')}</h4>
              <p className="text-junot-text-muted text-sm">{t('home.step1Desc')}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                2
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">{t('home.step2Title')}</h4>
              <p className="text-junot-text-muted text-sm">{t('home.step2Desc')}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                3
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">{t('home.step3Title')}</h4>
              <p className="text-junot-text-muted text-sm">{t('home.step3Desc')}</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                4
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">{t('home.step4Title')}</h4>
              <p className="text-junot-text-muted text-sm">{t('home.step4Desc')}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!connected && (
          <div className="text-center py-16 modern-card border-junot-gold">
            <h2 className="text-3xl font-serif font-bold mb-4 text-junot-gold">
              {t('home.readyTitle')}
            </h2>
            <p className="text-junot-text mb-8">{t('home.readyDesc')}</p>
            <div className="status-dot inline-block"></div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-junot-border py-8 text-center bg-junot-cream/80 backdrop-blur-sm">
        <p className="text-junot-text text-sm">
          {t('home.footerBuilt')} <span className="text-junot-gold font-semibold">{t('home.footerHackathon')}</span> {t('home.footerPartnership')} <span className="text-junot-gold font-semibold">Junot</span>
        </p>
        <p className="text-xs mt-2 text-junot-text-muted">
          {t('home.footerPowered')} <span className="text-junot-text-dark">Solana Blockchain</span> • {t('home.footerExpertise')}
        </p>
      </footer>
      </PageTransition>
    </div>
  );
}
