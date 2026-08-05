'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, Plus, Sparkles, X, User as UserIcon } from 'lucide-react';
import { User } from '../../types/crm';

interface HeaderProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  users: User[];
  onOpenAddModal: () => void;
  activeTabTitle: string;
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onUserChange,
  users,
  onOpenAddModal,
  activeTabTitle,
  onOpenMobileSidebar,
}) => {
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K listener for QA Power-User Feature
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-white/10 px-4 sm:px-6 flex items-center justify-between gap-2">
      {/* Left: Mobile Drawer Trigger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden touch-target p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-6 h-6 text-indigo-400" />
        </button>

        <div className="truncate space-y-0.5">
          <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white truncate flex items-center gap-2">
            {activeTabTitle}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            QA Verified Enterprise CRM
          </span>
        </div>
      </div>

      {/* Center Search Bar with Cmd+K Shortcut */}
      <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Cari leads, deals, atau kontak... (Cmd+K)"
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
          className="md:hidden touch-target p-2 text-gray-300 hover:text-white"
        >
          <Search className="w-5 h-5 text-indigo-400" />
        </button>

        {/* User Persona Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 min-h-[44px]">
          <UserIcon className="w-4 h-4 text-indigo-400 hidden sm:inline ml-1.5" />
          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = users.find((u) => u.id === e.target.value);
              if (selected) onUserChange(selected);
            }}
            className="bg-transparent text-xs font-bold text-gray-200 focus:outline-none cursor-pointer px-1 py-1"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                {u.name.split(' ')[0]} ({u.role.replace('_', ' ')})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={onOpenAddModal}
          className="touch-target px-3.5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Deal</span>
        </button>

        {/* Notifications Icon */}
        <button className="touch-target relative text-gray-300 hover:text-white p-2 rounded-xl hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>
      </div>

      {/* Mobile Search Input Drawer */}
      {isSearchOpenMobile && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-slate-950/95 glass-panel border-b border-white/10 md:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              autoFocus
              placeholder="Cari lead, deal, atau perusahaan..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input"
            />
          </div>
          <button
            onClick={() => setIsSearchOpenMobile(false)}
            className="touch-target text-gray-400 hover:text-white font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </header>
  );
};
