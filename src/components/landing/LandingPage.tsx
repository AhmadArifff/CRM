'use client';

import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Users,
  CheckCircle2,
  ArrowRight,
  Kanban,
  Smartphone,
  Lock,
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onExploreDemo,
}) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans overflow-x-hidden">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              ApexCRM
            </span>
            <span className="text-[10px] block font-bold text-indigo-400 -mt-1 tracking-widest uppercase">
              Enterprise Growth Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onExploreDemo}
            className="touch-target px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
          >
            Live Demo
          </button>
          <button
            onClick={onOpenLogin}
            className="touch-target px-4 py-2 text-xs font-bold text-indigo-300 border border-indigo-500/40 rounded-xl hover:bg-indigo-500/10 transition-all"
          >
            Masuk
          </button>
          <button
            onClick={onOpenRegister}
            className="touch-target px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-600/30 active:scale-95 flex items-center gap-1.5"
          >
            <span>Coba Gratis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          Platform CRM Mobile-First #1 untuk Tim Sales Indonesia
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
          Tutup Lebih Banyak Deal <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tanpa Ribet dari Smartphone Anda
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          ApexCRM memvisualisasikan seluruh pipeline penjualan, mengotomatisasi log aktivitas lead, dan memberikan analisis performa sales secara real-time langsung dari perangkat HP, Tablet, maupun Desktop.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenRegister}
            className="touch-target w-full sm:w-auto px-8 py-3.5 text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl hover:opacity-95 shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Mulai Trial 14 Hari Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreDemo}
            className="touch-target w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-gray-200 glass-panel border border-white/10 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Kanban className="w-4 h-4 text-indigo-400" />
            <span>Jelajahi App Demo</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-white">Mobile & Tablet First</h3>
            <p className="text-[11px] text-gray-400">Responsif sempurna di HP 360px & Tablet.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <Lock className="w-5 h-5 text-purple-400" />
            <h3 className="text-xs font-bold text-white">Multi-Tenant Secured</h3>
            <p className="text-[11px] text-gray-400">Proteksi data PostgreSQL & Supabase Cloud.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Pipeline Kanban</h3>
            <p className="text-[11px] text-gray-400">Geser stage deal mudah dengan kalkulasi otomatis.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
            <BarChart3 className="w-5 h-5 text-rose-400" />
            <h3 className="text-xs font-bold text-white">Executive Analytics</h3>
            <p className="text-[11px] text-gray-400">Ringkasan KPI win-rate & total revenue sales.</p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-16 px-4 sm:px-8 border-t border-white/10 bg-slate-950/50">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Pilih Paket Sesuai Skala Bisnis Anda</h2>
            <p className="text-xs sm:text-sm text-gray-400">Tanpa biaya tersembunyi. Batalkan kapan saja.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter Tier */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Starter Sales</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">Rp 299rb</span>
                  <span className="text-xs text-gray-400">/bulan</span>
                </div>
                <p className="text-xs text-gray-400">Cocok untuk UMKM & tim sales kecil hingga 5 user.</p>
                <ul className="space-y-2.5 text-xs text-gray-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Hingga 500 Leads & Contacts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pipeline Kanban Board</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Akses Apps Mobile & Tablet</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenRegister}
                className="touch-target w-full py-2.5 text-xs font-bold text-indigo-300 border border-indigo-500/40 rounded-xl hover:bg-indigo-500/10 transition-all"
              >
                Pilih Starter
              </button>
            </div>

            {/* Growth Tier (Recommended) */}
            <div className="p-6 rounded-3xl glass-panel border-2 border-indigo-500/80 bg-indigo-950/30 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-indigo-600/20">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-black text-white uppercase tracking-wider">
                Paling Populer
              </div>
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">Growth Enterprise</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">Rp 799rb</span>
                  <span className="text-xs text-gray-400">/bulan</span>
                </div>
                <p className="text-xs text-gray-300">Untuk perusahaan berkembang hingga 25 user sales.</p>
                <ul className="space-y-2.5 text-xs text-gray-200 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited Leads & Deals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Notifikasi Direct WhatsApp/Email</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ekspor Laporan CSV & Analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Database PostgreSQL Cloud Supabase</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenRegister}
                className="touch-target w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all"
              >
                Mulai Trial Growth
              </button>
            </div>

            {/* Scale Tier */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-extrabold text-purple-300 uppercase tracking-wider">Enterprise Scale</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">Custom</span>
                </div>
                <p className="text-xs text-gray-400">Solusi kustom untuk korporasi skala besar.</p>
                <ul className="space-y-2.5 text-xs text-gray-300 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited User & Dedicated Server</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kustom Integrasi API Backend</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>SLA Support 24/7 Dedicated Account</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onOpenRegister}
                className="touch-target w-full py-2.5 text-xs font-bold text-gray-200 border border-white/20 rounded-xl hover:bg-white/10 transition-all"
              >
                Hubungi Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 border-t border-white/10 text-center text-xs text-gray-400">
        <p>© 2026 ApexCRM Inc. Hak Cipta Dilindungi Undang-Undang. Multi-Tenant Enterprise Solution.</p>
      </footer>
    </div>
  );
};
