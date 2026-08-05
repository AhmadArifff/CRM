'use client';

import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  ArrowLeft,
  Building,
  User as UserIcon,
  Calendar,
  Filter,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { Deal, PipelineStage, StageId } from '../../types/crm';

interface DealsKanbanProps {
  deals: Deal[];
  stages: PipelineStage[];
  onMoveDeal: (dealId: string, targetStage: StageId) => void;
  onAddDeal: (newDeal: Omit<Deal, 'id' | 'createdAt'>) => void;
  salesReps: string[];
}

export const DealsKanban: React.FC<DealsKanbanProps> = ({
  deals,
  stages,
  onMoveDeal,
  onAddDeal,
  salesReps,
}) => {
  const [selectedOwner, setSelectedOwner] = useState<string>('ALL');
  const [activeMobileStage, setActiveMobileStage] = useState<StageId>('QUALIFICATION');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [value, setValue] = useState(150000000);
  const [stageId, setStageId] = useState<StageId>('QUALIFICATION');
  const [ownerName, setOwnerName] = useState(salesReps[0] || 'Budi Santoso');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');

  const filteredDeals =
    selectedOwner === 'ALL' ? deals : deals.filter((d) => d.ownerName === selectedOwner);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName) return;

    onAddDeal({
      title,
      companyName,
      contactName: contactName || 'Contact Representative',
      contactEmail: contactEmail || 'contact@company.com',
      value: Number(value),
      stageId,
      ownerName,
      ownerAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      expectedCloseDate: '2026-09-30',
      probability: 60,
      priority,
    });

    setTitle('');
    setCompanyName('');
    setContactName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-16 lg:pb-0">
      {/* 1. Action & Filter Bar */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 text-xs text-gray-300 bg-slate-900/80 px-3 py-2 rounded-xl border border-white/10 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-gray-400 shrink-0">Filter Rep:</span>
            <select
              value={selectedOwner}
              onChange={(e) => setSelectedOwner(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer w-full"
            >
              <option value="ALL" className="bg-slate-900">
                Semua Reps ({deals.length} Deals)
              </option>
              {salesReps.map((rep) => (
                <option key={rep} value={rep} className="bg-slate-900">
                  {rep}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="touch-target w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat Deal Baru
        </button>
      </div>

      {/* 2. MOBILE & TABLET STAGE SELECTOR TABS (< 1024px) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar lg:hidden">
        {stages.map((st) => {
          const stDeals = filteredDeals.filter((d) => d.stageId === st.id);
          const isSelected = activeMobileStage === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveMobileStage(st.id)}
              className={`touch-target px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-gray-400 border border-white/10'
              }`}
            >
              <span>{st.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-300'
                }`}
              >
                {stDeals.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. KANBAN BOARD COLUMNS (Mobile/Tablet displays active tab column, Desktop displays all 5 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {stages.map((stage, idx) => {
          const stageDeals = filteredDeals.filter((d) => d.stageId === stage.id);
          const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          const isVisibleOnMobile = activeMobileStage === stage.id;

          return (
            <div
              key={stage.id}
              className={`glass-panel rounded-2xl p-4 flex-col space-y-3 bg-slate-950/40 border-t-4 border-t-indigo-500 ${
                isVisibleOnMobile ? 'flex' : 'hidden lg:flex'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white">{stage.name}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 block mt-0.5">
                    Rp {(totalValue / 1000000).toLocaleString('id-ID')} Jt
                  </span>
                </div>
              </div>

              {/* Deal Cards */}
              <div className="space-y-3 min-h-[300px]">
                {stageDeals.length === 0 ? (
                  <div className="h-32 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-gray-500 font-medium">
                    Tidak ada deal di stage ini
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-4 rounded-xl glass-panel glass-panel-hover border border-white/10 space-y-3 relative"
                    >
                      {/* Priority Tag & Date */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            deal.priority === 'HIGH'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {deal.priority} PRIORITY
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {deal.expectedCloseDate}
                        </span>
                      </div>

                      {/* Title & Value */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">{deal.title}</h4>
                        <span className="text-sm font-extrabold text-emerald-400 block">
                          Rp {deal.value.toLocaleString('id-ID')}
                        </span>
                      </div>

                      {/* Company & Contact */}
                      <div className="space-y-1 text-[11px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{deal.companyName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{deal.contactName}</span>
                        </div>
                      </div>

                      {/* Owner Avatar & Touch-Friendly Move Buttons */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={deal.ownerAvatar}
                            alt={deal.ownerName}
                            className="w-6 h-6 rounded-full object-cover border border-indigo-500/50"
                          />
                          <span className="text-[10px] text-gray-300 font-semibold truncate max-w-[80px]">
                            {deal.ownerName.split(' ')[0]}
                          </span>
                        </div>

                        {/* Stage Shift Controls (Min 44x44px Touch Target) */}
                        <div className="flex items-center gap-1">
                          {idx > 0 && (
                            <button
                              onClick={() => onMoveDeal(deal.id, stages[idx - 1].id)}
                              className="touch-target p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-gray-300 hover:text-white transition-colors"
                              title="Pindah ke Stage Sebelumnya"
                            >
                              <ArrowLeft className="w-4 h-4" />
                            </button>
                          )}
                          {idx < stages.length - 1 && (
                            <button
                              onClick={() => onMoveDeal(deal.id, stages[idx + 1].id)}
                              className="touch-target p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-gray-300 hover:text-white transition-colors"
                              title="Pindah ke Stage Berikutnya"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Responsive Add Deal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-lg p-5 sm:p-6 rounded-2xl space-y-4 border border-indigo-500/30 my-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Tambah Deal / Transaksi Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="touch-target text-gray-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nama Deal / Proyek</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Enterprise SaaS Renewal 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Nama Perusahaan</label>
                  <input
                    type="text"
                    required
                    placeholder="PT Digital Nusantara"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Nama Contact Person</label>
                  <input
                    type="text"
                    placeholder="Budi Utomo"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Nilai Transaksi (IDR)</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Pipeline Stage Initial</label>
                  <select
                    value={stageId}
                    onChange={(e) => setStageId(e.target.value as StageId)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    {stages.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Sales Rep Owner</label>
                  <select
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    {salesReps.map((rep) => (
                      <option key={rep} value={rep}>
                        {rep}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="HIGH">HIGH PRIORITY</option>
                    <option value="MEDIUM">MEDIUM PRIORITY</option>
                    <option value="LOW">LOW PRIORITY</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="touch-target px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  Simpan Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
