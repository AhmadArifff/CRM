'use client';

import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, X, Sparkles, AlertCircle, Clock } from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'deal' | 'contact' | 'task' | 'system';
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick: (id: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.isRead : true));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/10 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Pusat Notifikasi Real-Time</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {notifications.filter((n) => !n.isRead).length} Baru
            </span>
          </div>

          <button onClick={onClose} className="touch-target p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls & Action Buttons */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all touch-target ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all touch-target ${
                filter === 'unread'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Belum Dibaca
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllAsRead}
              title="Tandai Semua Dibaca"
              className="touch-target p-1.5 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={onClearAll}
              title="Hapus Semua"
              className="touch-target p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification Feed List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-400/40 animate-pulse" />
              <p className="text-xs text-gray-400">Tidak ada notifikasi baru saat ini.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onNotificationClick(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer touch-target space-y-1.5 ${
                  item.isRead
                    ? 'bg-slate-900/40 border-white/5 opacity-75 hover:opacity-100'
                    : 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-600/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    {!item.isRead && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-white/10 bg-slate-950/80 text-center text-[11px] text-gray-400">
          Notifikasi terintegrasi real-time via WebSockets / API Server
        </div>
      </div>
    </div>
  );
};
