'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Building2, Sparkles, ArrowRight } from 'lucide-react';
import { INITIAL_USERS } from '../../data/mockData';
import { UserRole } from '../../types/crm';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; role: UserRole }) => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess,
  onSwitchMode,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState<UserRole>('SALES_REP');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    onSuccess({
      name: name || (email.split('@')[0] ?? 'Sales User'),
      email,
      role,
    });
    onClose();
  };

  const handleQuickDemoUser = (userIndex: number) => {
    const demo = INITIAL_USERS[userIndex];
    if (demo) {
      onSuccess({
        name: demo.name,
        email: demo.email,
        role: demo.role,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-indigo-500/40 shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 touch-target p-1 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto mb-2 text-indigo-400">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white">
            {mode === 'login' ? 'Masuk ke ApexCRM' : 'Daftar Akun Enterprise Baru'}
          </h2>
          <p className="text-xs text-gray-400">
            {mode === 'login'
              ? 'Akses dashboard sales pipeline & customer data'
              : 'Mulai trial 14 hari gratis tanpa kartu kredit'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Budi Santoso"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nama Perusahaan / PT</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="PT Solusi Digital Indonesia"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Email Kerja</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="budi@enterprise.co.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl glass-input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-300">Role Pengguna</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 text-xs rounded-xl glass-input text-gray-200 cursor-pointer"
            >
              <option value="SALES_REP" className="bg-slate-900">
                Sales Representative (Account Exec)
              </option>
              <option value="MANAGER" className="bg-slate-900">
                Sales Manager (Lead)
              </option>
              <option value="ADMIN" className="bg-slate-900">
                Tenant Administrator
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="touch-target w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Masuk Dashboard' : 'Daftar Sekarang'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Preset */}
        <div className="pt-2 border-t border-white/10 space-y-2">
          <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Demo Login (Sekali Klik):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemoUser(0)}
              className="touch-target p-2 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-gray-300 hover:text-white hover:border-indigo-400"
            >
              Ahmad (Admin)
            </button>
            <button
              onClick={() => handleQuickDemoUser(1)}
              className="touch-target p-2 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-gray-300 hover:text-white hover:border-indigo-400"
            >
              Siti (Manager)
            </button>
            <button
              onClick={() => handleQuickDemoUser(2)}
              className="touch-target p-2 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-gray-300 hover:text-white hover:border-indigo-400"
            >
              Rudi (Sales)
            </button>
          </div>
        </div>

        {/* Footer Mode Switcher */}
        <div className="text-center text-xs text-gray-400">
          {mode === 'login' ? (
            <span>
              Belum punya akun?{' '}
              <button
                onClick={() => onSwitchMode('register')}
                className="text-indigo-400 font-bold hover:underline"
              >
                Daftar Trial Gratis
              </button>
            </span>
          ) : (
            <span>
              Sudah punya akun?{' '}
              <button
                onClick={() => onSwitchMode('login')}
                className="text-indigo-400 font-bold hover:underline"
              >
                Masuk di sini
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
