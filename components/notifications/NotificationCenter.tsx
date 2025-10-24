'use client';

import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '@/lib/solana/hooks/useNotifications';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getRecentNotifications,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const recentNotifs = getRecentNotifications(5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-blue-500';
      default: return '';
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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-junot-gold/10 transition-colors"
      >
        <div className="text-2xl">🔔</div>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 modern-card shadow-2xl z-50 max-h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-junot-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-junot-text-dark">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-junot-text-muted">
                    {unreadCount} non {unreadCount > 1 ? 'lues' : 'lue'}
                  </p>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-junot-gold hover:text-junot-gold-dark font-semibold transition-colors"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {recentNotifs.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-junot-text-muted">Aucune notification</p>
                </div>
              ) : (
                <div className="divide-y divide-junot-border">
                  {recentNotifs.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`p-4 hover:bg-junot-gold/5 transition-colors cursor-pointer ${
                        !notif.read ? 'bg-junot-gold/10' : ''
                      } ${getPriorityColor(notif.priority)}`}
                      onClick={() => {
                        markAsRead(notif.id);
                        setIsOpen(false);
                      }}
                    >
                      <Link href={notif.link || '#'} className="block">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className="text-2xl flex-shrink-0 mt-1">
                            {notif.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm text-junot-text-dark truncate">
                                {notif.title}
                              </h4>
                              {!notif.read && (
                                <div className="w-2 h-2 bg-junot-gold rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                            <p className="text-xs text-junot-text-muted line-clamp-2 mb-2">
                              {notif.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-junot-text-muted">
                                {getTimeAgo(notif.timestamp)}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  deleteNotification(notif.id);
                                }}
                                className="text-junot-text-muted hover:text-red-500 transition-colors text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-junot-border">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm font-semibold text-junot-gold hover:text-junot-gold-dark transition-colors"
                >
                  Voir toutes les notifications →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
