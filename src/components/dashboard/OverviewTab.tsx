'use client';

import React from 'react';
import {
  DollarSign,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Building,
  Target,
  Sparkles,
} from 'lucide-react';
import { KPI_SUMMARY } from '../../data/mockData';
import { Deal, Activity } from '../../types/crm';

interface OverviewTabProps {
  deals: Deal[];
  activities: Activity[];
  onNavigateToKanban: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ deals, activities, onNavigateToKanban }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign':
        return <DollarSign className="w-5 h-5 text-emerald-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <DollarSign className="w-5 h-5 text-indigo-400" />;
    }
  };

  const activePipelineValue = deals
    .filter((d) => d.stageId !== 'CLOSED_WON' && d.stageId !== 'CLOSED_LOST')
    .reduce((acc, curr) => acc + curr.value, 0);

  const stagesList = [
    { id: 'QUALIFICATION', stage: 'Qualification', color: 'bg-blue-500' },
    { id: 'DISCOVERY', stage: 'Discovery', color: 'bg-amber-500' },
    { id: 'PROPOSAL', stage: 'Proposal Sent', color: 'bg-purple-500' },
    { id: 'NEGOTIATION', stage: 'Negotiation', color: 'bg-rose-500' },
    { id: 'CLOSED_WON', stage: 'Closed Won', color: 'bg-emerald-500' },
  ];

  const totalAllDealsValue = deals.reduce((acc, d) => acc + d.value, 0) || 1;

  const stageBreakdown = stagesList.map((st) => {
    const stageDeals = deals.filter((d) => d.stageId === st.id);
    const val = stageDeals.reduce((sum, d) => sum + d.value, 0);
    const pct = Math.round((val / totalAllDealsValue) * 100);
    return {
      stage: st.stage,
      val,
      pct: pct > 0 ? pct : 5,
      color: st.color,
      count: stageDeals.length,
    };
  });

  return (
    <div className="space-y-6 pb-12 lg:pb-0 max-w-[1600px] mx-auto">
      {/* 1. Desktop & Mobile Executive Banner */}
      <div className="glass-panel p-5 sm:p-6 lg:p-8 rounded-3xl relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900/90 border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Sales Pipeline Executive Dashboard
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Executive Revenue & Lead Overview
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              Pantau total proyeksi deal, kecepatan siklus penjualan, dan konversi leads secara real-time dari Supabase Cloud.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onNavigateToKanban}
              className="touch-target w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
            >
              Buka Deals Kanban Board
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Responsive KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {KPI_SUMMARY.map((kpi, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 sm:p-6 rounded-2xl glass-panel-hover flex flex-col justify-between space-y-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{kpi.title}</span>
              <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 shrink-0">
                {getIcon(kpi.iconName)}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-2xl lg:text-3xl font-black text-white tracking-tight block">
                {kpi.value}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-400 font-extrabold flex items-center">
                  <ArrowUpRight className="w-4 h-4" />
                  {kpi.change}
                </span>
                <span className="text-gray-400 text-[11px] font-medium">{kpi.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Layout (Desktop Grid 3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Value Distribution Bar Breakdown */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-7 rounded-3xl space-y-6 border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Pipeline Value Distribution (Supabase Real-Time)
              </h3>
              <p className="text-xs text-gray-400">Total nilai transaksi berdasar stage pipeline</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-gray-400 block font-medium">Active Pipeline Value</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">
                Rp {activePipelineValue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Visual Stage Bars */}
          <div className="space-y-4 pt-1">
            {stageBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-200 flex items-center gap-2">
                    {item.stage}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-white/10">
                      {item.count} deals
                    </span>
                  </span>
                  <span className="text-emerald-400 font-extrabold">
                    Rp {item.val.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-slate-950/90 rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Target Milestone Alert Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-indigo-400 animate-ping shrink-0" />
              <span className="text-indigo-200 font-semibold">
                Pencapaian Target Bulan Ini: <strong className="text-white font-black">85% dari Target Rp 3.0 Miliar</strong>
              </span>
            </div>
            <span className="text-indigo-400 font-extrabold text-left sm:text-right">Target Enterprise Achieved</span>
          </div>
        </div>

        {/* Priority Deals Feed */}
        <div className="glass-panel p-6 sm:p-7 rounded-3xl space-y-5 border border-white/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              High Priority Deals
            </h3>
            <span
              onClick={onNavigateToKanban}
              className="text-xs text-indigo-400 font-bold cursor-pointer hover:underline touch-target py-1"
            >
              Lihat Board
            </span>
          </div>

          <div className="space-y-3.5">
            {deals.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 font-medium">
                Belum ada data deals di Supabase database.
              </div>
            ) : (
              deals.slice(0, 5).map((deal) => (
                <div
                  key={deal.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-indigo-500/40 transition-all space-y-2.5 shadow-md"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{deal.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                      {deal.stageId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 text-[11px] flex items-center gap-1.5 truncate max-w-[150px]">
                      <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {deal.companyName || 'Enterprise Client'}
                    </span>
                    <span className="font-black text-emerald-400 text-xs shrink-0">
                      Rp {deal.value.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
