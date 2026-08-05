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

  return (
    <div className="space-y-6 pb-12 lg:pb-0">
      {/* 1. Mobile & Tablet Friendly Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-slate-900/90 border border-indigo-500/20">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Sales Pipeline Performance
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white">
              Executive Revenue & Lead Overview
            </h2>
            <p className="text-xs text-gray-300 max-w-xl">
              Pantau total proyeksi deal, kecepatan siklus penjualan, dan konversi leads secara real-time.
            </p>
          </div>

          <div className="shrink-0">
            <button
              onClick={onNavigateToKanban}
              className="touch-target w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
            >
              Buka Deals Kanban
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Responsive KPI Cards Grid (P1 Mobile: 1 col | P2 Tablet: 2 cols | P3 Desktop: 4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {KPI_SUMMARY.map((kpi, idx) => (
          <div
            key={idx}
            className="glass-panel p-4 sm:p-5 rounded-2xl glass-panel-hover flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">{kpi.title}</span>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 shrink-0">
                {getIcon(kpi.iconName)}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight block">
                {kpi.value}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-emerald-400 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {kpi.change}
                </span>
                <span className="text-gray-500 text-[11px]">{kpi.period}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Responsive Main Content Layout (P1 Mobile / P2 Tablet: 1 col stacked | P3 Desktop: 3 cols grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Pipeline Value Distribution Bar Breakdown */}
        <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Pipeline Value Distribution
              </h3>
              <p className="text-xs text-gray-400">Total nilai transaksi berdasar stage pipeline</p>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-gray-400 block">Active Pipeline</span>
              <span className="text-base sm:text-lg font-extrabold text-emerald-400">
                Rp {activePipelineValue.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Visual Stage Bars */}
          <div className="space-y-3.5 pt-1">
            {[
              { stage: 'Qualification', val: 140000000, pct: 15, color: 'bg-blue-500' },
              { stage: 'Discovery', val: 95000000, pct: 10, color: 'bg-amber-500' },
              { stage: 'Proposal Sent', val: 180000000, pct: 25, color: 'bg-purple-500' },
              { stage: 'Negotiation', val: 320000000, pct: 35, color: 'bg-rose-500' },
              { stage: 'Closed Won', val: 750000000, pct: 60, color: 'bg-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-300">{item.stage}</span>
                  <span className="text-gray-200">
                    Rp {item.val.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Target Milestone Alert Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping shrink-0" />
              <span className="text-indigo-200 font-medium">
                Pencapaian Target Bulan Ini: <strong className="text-white font-bold">85% dari Rp 1.75 Miliar</strong>
              </span>
            </div>
            <span className="text-indigo-400 font-bold text-left sm:text-right">2 Deal lagi untuk target</span>
          </div>
        </div>

        {/* Priority Deals Feed */}
        <div className="glass-panel p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              High Priority Deals
            </h3>
            <span
              onClick={onNavigateToKanban}
              className="text-xs text-indigo-400 font-semibold cursor-pointer hover:underline touch-target py-1"
            >
              Lihat Board
            </span>
          </div>

          <div className="space-y-3">
            {deals.slice(0, 4).map((deal) => (
              <div
                key={deal.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-bold text-white line-clamp-1">{deal.title}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                    {deal.stageId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 text-[11px] flex items-center gap-1 truncate max-w-[150px]">
                    <Building className="w-3 h-3 text-gray-500 shrink-0" />
                    {deal.companyName}
                  </span>
                  <span className="font-extrabold text-emerald-400 text-xs shrink-0">
                    Rp {(deal.value / 1000000).toFixed(0)} Jt
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
