'use client';

import React, { useState } from 'react';
import { Search, Kanban, Users, CalendarCheck, FileText, Sparkles, X, ChevronRight } from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const actions = [
    { label: 'Buka Deals Kanban Board', tab: 'kanban' as TabType, icon: Kanban, category: 'Navigation' },
    { label: 'Lihat Leads & Contacts Database', tab: 'contacts' as TabType, icon: Users, category: 'Navigation' },
    { label: 'Log Activity & Task Reminders', tab: 'activities' as TabType, icon: CalendarCheck, category: 'Navigation' },
    { label: 'Lihat Executive Summary Overview', tab: 'overview' as TabType, icon: Sparkles, category: 'Navigation' },
    { label: 'Buka PRD & System Blueprint Specs', tab: 'prd' as TabType, icon: FileText, category: 'Documentation' },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-indigo-500/40 shadow-2xl overflow-hidden space-y-3">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Ketik perintah atau cari modul CRM... (ESC untuk keluar)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-gray-400"
          />
          <button onClick={onClose} className="touch-target p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Items List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              Tidak ada modul yang cocok dengan pencarian "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.tab);
                    onClose();
                  }}
                  className="w-full p-3 rounded-xl hover:bg-indigo-600/30 flex items-center justify-between text-xs font-semibold text-gray-200 hover:text-white transition-all group touch-target"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-white/10 group-hover:border-indigo-400">
                      <Icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-[11px] text-gray-400">
          <span>Gunakan panah untuk navigasi</span>
          <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-[10px]">ApexCRM Cmd+K</span>
        </div>
      </div>
    </div>
  );
};
