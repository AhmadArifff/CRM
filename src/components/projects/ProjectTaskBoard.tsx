'use client';

import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  CheckCircle2,
  Clock,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  AlertCircle,
  Building,
  Layers,
  X,
  Filter,
} from 'lucide-react';
import { Project, ProjectTask, TaskColumnStatus } from '../../types/crm';

interface ProjectTaskBoardProps {
  projects: Project[];
  tasks: ProjectTask[];
  onMoveTask: (taskId: string, newStatus: TaskColumnStatus) => void;
  onAddTask: (newTask: Omit<ProjectTask, 'id' | 'createdAt' | 'projectId'>) => void;
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  salesReps: string[];
}

export const ProjectTaskBoard: React.FC<ProjectTaskBoardProps> = ({
  projects,
  tasks,
  onMoveTask,
  onAddTask,
  selectedProjectId,
  onSelectProject,
  salesReps,
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskColumnStatus>('TODO');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [assignedTo, setAssignedTo] = useState(salesReps[0] || 'Ahmad Ariff');
  const [dueDate, setDueDate] = useState('2026-08-25');

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const columns: { id: TaskColumnStatus; title: string; color: string; bg: string; border: string }[] = [
    { id: 'TODO', title: 'To Do (Antrian Task)', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-t-blue-500' },
    { id: 'IN_PROGRESS', title: 'In Progress (Pengerjaan)', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-t-amber-500' },
    { id: 'REVIEW', title: 'Review & QA Testing', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-t-purple-500' },
    { id: 'DONE', title: 'Done (Selesai BAST)', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-t-emerald-500' },
  ];

  const filteredTasks = tasks.filter(
    (t) => filterPriority === 'ALL' || t.priority === filterPriority
  );

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'DONE').length;
  const overallProgressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    onAddTask({
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-0 max-w-[1600px] mx-auto">
      {/* 1. Executive Project Header & Progress Bar */}
      <div className="glass-panel p-5 sm:p-6 lg:p-7 rounded-3xl space-y-5 border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/70">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                Post-Sales Development & Implementation
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Kanban className="w-7 h-7 text-indigo-400" />
              Project Tasks & Trello Board
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl">
              Kelola sprint development, alokasi tugas tim, dan penyelesaian milestone untuk proyek deals yang sedang berjalan.
            </p>
          </div>

          {/* Project Selector & Add Card Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-2.5 rounded-2xl border border-white/10 text-xs">
              <Building className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-gray-400 font-medium shrink-0">Pilih Proyek:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer max-w-[220px] truncate"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="touch-target px-4 py-2.5 text-xs font-extrabold text-white rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Task Trello
            </button>
          </div>
        </div>

        {/* Project Progress Overview */}
        {currentProject && (
          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-gray-400 block font-medium">Klien Perusahaan</span>
              <span className="text-white font-bold text-sm flex items-center gap-1.5">
                <Building className="w-4 h-4 text-indigo-400" />
                {currentProject.companyName}
              </span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <div className="flex justify-between font-bold">
                <span className="text-gray-300">Progress Completion Sprint</span>
                <span className="text-emerald-400 font-extrabold">
                  {completedTasksCount} / {totalTasksCount} Task Selesai ({overallProgressPct}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-950/90 rounded-full overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Priority Filter Bar */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-gray-400 font-medium">Filter Priority:</span>
          <div className="flex items-center gap-1.5">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterPriority === p
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900/80 text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <span className="text-gray-400 hidden sm:inline font-medium">
          Menampilkan <strong className="text-white">{filteredTasks.length}</strong> task cards
        </span>
      </div>

      {/* 3. 4-Column Trello Kanban Board */}
      <div className="overflow-x-auto pb-4 pt-1 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start lg:min-w-[1100px] xl:min-w-full">
          {columns.map((col, idx) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`glass-panel rounded-3xl p-4 flex flex-col space-y-3 bg-slate-950/40 border-t-4 ${col.border}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold text-sm ${col.color}`}>{col.title}</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white border border-white/10">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Trello Task Cards */}
                <div className="space-y-3 min-h-[320px]">
                  {colTasks.length === 0 ? (
                    <div className="h-32 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-xs text-gray-500 font-medium">
                      Belum ada task di kolom ini
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 space-y-3 relative shadow-lg"
                      >
                        {/* Priority Badge & Due Date */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              task.priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : task.priority === 'MEDIUM'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {task.priority} PRIORITY
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {task.dueDate}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white leading-snug">{task.title}</h4>
                          {task.description && (
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Assignee & Controls */}
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-600/50 border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-white">
                              {task.assignedTo.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-[10px] text-gray-300 font-semibold truncate max-w-[90px]">
                              {task.assignedTo.split(' ')[0]}
                            </span>
                          </div>

                          {/* Shift Status Controls */}
                          <div className="flex items-center gap-1">
                            {idx > 0 && (
                              <button
                                onClick={() => onMoveTask(task.id, columns[idx - 1].id)}
                                className="touch-target p-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-gray-300 hover:text-white transition-colors"
                                title="Pindah ke Kolom Sebelumnya"
                              >
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {idx < columns.length - 1 && (
                              <button
                                onClick={() => onMoveTask(task.id, columns[idx + 1].id)}
                                className="touch-target p-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-gray-300 hover:text-white transition-colors"
                                title="Pindah ke Kolom Berikutnya"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
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
      </div>

      {/* 4. Add Trello Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl space-y-4 border border-indigo-500/30 my-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Tambah Trello Task Card Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="touch-target text-gray-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-300 mb-1">Judul Task *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Audit Hardware & Setup K3s Cluster"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-300 mb-1">Deskripsi Pekerjaan</label>
                <textarea
                  rows={3}
                  placeholder="Detail spesifikasi teknis atau deliverable task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input placeholder-gray-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Status Initial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskColumnStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-slate-900 text-white focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review & QA</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-slate-900 text-white focus:outline-none"
                  >
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Assigned To</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-slate-900 text-white focus:outline-none"
                  >
                    {salesReps.map((rep) => (
                      <option key={rep} value={rep}>
                        {rep}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-slate-900 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="touch-target px-4 py-2 text-xs font-bold text-gray-400 hover:text-white rounded-xl hover:bg-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30"
                >
                  Simpan Task Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
