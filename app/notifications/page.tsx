'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNotifications, NotificationType } from '@/lib/solana/hooks/useNotifications';
import PageTransition from '@/components/animations/PageTransition';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotificationsPage() {
  const { connected } = useWallet();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    requestPermission,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | NotificationType>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return '';
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case 'transaction_confirmed': return 'Transaction';
      case 'governance_vote': return 'Gouvernance';
      case 'governance_new_proposal': return 'Proposition';
      case 'rental_payment': return 'Loyer';
      case 'property_available': return 'Propriété';
      case 'badge_unlocked': return 'Badge';
      case 'marketplace_sale': return 'Marché';
      case 'price_alert': return 'Prix';
      case 'system': return 'Système';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)} j`;
    return new Date(timestamp).toLocaleDateString('fr-FR');
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      alert('Les notifications push ont été activées! Vous recevrez désormais des alertes en temps réel.');
    } else {
      alert('Les notifications push ont été refusées. Vous pouvez les activer dans les paramètres de votre navigateur.');
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="modern-card p-12 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-3xl font-bold mb-4 text-junot-text-dark">Connectez Votre Wallet</h2>
            <p className="text-junot-text-muted">Connectez votre wallet pour voir vos notifications</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <PageTransition>
        <main className="container mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-junot-text-dark">Centre de Notifications</h1>
            <p className="text-junot-text-muted">Suivez toutes vos activités blockchain en temps réel</p>
          </div>

          {/* Stats & Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Total</div>
              <div className="text-3xl font-bold text-junot-text-dark">{notifications.length}</div>
            </div>
            <div className="modern-card p-6 border-junot-gold/40">
              <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Non Lues</div>
              <div className="text-3xl font-bold text-junot-text-dark">{unreadCount}</div>
            </div>
            <div className="modern-card p-6">
              <div className="text-junot-text-muted text-sm mb-2 uppercase tracking-wider">Aujourd'hui</div>
              <div className="text-3xl font-bold text-junot-text-dark">
                {notifications.filter(n => n.timestamp > Date.now() - 86400000).length}
              </div>
            </div>
            <div className="modern-card p-6 border-junot-gold/40">
              <div className="text-junot-gold text-sm mb-2 uppercase tracking-wider">Cette Semaine</div>
              <div className="text-3xl font-bold text-junot-text-dark">
                {notifications.filter(n => n.timestamp > Date.now() - 604800000).length}
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="modern-card p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-3">
              <button
                onClick={handleEnableNotifications}
                className="px-4 py-2 bg-junot-gold hover:bg-junot-gold-dark text-white rounded-lg transition-colors font-semibold text-sm"
              >
                🔔 Activer Notifications Push
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-white/60 hover:bg-white border border-junot-border text-junot-text-dark rounded-lg transition-colors font-semibold text-sm"
                >
                  ✓ Tout marquer comme lu
                </button>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications?')) {
                    clearAll();
                  }
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-600 rounded-lg transition-colors border border-red-500/30 font-semibold text-sm"
              >
                🗑️ Tout supprimer
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === 'all' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Toutes ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === 'unread' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Non lues ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('transaction_confirmed')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === 'transaction_confirmed' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setFilter('rental_payment')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === 'rental_payment' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Loyers
            </button>
            <button
              onClick={() => setFilter('governance_new_proposal')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === 'governance_new_proposal' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Gouvernance
            </button>
            <button
              onClick={() => setFilter('badge_unlocked')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                filter === 'badge_unlocked' ? 'bg-junot-gold text-white shadow-md' : 'bg-white/60 text-junot-text hover:bg-white border border-junot-border'
              }`}
            >
              Badges
            </button>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <div className="modern-card p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-bold mb-2 text-junot-text-dark">Aucune Notification</h3>
              <p className="text-junot-text-muted">
                {filter === 'unread'
                  ? 'Toutes vos notifications ont été lues'
                  : 'Vous n\'avez aucune notification pour le moment'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`modern-card p-6 ${
                    !notif.read ? 'bg-junot-gold/5 border-junot-gold/40' : ''
                  } ${getPriorityColor(notif.priority)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-4xl flex-shrink-0">
                      {notif.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-junot-text-dark">
                              {notif.title}
                            </h3>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-junot-gold rounded-full"></div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-junot-gold/20 text-junot-gold text-xs font-semibold rounded">
                              {getTypeLabel(notif.type)}
                            </span>
                            <span className="text-xs text-junot-text-muted">
                              {getTimeAgo(notif.timestamp)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="px-3 py-1 bg-junot-gold/20 hover:bg-junot-gold/30 text-junot-gold rounded transition-colors text-xs font-semibold"
                            >
                              Marquer comme lu
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-junot-text-muted hover:text-red-500 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className="text-junot-text mb-3">
                        {notif.message}
                      </p>

                      {notif.link && (
                        <Link
                          href={notif.link}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-junot-gold hover:text-junot-gold-dark transition-colors"
                        >
                          Voir les détails →
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-6 bg-junot-gold/10 border border-junot-gold/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💡</div>
              <div>
                <h4 className="font-bold text-junot-text-dark mb-2">À propos des Notifications</h4>
                <ul className="text-sm text-junot-text space-y-1">
                  <li>• Les notifications sont mises à jour en temps réel via la blockchain Solana</li>
                  <li>• Activez les notifications push pour recevoir des alertes même quand vous n'êtes pas sur le site</li>
                  <li>• Les notifications sont stockées localement et synchronisées avec votre wallet</li>
                  <li>• Les notifications prioritaires sont marquées avec une barre de couleur (rouge = haute, jaune = moyenne, bleu = basse)</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
