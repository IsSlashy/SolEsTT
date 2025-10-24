'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';
import AnimatedStats from '@/components/animations/AnimatedStats';
import PageTransition from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';

export default function Home() {
  const { connected } = useWallet();

  const stats = [
    { label: 'Valeur Totale Verrouillée', value: 0, prefix: '€', suffix: 'M+', decimals: 0 },
    { label: 'Propriétés Listées', value: 0, suffix: '', decimals: 0 },
    { label: 'Investisseurs Actifs', value: 0, suffix: '', decimals: 0 },
    { label: 'Frais Moyenne Transaction', value: 0.0003, prefix: '~€', suffix: '', decimals: 4 },
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
                SolEsTT
              </h1>
              <div className="h-1 w-32 bg-gradient-to-r from-junot-gold to-junot-gold-light mx-auto mb-6"></div>
            </motion.div>
            <h2 className="text-4xl font-serif font-normal text-junot-text-light">
              Immobilier de Prestige × Blockchain
            </h2>
            <p className="text-sm text-junot-gold mt-4 uppercase tracking-widest font-semibold">
              En partenariat avec Junot
            </p>
          </div>

          <p className="text-lg text-junot-text max-w-2xl mx-auto leading-relaxed">
            Tokenisez des propriétés d'excellence, investissez de manière fractionnée,
            et gérez vos revenus locatifs sur Solana.
            <br />
            <span className="text-junot-text-dark font-semibold">35 ans d'expertise Junot × La puissance de Solana</span>
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <Link href="/properties" className="modern-button">
              Découvrir les Biens
            </Link>
            <Link
              href="/marketplace"
              className="modern-button-secondary"
            >
              Explorer le Marché
            </Link>
          </div>
        </div>

        {/* Junot Partnership Section */}
        <div className="py-20 border-t border-junot-border">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center mb-8 text-junot-gold">
              Pourquoi Junot × Solana ?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="modern-card">
                <h3 className="text-xl font-semibold mb-3 text-junot-gold">Excellence & Héritage</h3>
                <p className="text-junot-text text-sm leading-relaxed">
                  Depuis 1984, Junot est une référence de l'immobilier de luxe en France et en Belgique.
                  Plus de 35 ans d'expertise dans l'accompagnement des transactions les plus prestigieuses.
                </p>
              </div>
              <div className="modern-card">
                <h3 className="text-xl font-semibold mb-3 text-junot-gold">Innovation Blockchain</h3>
                <p className="text-junot-text text-sm leading-relaxed">
                  La rapidité de Solana (400ms) et ses frais ultra-faibles (0,0003€) permettent
                  de démocratiser l'accès aux biens d'exception parisiens et bruxellois.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section with Junot Identity */}
        <div className="grid md:grid-cols-3 gap-6 py-20">
          <div className="modern-card group">
            <div className="text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold mb-3 text-junot-gold">Biens Tokenisés</h3>
            <p className="text-junot-text text-sm leading-relaxed">
              Transformez des propriétés d'exception en NFTs sur Solana.
              Propriété transparente avec registre immuable.
            </p>
          </div>

          <div className="modern-card group">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-semibold mb-3 text-junot-gold">Investissement Fractionné</h3>
            <p className="text-junot-text text-sm leading-relaxed">
              Accédez aux biens premium parisiens dès 100€.
              Avenue Foch, Triangle d'Or, et plus encore.
            </p>
          </div>

          <div className="modern-card group">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-3 text-junot-gold">Loyers Automatisés</h3>
            <p className="text-junot-text text-sm leading-relaxed">
              Encaissement automatique en USDC. Sans intermédiaire, règlement instantané.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <AnimatedStats stats={stats} />

        {/* How It Works */}
        <div className="py-20">
          <h2 className="text-4xl font-serif font-bold text-center mb-16 text-junot-gold">
            Comment Ça Marche
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                1
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">Connectez votre Wallet</h4>
              <p className="text-junot-text-muted text-sm">Liez votre wallet Solana pour commencer</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                2
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">Parcourez les Biens</h4>
              <p className="text-junot-text-muted text-sm">Explorez les opportunités immobilières tokenisées</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                3
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">Investissez</h4>
              <p className="text-junot-text-muted text-sm">Achetez des parts fractionnées avec SOL ou USDC</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-junot-gold to-junot-gold-light text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 transition-transform group-hover:scale-110 shadow-lg">
                4
              </div>
              <h4 className="font-semibold mb-2 text-base text-junot-text-dark">Percevez des Revenus</h4>
              <p className="text-junot-text-muted text-sm">Recevez les loyers directement sur votre wallet</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        {!connected && (
          <div className="text-center py-16 modern-card border-junot-gold">
            <h2 className="text-3xl font-serif font-bold mb-4 text-junot-gold">
              Prêt à Commencer ?
            </h2>
            <p className="text-junot-text mb-8">Connectez votre wallet pour explorer la plateforme</p>
            <div className="status-dot inline-block"></div>
          </div>
        )}
      </main>

      <footer className="relative z-10 border-t border-junot-border py-8 text-center bg-junot-cream/80 backdrop-blur-sm">
        <p className="text-junot-text text-sm">
          Construit pour le <span className="text-junot-gold font-semibold">Solana Colosseum Hackathon</span> en partenariat avec <span className="text-junot-gold font-semibold">Junot</span>
        </p>
        <p className="text-xs mt-2 text-junot-text-muted">
          Propulsé par <span className="text-junot-text-dark">Solana Blockchain</span> • 35 ans d'excellence Junot
        </p>
      </footer>
      </PageTransition>
    </div>
  );
}
