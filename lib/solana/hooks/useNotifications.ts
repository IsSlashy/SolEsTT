'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export type NotificationType =
  | 'transaction_confirmed'
  | 'governance_vote'
  | 'governance_new_proposal'
  | 'rental_payment'
  | 'property_available'
  | 'badge_unlocked'
  | 'marketplace_sale'
  | 'price_alert'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  icon: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
}

export function useNotifications() {
  const { connected, publicKey } = useWallet();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate notifications - in production, these would come from WebSocket or blockchain events
  useEffect(() => {
    if (connected) {
      // Mock notifications for demo
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'transaction_confirmed',
          title: 'Transaction Confirmée',
          message: 'Votre achat de 50 parts dans "Appartement Haussmannien" a été confirmé sur la blockchain.',
          timestamp: Date.now() - 60000, // 1 minute ago
          read: false,
          icon: '✅',
          link: '/portfolio',
          priority: 'high',
        },
        {
          id: '2',
          type: 'rental_payment',
          title: 'Paiement de Loyer Reçu',
          message: 'Vous avez reçu 125€ de revenus locatifs pour "Appartement Haussmannien".',
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false,
          icon: '💰',
          link: '/rentals',
          priority: 'medium',
        },
        {
          id: '3',
          type: 'governance_new_proposal',
          title: 'Nouvelle Proposition de Gouvernance',
          message: 'Une nouvelle proposition concernant "Villa Côte d\'Azur" nécessite votre vote.',
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false,
          icon: '🗳️',
          link: '/governance',
          priority: 'medium',
        },
        {
          id: '4',
          type: 'badge_unlocked',
          title: 'Nouveau Badge Débloqué!',
          message: 'Félicitations! Vous avez débloqué le badge "Premier Pas" 🏠',
          timestamp: Date.now() - 86400000, // 1 day ago
          read: true,
          icon: '🏆',
          link: '/badges',
          priority: 'low',
        },
        {
          id: '5',
          type: 'property_available',
          title: 'Nouvelle Propriété Disponible',
          message: 'Un nouveau bien vient d\'être listé: "Penthouse Neuilly-sur-Seine" - ROI 7.2%',
          timestamp: Date.now() - 86400000 * 2, // 2 days ago
          read: true,
          icon: '🏠',
          link: '/properties',
          priority: 'low',
        },
        {
          id: '6',
          type: 'marketplace_sale',
          title: 'Parts Vendues sur le Marché',
          message: '20 parts de "Villa Méditerranée" ont été vendues à 105% du prix initial.',
          timestamp: Date.now() - 86400000 * 3, // 3 days ago
          read: true,
          icon: '📈',
          link: '/marketplace',
          priority: 'medium',
        },
        {
          id: '7',
          type: 'governance_vote',
          title: 'Résultat de Vote',
          message: 'La proposition "Rénovation Toiture" a été approuvée avec 87% de votes favorables.',
          timestamp: Date.now() - 86400000 * 5, // 5 days ago
          read: true,
          icon: '✅',
          link: '/governance',
          priority: 'low',
        },
        {
          id: '8',
          type: 'price_alert',
          title: 'Alerte Prix',
          message: 'Le prix des parts de "Appartement Marais" a augmenté de 8% ce mois-ci.',
          timestamp: Date.now() - 86400000 * 7, // 7 days ago
          read: true,
          icon: '📊',
          link: '/portfolio',
          priority: 'low',
        },
      ];

      setNotifications(mockNotifications);

      // Simulate real-time notifications every 30 seconds
      const interval = setInterval(() => {
        const randomNotifications = [
          {
            id: `notif-${Date.now()}`,
            type: 'rental_payment' as const,
            title: 'Nouveau Paiement de Loyer',
            message: `Vous avez reçu ${Math.floor(Math.random() * 200 + 50)}€ de revenus locatifs.`,
            timestamp: Date.now(),
            read: false,
            icon: '💰',
            link: '/rentals',
            priority: 'medium' as const,
          },
          {
            id: `notif-${Date.now()}`,
            type: 'governance_new_proposal' as const,
            title: 'Nouvelle Proposition',
            message: 'Une nouvelle proposition de gouvernance a été créée.',
            timestamp: Date.now(),
            read: false,
            icon: '🗳️',
            link: '/governance',
            priority: 'medium' as const,
          },
          {
            id: `notif-${Date.now()}`,
            type: 'transaction_confirmed' as const,
            title: 'Transaction Confirmée',
            message: 'Votre dernière transaction a été confirmée sur Solana.',
            timestamp: Date.now(),
            read: false,
            icon: '✅',
            link: '/portfolio',
            priority: 'high' as const,
          },
        ];

        // Randomly add a notification (30% chance)
        if (Math.random() < 0.3) {
          const newNotif = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
          setNotifications(prev => [newNotif, ...prev]);

          // Show browser notification if permission granted
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(newNotif.title, {
              body: newNotif.message,
              icon: '/icon.png',
              badge: '/badge.png',
            });
          }
        }
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [connected]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const hasUnread = unreadCount > 0;

  const getNotificationsByType = (type: NotificationType) =>
    notifications.filter(n => n.type === type);

  const getRecentNotifications = (limit: number = 5) =>
    notifications.slice(0, limit);

  return {
    notifications,
    loading,
    unreadCount,
    hasUnread,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    requestPermission,
    getNotificationsByType,
    getRecentNotifications,
  };
}
