'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Video,
  Mail,
  FileText,
  CheckSquare,
  Plus,
  Clock,
  User,
  CheckCircle2,
  Sparkles,
  X,
} from 'lucide-react';
import { Activity, ActivityType } from '../../types/crm';

interface ActivityLoggerProps {
  activities: Activity[];
  onToggleComplete: (activityId: string) => void;
  onAddActivity: (newAct: Omit<Activity, 'id'>) => void;
}

export const ActivityLogger: React.FC<ActivityLoggerProps> = ({
  activities,
  onToggleComplete,
  onAddActivity,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [type, setType] = useState<ActivityType>('CALL');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [dealTitle, setDealTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-08-06 14:00');
  const [priority, setPriority] = useState<'NORMAL' | 'URGENT'>('NORMAL');

  const filtered = activities.filter((act) => filterType === 'ALL' || act.type === filterType);

  const getActivityIcon = (t: ActivityType) => {
    switch (t) {
      case 'CALL':
        return <PhoneCall className="w-4 h-4 text-blue-400" />;
      case 'MEETING':
        return <Video className="w-4 h-4 text-purple-400" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-amber-400" />;
      case 'TASK':
        return <CheckSquare className="w-4 h-4 text-emerald-400" />;
      case 'NOTE':
        return <FileText className="w-4 h-4 text-cyan-400" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !contactName) return;

    onAddActivity({
      type,
      subject,
      description,
      contactName,
      dealTitle: dealTitle || undefined,
      userName: 'Budi Santoso',
      userAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dueDate,
      isCompleted: false,
      priority,
    });

    setSubject('');
    setDescription('');
    setContactName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-16 lg:pb-0">
      {/* 1. Filter Pills & Add Action */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Filter Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar max-w-full">
          {['ALL', 'CALL', 'MEETING', 'EMAIL', 'TASK'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`touch-target px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                filterType === t
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-gray-400 border border-white/10'
              }`}
            >
              {t === 'ALL' ? 'Semua Aktivitas' : t}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="touch-target w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Log Activity Baru
        </button>
      </div>

      {/* 2. Timeline Activity Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-panel p-10 text-center text-gray-500 rounded-2xl text-xs">
            Belum ada aktivitas tercatat untuk kategori ini.
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className={`p-4 rounded-2xl glass-panel glass-panel-hover border transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                act.isCompleted ? 'opacity-65 border-white/5 bg-slate-950/40' : 'border-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon Box */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                  {getActivityIcon(act.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={`text-xs sm:text-sm font-bold text-white ${
                        act.isCompleted ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {act.subject}
                    </h4>
                    {act.priority === 'URGENT' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        URGENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">{act.description}</p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-indigo-400" />
                      Target: <strong className="text-gray-200">{act.contactName}</strong>
                    </span>
                    {act.dealTitle && (
                      <span className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-500/20">
                        Deal: {act.dealTitle}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-3 h-3" />
                      {act.dueDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete Toggle Button (Min 44x44px Touch Target) */}
              <button
                onClick={() => onToggleComplete(act.id)}
                className={`touch-target w-full sm:w-auto px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 ${
                  act.isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{act.isCompleted ? 'Selesai' : 'Tandai Selesai'}</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* 3. Add Activity Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-lg p-5 sm:p-6 rounded-2xl space-y-4 border border-indigo-500/30 my-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Log Aktivitas / Task Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="touch-target text-gray-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Tipe Aktivitas</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ActivityType)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="CALL">Panggilan Telepon (CALL)</option>
                    <option value="MEETING">Meeting / Demo Presentasi</option>
                    <option value="EMAIL">Kirim Email / Proposal</option>
                    <option value="TASK">Tugas Follow-Up (TASK)</option>
                    <option value="NOTE">Catatan Internal (NOTE)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Tingkat Prioritas</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'NORMAL' | 'URGENT')}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Subjek Aktivitas</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Meeting Negosiasi Harga SLA Cloud"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Nama Contact Target</label>
                  <input
                    type="text"
                    required
                    placeholder="Alexander Agung"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Nama Deal (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Enterprise Migration"
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Rincian Catatan / Hasil Meeting</label>
                <textarea
                  rows={3}
                  placeholder="Masukkan ringkasan hasil percakapan atau poin-poin kesepakatan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input resize-none"
                />
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
                  Simpan Activity Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
