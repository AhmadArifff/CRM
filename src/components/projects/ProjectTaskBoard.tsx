'use client';

import React, { useState, useRef } from 'react';
import {
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building,
  X,
  MoreHorizontal,
  GripVertical,
  Tag,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Eye,
  ChevronDown,
  Users,
  Calendar,
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

/* ── Trello‑style colour labels ── */
const LABEL_COLORS: Record<string, { bg: string; text: string; name: string }> = {
  HIGH: { bg: 'bg-[#F87168]', text: 'text-white', name: 'Urgent' },
  MEDIUM: { bg: 'bg-[#F5CD47]', text: 'text-gray-900', name: 'Medium' },
  LOW: { bg: 'bg-[#4BCE97]', text: 'text-gray-900', name: 'Low Priority' },
};

const COLUMN_COLORS: Record<TaskColumnStatus, string> = {
  TODO: '#579DFF',
  IN_PROGRESS: '#F5CD47',
  REVIEW: '#9F8FEF',
  DONE: '#4BCE97',
};

export const ProjectTaskBoard: React.FC<ProjectTaskBoardProps> = ({
  projects,
  tasks,
  onMoveTask,
  onAddTask,
  selectedProjectId,
  onSelectProject,
  salesReps,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addToColumn, setAddToColumn] = useState<TaskColumnStatus>('TODO');
  const [inlineAddColumn, setInlineAddColumn] = useState<TaskColumnStatus | null>(null);
  const [inlineTitle, setInlineTitle] = useState('');
  const inlineInputRef = useRef<HTMLTextAreaElement>(null);

  // Form state for modal
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskColumnStatus>('TODO');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [assignedTo, setAssignedTo] = useState(salesReps[0] || 'Ahmad Ariff');
  const [dueDate, setDueDate] = useState('2026-08-25');

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const columns: { id: TaskColumnStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'REVIEW', title: 'Review / QA' },
    { id: 'DONE', title: 'Done ✓' },
  ];

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.status === 'DONE').length;
  const overallProgressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddTask({ title, description, status, priority, assignedTo, dueDate });
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleInlineAdd = (colId: TaskColumnStatus) => {
    if (!inlineTitle.trim()) {
      setInlineAddColumn(null);
      return;
    }
    onAddTask({
      title: inlineTitle.trim(),
      description: '',
      status: colId,
      priority: 'MEDIUM',
      assignedTo: salesReps[0] || 'Ahmad Ariff',
      dueDate: '2026-08-30',
    });
    setInlineTitle('');
    setInlineAddColumn(null);
  };

  const openInlineAdd = (colId: TaskColumnStatus) => {
    setInlineAddColumn(colId);
    setInlineTitle('');
    setTimeout(() => inlineInputRef.current?.focus(), 50);
  };

  return (
    <div className="flex flex-col h-full pb-16 lg:pb-0 -mx-3.5 sm:-mx-6 lg:-mx-8 -mt-3.5 sm:-mt-6 lg:-mt-8">
      {/* ─── Trello‑style Top Toolbar ─── */}
      <div
        className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0"
        style={{ backgroundColor: 'rgba(16, 18, 30, 0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Board Title */}
          <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 shrink-0">
            <Sparkles className="w-5 h-5 text-[#579DFF]" />
            <span className="truncate max-w-[280px]">{currentProject?.name || 'Project Board'}</span>
          </h1>

          {/* Separator */}
          <div className="hidden sm:block w-px h-5 bg-white/20" />

          {/* Star / Watch */}
          <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="Watch Board">
            <Eye className="w-4 h-4" />
          </button>

          {/* Members */}
          <div className="flex items-center -space-x-1.5">
            {salesReps.slice(0, 3).map((rep, i) => (
              <div
                key={rep}
                className="w-7 h-7 rounded-full border-2 border-[#1d2125] flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: ['#579DFF', '#9F8FEF', '#F87168'][i] || '#579DFF', zIndex: 3 - i }}
                title={rep}
              >
                {(rep || 'U').substring(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Project Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors">
            <Building className="w-3.5 h-3.5" />
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer max-w-[200px] truncate"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1d2125] text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-white/10 text-white">
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4BCE97] rounded-full transition-all duration-500"
                style={{ width: `${overallProgressPct}%` }}
              />
            </div>
            <span className="font-medium text-[11px]">{overallProgressPct}%</span>
          </div>

          {/* Filter */}
          <button className="px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-white/20 text-white font-medium transition-colors flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      {/* ─── Board Canvas ─── */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden px-3 sm:px-4 pt-3 pb-4"
        style={{
          background: 'linear-gradient(135deg, #0f1724 0%, #131a2e 40%, #1a1333 100%)',
        }}
      >
        <div className="flex gap-3 items-start h-full" style={{ minWidth: 'max-content' }}>
          {columns.map((col, colIdx) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="flex flex-col rounded-xl shrink-0 w-[272px]"
                style={{ backgroundColor: '#101204', maxHeight: 'calc(100vh - 170px)' }}
              >
                {/* ── List Header ── */}
                <div className="flex items-center justify-between px-3 pt-3 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLUMN_COLORS[col.id] }} />
                    <h3 className="text-sm font-semibold text-[#B6C2CF]">{col.title}</h3>
                    <span className="text-[11px] text-[#8C9BAB] font-medium">{colTasks.length}</span>
                  </div>
                  <button className="p-1 rounded-md hover:bg-white/10 text-[#8C9BAB] hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* ── Card List (Scrollable) ── */}
                <div className="flex-1 overflow-y-auto px-2 pb-1 space-y-2 trello-scroll" style={{ minHeight: '120px' }}>
                  {colTasks.length === 0 && inlineAddColumn !== col.id && (
                    <div className="py-8 text-center text-xs text-[#5D6B7A] select-none">
                      Drop cards here
                    </div>
                  )}

                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group rounded-lg p-0 cursor-pointer transition-all hover:outline hover:outline-2 hover:outline-[#579DFF] hover:-translate-y-[1px]"
                      style={{ backgroundColor: '#22272B' }}
                    >
                      {/* Trello Label Strip */}
                      <div className="flex gap-1 px-3 pt-2.5 pb-1">
                        <span
                          className={`h-2 rounded-full ${LABEL_COLORS[task.priority]?.bg || 'bg-gray-500'}`}
                          style={{ width: '40px' }}
                          title={LABEL_COLORS[task.priority]?.name || task.priority}
                        />
                        {task.status === 'DONE' && (
                          <span className="h-2 w-8 rounded-full bg-[#4BCE97]" title="Completed" />
                        )}
                      </div>

                      {/* Card Title */}
                      <div className="px-3 pb-1.5">
                        <p className="text-sm text-[#B6C2CF] leading-snug font-medium">
                          {task.title}
                        </p>
                      </div>

                      {/* Card Footer: Badges + Avatar */}
                      <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                        <div className="flex items-center gap-2 text-[#8C9BAB]">
                          {/* Due Date Badge */}
                          {task.dueDate && (
                            <span
                              className={`flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-sm ${
                                task.status === 'DONE'
                                  ? 'bg-[#4BCE97]/20 text-[#4BCE97]'
                                  : 'hover:bg-white/10'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {task.dueDate}
                            </span>
                          )}

                          {/* Description indicator */}
                          {task.description && (
                            <span className="flex items-center" title="Ada deskripsi">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Avatar & Move Controls */}
                        <div className="flex items-center gap-1">
                          {/* Move arrows (visible on hover) */}
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {colIdx > 0 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onMoveTask(task.id, columns[colIdx - 1].id); }}
                                className="p-1 rounded hover:bg-white/15 text-[#8C9BAB] hover:text-white transition-colors"
                                title={`Pindah ke ${columns[colIdx - 1].title}`}
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {colIdx < columns.length - 1 && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onMoveTask(task.id, columns[colIdx + 1].id); }}
                                className="p-1 rounded hover:bg-white/15 text-[#8C9BAB] hover:text-white transition-colors"
                                title={`Pindah ke ${columns[colIdx + 1].title}`}
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* Assignee Avatar */}
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ml-0.5"
                            style={{ backgroundColor: '#579DFF' }}
                            title={task.assignedTo}
                          >
                            {(task.assignedTo || 'U').substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* ── Inline Add Card (Trello style) ── */}
                  {inlineAddColumn === col.id && (
                    <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#22272B' }}>
                      <textarea
                        ref={inlineInputRef}
                        rows={3}
                        placeholder="Masukkan judul untuk kartu ini..."
                        value={inlineTitle}
                        onChange={(e) => setInlineTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleInlineAdd(col.id);
                          }
                          if (e.key === 'Escape') {
                            setInlineAddColumn(null);
                          }
                        }}
                        className="w-full px-3 py-2 bg-transparent text-sm text-[#B6C2CF] placeholder-[#5D6B7A] focus:outline-none resize-none"
                      />
                      <div className="flex items-center gap-1.5 px-2 pb-2">
                        <button
                          onClick={() => handleInlineAdd(col.id)}
                          className="px-3 py-1.5 rounded-[4px] text-xs font-semibold text-[#1d2125] transition-colors"
                          style={{ backgroundColor: '#579DFF' }}
                        >
                          Add card
                        </button>
                        <button
                          onClick={() => setInlineAddColumn(null)}
                          className="p-1.5 rounded-[4px] hover:bg-white/10 text-[#8C9BAB] transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── List Footer: Add Card ── */}
                {inlineAddColumn !== col.id && (
                  <div className="px-2 pb-2 pt-1">
                    <button
                      onClick={() => openInlineAdd(col.id)}
                      className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-[#8C9BAB] hover:bg-white/10 hover:text-[#B6C2CF] transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add a card
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* ── "+ Add another list" column placeholder ── */}
          <div className="shrink-0 w-[272px]">
            <button
              onClick={() => {
                setAddToColumn('TODO');
                setIsAddModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
            >
              <Plus className="w-4 h-4" />
              Add another list
            </button>
          </div>
        </div>
      </div>

      {/* ─── Full Modal: Create Card with Details ─── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-xl shadow-2xl"
            style={{ backgroundColor: '#282E33' }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between p-4 pb-3">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-[#8C9BAB] mt-0.5" />
                <div>
                  <h3 className="text-base font-semibold text-[#B6C2CF]">Create New Card</h3>
                  <p className="text-xs text-[#8C9BAB] mt-0.5">
                    {currentProject?.name || 'Project Board'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-white/10 text-[#8C9BAB] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="px-4 pb-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#8C9BAB] mb-1.5 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter a title for this card..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] text-sm text-[#B6C2CF] placeholder-[#5D6B7A] focus:outline-none focus:ring-2 focus:ring-[#579DFF]"
                  style={{ backgroundColor: '#22272B', border: '1px solid rgba(255,255,255,0.1)' }}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#8C9BAB] mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Add a more detailed description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-[4px] text-sm text-[#B6C2CF] placeholder-[#5D6B7A] focus:outline-none focus:ring-2 focus:ring-[#579DFF] resize-none"
                  style={{ backgroundColor: '#22272B', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Row: Status + Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAB] mb-1.5 uppercase tracking-wide">
                    List
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskColumnStatus)}
                    className="w-full px-3 py-2 rounded-[4px] text-sm text-[#B6C2CF] focus:outline-none cursor-pointer"
                    style={{ backgroundColor: '#22272B', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review / QA</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAB] mb-1.5 uppercase tracking-wide">
                    Label
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="w-full px-3 py-2 rounded-[4px] text-sm text-[#B6C2CF] focus:outline-none cursor-pointer"
                    style={{ backgroundColor: '#22272B', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <option value="HIGH">🔴 Urgent</option>
                    <option value="MEDIUM">🟡 Medium</option>
                    <option value="LOW">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Row: Assigned To + Due Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAB] mb-1.5 uppercase tracking-wide">
                    Members
                  </label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] text-sm text-[#B6C2CF] focus:outline-none cursor-pointer"
                    style={{ backgroundColor: '#22272B', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    {salesReps.map((rep) => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8C9BAB] mb-1.5 uppercase tracking-wide">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-[4px] text-sm text-[#B6C2CF] focus:outline-none"
                    style={{ backgroundColor: '#22272B', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-[4px] text-sm font-medium text-[#B6C2CF] hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[4px] text-sm font-semibold text-[#1d2125] transition-all hover:brightness-110"
                  style={{ backgroundColor: '#579DFF' }}
                >
                  Create card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Custom scrollbar styles ─── */}
      <style jsx>{`
        .trello-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .trello-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        .trello-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }
        .trello-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.24);
        }
      `}</style>
    </div>
  );
};
