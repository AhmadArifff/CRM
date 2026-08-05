'use client';

import React, { useState } from 'react';
import {
  FileText,
  Database,
  Calendar,
  CheckCircle2,
  Cpu,
  Workflow,
  Sparkles,
} from 'lucide-react';

export const PrdViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'prd' | 'architecture' | 'roadmap'>('prd');

  return (
    <div className="space-y-5 pb-16 lg:pb-0">
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold text-purple-300 uppercase tracking-wider">
                System Documentation & Specification
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Product Requirements & System Blueprint</h2>
            <p className="text-xs text-gray-300">
              Dokumen spesifikasi PRD, arsitektur database, dan roadmap pengembangan rilis MVP v1.0.
            </p>
          </div>

          {/* Section Selector Pills Carousel */}
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar shrink-0">
            <button
              onClick={() => setActiveSection('prd')}
              className={`touch-target px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'prd'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              PRD & User Stories
            </button>
            <button
              onClick={() => setActiveSection('architecture')}
              className={`touch-target px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'architecture'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              ERD & Tech Stack
            </button>
            <button
              onClick={() => setActiveSection('roadmap')}
              className={`touch-target px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeSection === 'roadmap'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Sprint Roadmap
            </button>
          </div>
        </div>
      </div>

      {/* Content Section: PRD & User Stories */}
      {activeSection === 'prd' && (
        <div className="space-y-5">
          {/* Executive Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-1.5 border-l-4 border-l-indigo-500">
              <span className="text-[10px] font-semibold text-indigo-400 uppercase">Target User Persona</span>
              <h4 className="text-xs sm:text-sm font-bold text-white">Sales Representatives & Managers</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Memudahkan pengisian catatan interaksi, tracking stage deal, dan eliminasi kebocoran lead.
              </p>
            </div>
            <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-1.5 border-l-4 border-l-purple-500">
              <span className="text-[10px] font-semibold text-purple-400 uppercase">Target Uptime & Speed</span>
              <h4 className="text-xs sm:text-sm font-bold text-white">LCP &lt; 1.5s & p95 API &lt; 200ms</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Akses instan di browser HP & Tablet dengan touch layout responsif.
              </p>
            </div>
            <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-1.5 border-l-4 border-l-emerald-500 sm:col-span-2 md:col-span-1">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase">Key Success Metric</span>
              <h4 className="text-xs sm:text-sm font-bold text-white">+20% Lead Conversion Rate</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Percepatan siklus penjualan dari Lead Created hingga Closed Won.
              </p>
            </div>
          </div>

          {/* User Stories */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-indigo-400" />
              Sprint 1-4 Core User Stories & Acceptance Criteria
            </h3>

            <div className="space-y-3">
              {[
                {
                  id: 'US-01',
                  role: 'Sales Representative',
                  action: 'Mengelola & menggeser deal di Drag-and-Drop Kanban Board',
                  benefit: 'Memperbarui stage transaksi secara instan tanpa perlu form manual.',
                  ac: 'Given user berada di Deals Board, When card ditarik/digeser stage, Then nilai total stage terhitung ulang secara real-time.',
                },
                {
                  id: 'US-02',
                  role: 'Sales Manager',
                  action: 'Melihat Executive Dashboard & Pipeline Value Distribution',
                  benefit: 'Mendapat estimasi omset dan produktivitas tim sales secara transparan.',
                  ac: 'Given manager melihat Overview, When filter rep dipilih, Then total nilai deal dan persentase pencapaian target ter-update otomatis.',
                },
                {
                  id: 'US-03',
                  role: 'System Administrator',
                  action: 'Konfigurasi Role-Based Access Control (RBAC) & Multi-Tenancy',
                  benefit: 'Keamanan data terisolasi rapi pada level organisasi tenant.',
                  ac: 'Given request API masuk, When JWT token diverifikasi, Then middleware memastikan tenant_id dan role sesuai izin akses.',
                },
              ].map((story) => (
                <div
                  key={story.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {story.id}
                    </span>
                    <span className="text-[11px] text-gray-400">As a <strong className="text-white">{story.role}</strong></span>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    I want to {story.action}, so that {story.benefit}
                  </p>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 text-[11px] text-gray-300 font-mono">
                    <strong className="text-emerald-400">Acceptance Criteria:</strong> {story.ac}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Section: Architecture & ERD */}
      {activeSection === 'architecture' && (
        <div className="space-y-5">
          {/* Tech Stack Specs */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-400" />
              Selected Production Tech Stack
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-gray-400 font-semibold block text-[11px]">Frontend</span>
                <span className="font-extrabold text-white text-xs">Next.js 14+ (App Router)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-gray-400 font-semibold block text-[11px]">Language</span>
                <span className="font-extrabold text-indigo-300 text-xs">TypeScript (Strict)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-gray-400 font-semibold block text-[11px]">Database</span>
                <span className="font-extrabold text-emerald-300 text-xs">PostgreSQL + Prisma</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/10 space-y-1">
                <span className="text-gray-400 font-semibold block text-[11px]">Styling</span>
                <span className="font-extrabold text-purple-300 text-xs">TailwindCSS</span>
              </div>
            </div>
          </div>

          {/* ERD Database Entities */}
          <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              Core Database Entities (PostgreSQL Schema)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  entity: 'USERS',
                  fields: ['id (UUID PK)', 'tenant_id (FK)', 'email (UNIQUE)', 'password_hash', 'role (ADMIN|MANAGER|SALES_REP)'],
                },
                {
                  entity: 'CONTACTS / LEADS',
                  fields: ['id (UUID PK)', 'tenant_id (FK)', 'company_id (FK)', 'name', 'email', 'status (NEW|QUALIFIED|CUSTOMER)'],
                },
                {
                  entity: 'DEALS',
                  fields: ['id (UUID PK)', 'tenant_id (FK)', 'stage_id (FK)', 'owner_id (FK)', 'title', 'value (DECIMAL)', 'priority'],
                },
              ].map((table, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                  <div className="font-extrabold text-xs text-purple-300 border-b border-white/10 pb-2">
                    TBL: {table.entity}
                  </div>
                  <ul className="space-y-1 text-[11px] font-mono text-gray-300">
                    {table.fields.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Section: Roadmap */}
      {activeSection === 'roadmap' && (
        <div className="glass-panel p-4 sm:p-6 rounded-2xl space-y-5">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            8-Week Agile Sprint Roadmap (MVP Execution Plan)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                sprint: 'Sprint 1 (Weeks 1-2)',
                status: 'ACTIVE NOW',
                active: true,
                tasks: ['Next.js project setup & design tokens', 'Database schema & Prisma migrations', 'Auth & RBAC Login flow', 'Contacts & Leads Mobile UI'],
              },
              {
                sprint: 'Sprint 2 (Weeks 3-4)',
                status: 'UPCOMING',
                active: false,
                tasks: ['Deals Pipeline Drag-and-Drop Board', 'Company / Account relationship mapping', 'CSV Import & Export Engine', 'Real-time stage calculations'],
              },
              {
                sprint: 'Sprint 3 (Weeks 5-6)',
                status: 'PLANNED',
                active: false,
                tasks: ['Activity Logging (Calls, Meetings, Tasks)', 'Email notification alerts', 'Global Search bar (Cmd+K)', 'Task deadline reminders'],
              },
              {
                sprint: 'Sprint 4 (Weeks 7-8)',
                status: 'PLANNED',
                active: false,
                tasks: ['Executive KPI Dashboard analytics', 'Security Audit & RBAC verification', 'Lighthouse performance optimization', 'MVP Production Launch'],
              },
            ].map((sp, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-3 ${
                  sp.active
                    ? 'bg-indigo-950/50 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-white/10 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{sp.sprint}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      sp.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-gray-400'
                    }`}
                  >
                    {sp.status}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-gray-300">
                  {sp.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${sp.active ? 'text-indigo-400' : 'text-gray-500'}`} />
                      <span className="leading-snug text-[11px]">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
