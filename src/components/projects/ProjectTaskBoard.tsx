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
  Tag,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Eye,
  ChevronDown,
  Users,
  Calendar,
  Share2,
  Star,
  Search,
  Filter,
  Inbox,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Bell,
} from 'lucide-react';
import { Project, ProjectTask, TaskColumnStatus } from '../../types/crm';

import { TrelloCardDetailModal } from './TrelloCardDetailModal';

interface ProjectTaskBoardProps {
  projects: Project[];
  tasks: ProjectTask[];
  onMoveTask: (taskId: string, newStatus: TaskColumnStatus) => void;
  onAddTask: (newTask: Omit<ProjectTask, 'id' | 'createdAt' | 'projectId'>) => void;
  onUpdateTaskDetail?: (taskId: string, updates: any) => void;
  onDeleteTask?: (taskId: string) => void;
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  salesReps: string[];
}

export const ProjectTaskBoard: React.FC<ProjectTaskBoardProps> = ({
  projects,
  tasks,
  onMoveTask,
  onAddTask,
  onUpdateTaskDetail,
  onDeleteTask,
  selectedProjectId,
  onSelectProject,
  salesReps,
}) => {
  const [activeView, setActiveView] = useState<'board' | 'planner' | 'inbox'>('board');
  const [showLeftCalendar, setShowLeftCalendar] = useState(true);
  const [showFilterBanner, setShowFilterBanner] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDetailTask, setActiveDetailTask] = useState<ProjectTask | null>(null);
  const [addToColumn, setAddToColumn] = useState<string>('TODO');
  const [inlineAddColumn, setInlineAddColumn] = useState<string | null>(null);
  const [inlineTitle, setInlineTitle] = useState('');
  const inlineInputRef = useRef<HTMLTextAreaElement>(null);

  // Modal Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskColumnStatus>('TODO');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [assignedTo, setAssignedTo] = useState(salesReps[0] || 'Ahmad Ariff');
  const [dueDate, setDueDate] = useState('2026-07-30');
  const [tagText, setTagText] = useState('Reservasi');
  const [coverImage, setCoverImage] = useState('');

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // 5 Trello Columns matching reference screenshot: Backlog, Todo, Doing, Testing, Done
  const columns: { id: string; title: string; statusMapping: TaskColumnStatus }[] = [
    { id: 'BACKLOG', title: 'Backlog', statusMapping: 'TODO' },
    { id: 'TODO', title: 'Todo', statusMapping: 'TODO' },
    { id: 'DOING', title: 'Doing', statusMapping: 'IN_PROGRESS' },
    { id: 'TESTING', title: 'Testing', statusMapping: 'REVIEW' },
    { id: 'DONE', title: 'Done', statusMapping: 'DONE' },
  ];

  // Mock initial detailed Trello cards matching screenshot if tasks empty or for rich demonstration
  const richMockTasks: (ProjectTask & {
    colId: string;
    coverImage?: string;
    commentsCount?: number;
    attachmentsCount?: number;
    checklistTotal?: number;
    checklistCompleted?: number;
    tagText?: string;
    tagColor?: string;
    isWatched?: boolean;
    isOverdue?: boolean;
    members?: string[];
  })[] = [
    // Testing column cards
    {
      id: 'trello-card-1',
      projectId: selectedProjectId,
      colId: 'TESTING',
      title: 'Setting nilai konsesi bandara',
      description: 'Konfigurasi persentase tarif konsesi bandara di modul reservasi',
      status: 'REVIEW',
      priority: 'HIGH',
      assignedTo: 'IS',
      dueDate: '2026-08-10',
      createdAt: '2026-08-01',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      commentsCount: 1,
      attachmentsCount: 1,
      checklistTotal: 3,
      checklistCompleted: 3,
      tagText: 'Reservasi',
      tagColor: 'bg-amber-500',
      isWatched: true,
      members: ['IS', 'AA'],
    },
    {
      id: 'trello-card-2',
      projectId: selectedProjectId,
      colId: 'TESTING',
      title: 'Tambah management fae dan consession_airport di transaksi detail',
      description: 'Penambahan kolom penyesuaian biaya airport fee dan konsesi',
      status: 'REVIEW',
      priority: 'HIGH',
      assignedTo: 'AA',
      dueDate: '2026-08-12',
      createdAt: '2026-08-02',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      commentsCount: 0,
      attachmentsCount: 0,
      checklistTotal: 0,
      checklistCompleted: 0,
      tagText: 'Feature',
      tagColor: 'bg-rose-500',
      isWatched: false,
      members: ['AA'],
    },
    // Done column cards
    {
      id: 'trello-card-3',
      projectId: selectedProjectId,
      colId: 'DONE',
      title: 'Kamis 30-7-2026 (tes semua proses reservasi surjaya)',
      description: 'Pengujian end-to-end booking tiket & reservasi penerbangan',
      status: 'DONE',
      priority: 'HIGH',
      assignedTo: 'AA',
      dueDate: '2026-07-30',
      createdAt: '2026-07-28',
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
      commentsCount: 1,
      attachmentsCount: 1,
      checklistTotal: 0,
      checklistCompleted: 0,
      tagText: 'BAST Selesai',
      tagColor: 'bg-rose-600',
      isWatched: false,
      isOverdue: true,
      members: ['AA', 'IS'],
    },
    {
      id: 'trello-card-4',
      projectId: selectedProjectId,
      colId: 'DONE',
      title: 'Menu transaksi online + verifikasi',
      description: 'Integrasi payment gateway BCA & QRIS dengan konfirmasi otomatis',
      status: 'DONE',
      priority: 'MEDIUM',
      assignedTo: 'IS',
      dueDate: '2026-08-05',
      createdAt: '2026-08-01',
      coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      commentsCount: 2,
      attachmentsCount: 2,
      checklistTotal: 2,
      checklistCompleted: 2,
      tagText: 'Online Payment',
      tagColor: 'bg-rose-500',
      isWatched: true,
      members: ['IS', 'AA'],
    },
  ];

  // Map API tasks or fallback to rich mock cards
  const displayCards = tasks.length > 0
    ? tasks.map((t, idx) => ({
        ...t,
        colId: t.status === 'TODO' ? (idx % 2 === 0 ? 'BACKLOG' : 'TODO') : t.status === 'IN_PROGRESS' ? 'DOING' : t.status === 'REVIEW' ? 'TESTING' : 'DONE',
        commentsCount: (t as any).commentsCount ?? (idx % 2 === 0 ? 1 : 0),
        attachmentsCount: (t as any).attachmentsCount ?? (idx % 3 === 0 ? 1 : 0),
        checklistTotal: (t as any).checklistTotal ?? (idx === 0 ? 3 : 0),
        checklistCompleted: (t as any).checklistCompleted ?? (idx === 0 ? 3 : 0),
        tagText: (t as any).tagText || (t.priority === 'HIGH' ? 'Urgent' : 'Feature'),
        tagColor: (t as any).tagColor || (t.priority === 'HIGH' ? 'bg-rose-500' : 'bg-blue-500'),
        coverImage: (t as any).coverImage || (idx % 2 === 0 ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80' : undefined),
        members: [t.assignedTo.substring(0, 2).toUpperCase(), 'IS'],
      }))
    : richMockTasks;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddTask({
      title,
      description,
      status: (status as TaskColumnStatus) || 'TODO',
      priority,
      assignedTo,
      dueDate,
    });
    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleInlineAdd = (colId: string) => {
    if (!inlineTitle.trim()) {
      setInlineAddColumn(null);
      return;
    }
    const targetStatus: TaskColumnStatus =
      colId === 'DONE' ? 'DONE' : colId === 'TESTING' ? 'REVIEW' : colId === 'DOING' ? 'IN_PROGRESS' : 'TODO';

    onAddTask({
      title: inlineTitle.trim(),
      description: '',
      status: targetStatus,
      priority: 'MEDIUM',
      assignedTo: salesReps[0] || 'Ahmad Ariff',
      dueDate: '2026-08-25',
    });
    setInlineTitle('');
    setInlineAddColumn(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#0079BF] -mx-3.5 sm:-mx-6 lg:-mx-8 -mt-3.5 sm:-mt-6 lg:-mt-8 min-h-[calc(100vh-64px)] relative select-none">
      {/* ── 1. Top Announcement / System Bar (Matching exact Atlassian banner in screenshot) ── */}
      <div className="bg-white text-gray-800 px-4 py-2 text-xs flex items-center justify-between border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center gap-2 truncate">
          <span className="text-gray-600 font-normal">
            Our updated legal terms go into effect on August 17, 2026 and apply to all Atlassian cloud customers.
          </span>
          <a href="#" className="text-[#0052CC] hover:underline font-semibold flex items-center gap-0.5">
            Review the terms
          </a>
        </div>
        <button
          onClick={() => {}}
          className="text-gray-400 hover:text-gray-700 p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── 2. Active Filters Notification Bar (Purple Filter Banner in screenshot) ── */}
      {showFilterBanner && (
        <div className="bg-[#091E42]/90 text-white px-4 py-1.5 text-xs flex items-center justify-between border-b border-white/10 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-purple-300" />
            <span className="font-medium text-purple-100">This board currently has filters applied.</span>
            <button
              onClick={() => {}}
              className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded text-[11px] font-semibold transition-colors"
            >
              Clear filters
            </button>
          </div>
          <button
            onClick={() => setShowFilterBanner(false)}
            className="text-white/70 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 3. Trello Board Top Navigation Header (Matching screenshot header) ── */}
      <div className="bg-[#005A9E]/80 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-white border-b border-white/10 shrink-0">
        {/* Left Title & Members */}
        <div className="flex items-center gap-3">
          {/* Board Title Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md font-bold text-sm sm:text-base cursor-pointer transition-colors">
            <span>Task List</span>
            <span className="text-xs text-white/70">[[]</span>
            <ChevronDown className="w-4 h-4 text-white/80" />
          </div>

          {/* Member Avatars Stack */}
          <div className="flex items-center -space-x-1.5">
            <div className="w-7 h-7 rounded-full bg-cyan-600 border-2 border-[#005A9E] flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="Ahmad Ariff">
              AA
            </div>
            <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-[#005A9E] flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="Ir. Budi Santoso">
              IS
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-600 border-2 border-[#005A9E] flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title="Siti Nurhaliza">
              SN
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-[#005A9E] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              +2
            </div>
          </div>
        </div>

        {/* Right Header Actions (Filter Count 12, Clear all, Star, Users, Share, Menu) */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {/* Filter Badge 12 */}
          <div className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-md font-semibold cursor-pointer transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span className="w-4 h-4 rounded-full bg-white text-[#005A9E] flex items-center justify-center text-[10px] font-bold">12</span>
          </div>

          <button className="bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-md font-medium transition-colors">
            Clear all
          </button>

          <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors" title="Star Board">
            <Star className="w-4 h-4" />
          </button>

          <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors" title="Board Visibility">
            <Users className="w-4 h-4" />
          </button>

          <button className="flex items-center gap-1.5 bg-white text-[#005A9E] hover:bg-gray-100 px-3 py-1.5 rounded-md font-bold transition-colors shadow-sm">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors" title="More Options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── 4. Main Body: Split View (Left Calendar Sidebar + Right Trello Canvas) ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── LEFT SIDEBAR: Calendar & Planner Panel (Exact left widget in user screenshot) ── */}
        {showLeftCalendar && (
          <div className="w-64 sm:w-72 bg-white text-gray-800 border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto hidden md:flex shadow-xl z-10 transition-all duration-300">
            {/* Calendar Controls Header */}
            <div className="p-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-md text-xs font-bold text-gray-700">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Aug</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </div>

                <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5 text-xs text-gray-600 font-medium">
                  <button className="p-1 hover:bg-white rounded"><ChevronLeft className="w-3.5 h-3.5" /></button>
                  <span className="px-1 text-[11px] font-bold">Today</span>
                  <button className="p-1 hover:bg-white rounded"><ChevronRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-400">
                <button className="p-1 hover:text-gray-700"><MoreHorizontal className="w-4 h-4" /></button>
                <button onClick={() => setShowLeftCalendar(false)} className="p-1 hover:text-gray-700"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Current Day Pill Header */}
            <div className="p-3 bg-purple-50/50 border-b border-purple-100 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">Wednesday</span>
              <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center shadow">
                5
              </span>
            </div>

            {/* Hourly Schedule Timeline (GMT+7) */}
            <div className="p-3 space-y-4 text-xs font-medium text-gray-400">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">GMT+7 Timeline</div>

              {[
                { time: '9 am', task: undefined },
                { time: '10 am', task: 'Sprint Planning & Standup' },
                { time: '11 am', task: undefined },
                { time: '12 pm', task: 'Lunch & Rest' },
                { time: '1 pm', task: 'Testing Reservasi Surjaya' },
                { time: '2 pm', task: undefined },
                { time: '3 pm', task: 'Review Airport Fee API' },
                { time: '4 pm', task: undefined },
              ].map((slot, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <span className="w-10 text-[11px] text-gray-400 pt-0.5 shrink-0">{slot.time}</span>
                  <div className="flex-1 border-t border-gray-100 pt-1 group-hover:border-indigo-200 transition-colors">
                    {slot.task ? (
                      <div className="bg-indigo-50 border-l-2 border-indigo-600 p-1.5 rounded text-[11px] font-semibold text-indigo-900 shadow-sm">
                        {slot.task}
                      </div>
                    ) : (
                      <div className="h-5 hover:bg-gray-50 rounded border border-dashed border-transparent hover:border-gray-200 cursor-pointer" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RIGHT BOARD CANVAS: 5 Light Columns + Cards (Exact look of screenshot) ── */}
        <div className="flex-1 overflow-x-auto p-4 flex items-start gap-3 scroll-smooth">
          {columns.map((col) => {
            const colCards = displayCards.filter((c) => c.colId === col.id);

            return (
              <div
                key={col.id}
                className="w-72 sm:w-80 bg-[#F1F2F4] rounded-xl flex flex-col shrink-0 max-h-[calc(100vh-180px)] shadow-md border border-black/5"
              >
                {/* Column Header */}
                <div className="p-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#172B4D] leading-tight">{col.title}</h3>
                    <p className="text-[11px] text-[#626F86] font-medium mt-0.5">
                      {colCards.length} {colCards.length === 1 ? 'card' : 'cards'} match filters
                    </p>
                  </div>
                  <button className="text-[#626F86] hover:text-[#172B4D] p-1 hover:bg-black/5 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Cards List Container */}
                <div className="flex-1 overflow-y-auto px-2.5 space-y-2.5 pb-2">
                  {colCards.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setActiveDetailTask(card as any)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200/80 overflow-hidden cursor-pointer group transition-all hover:ring-2 hover:ring-[#0052CC]/50"
                    >
                      {/* Cover Screenshot Image (if available) */}
                      {card.coverImage && (
                        <div className="w-full h-32 bg-gray-100 overflow-hidden relative border-b border-gray-100">
                          <img
                            src={card.coverImage}
                            alt={card.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Card Content Padding */}
                      <div className="p-3 space-y-2">
                        {/* Red / Colored Tag Badge */}
                        {card.tagText && (
                          <div className="flex items-center gap-1">
                            <span
                              className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${
                                card.tagColor || 'bg-rose-500'
                              } inline-block`}
                            >
                              {card.tagText}
                            </span>
                          </div>
                        )}

                        {/* Card Title */}
                        <h4 className="text-xs sm:text-sm font-semibold text-[#172B4D] leading-snug">
                          {card.title}
                        </h4>

                        {/* Card Badges Row: Watch, Comment, Attachment, Checklist, Due Date & Avatars */}
                        <div className="pt-1 flex items-center justify-between text-[#626F86] text-[11px] font-medium flex-wrap gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Watch Icon */}
                            {card.isWatched && (
                              <span title="You are watching this card">
                                <Eye className="w-3.5 h-3.5 text-gray-500" />
                              </span>
                            )}

                            {/* Comment Count Badge */}
                            {(card.commentsCount ?? 0) > 0 && (
                              <span className="flex items-center gap-0.5" title="Comments">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>{card.commentsCount}</span>
                              </span>
                            )}

                            {/* Attachment Count Badge */}
                            {(card.attachmentsCount ?? 0) > 0 && (
                              <span className="flex items-center gap-0.5" title="Attachments">
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>{card.attachmentsCount}</span>
                              </span>
                            )}

                            {/* Checklist Badge (Green background when 100% complete like screenshot!) */}
                            {(card.checklistTotal ?? 0) > 0 && (
                              <span
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                                  card.checklistCompleted === card.checklistTotal
                                    ? 'bg-[#1F845A] text-white'
                                    : 'bg-gray-100 text-[#172B4D]'
                                }`}
                                title="Checklist items"
                              >
                                <CheckSquare className="w-3 h-3" />
                                <span>
                                  {card.checklistCompleted}/{card.checklistTotal}
                                </span>
                              </span>
                            )}

                            {/* Overdue / Due Date Badge (Red when overdue like screenshot!) */}
                            {card.dueDate && (
                              <span
                                className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  card.isOverdue
                                    ? 'bg-[#C9372C] text-white'
                                    : 'bg-gray-100 text-[#172B4D]'
                                }`}
                              >
                                <Clock className="w-3 h-3" />
                                <span>{card.dueDate}</span>
                              </span>
                            )}
                          </div>

                          {/* Member Avatars Stack */}
                          <div className="flex items-center -space-x-1.5 ml-auto">
                            {(card.members || ['AA']).map((m, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 rounded-full bg-[#0052CC] border border-white text-[9px] font-bold text-white flex items-center justify-center shadow-xs"
                                title={m}
                              >
                                {m}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Inline Add Card Input */}
                  {inlineAddColumn === col.id && (
                    <div className="bg-white rounded-lg p-2.5 border border-gray-300 shadow-sm space-y-2">
                      <textarea
                        ref={inlineInputRef}
                        rows={2}
                        placeholder="Enter a title for this card..."
                        value={inlineTitle}
                        onChange={(e) => setInlineTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleInlineAdd(col.id);
                          }
                          if (e.key === 'Escape') setInlineAddColumn(null);
                        }}
                        className="w-full text-xs text-[#172B4D] placeholder-gray-400 border-0 focus:outline-none resize-none"
                      />
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <button
                          onClick={() => handleInlineAdd(col.id)}
                          className="bg-[#0052CC] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#0065FF] transition-colors"
                        >
                          Add card
                        </button>
                        <button
                          onClick={() => setInlineAddColumn(null)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Column Footer: + Add a card button */}
                {inlineAddColumn !== col.id && (
                  <div className="p-2 border-t border-black/5 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setInlineAddColumn(col.id);
                        setInlineTitle('');
                        setTimeout(() => inlineInputRef.current?.focus(), 50);
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#44546F] hover:bg-black/5 w-full p-2 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#44546F]" />
                      <span>Add a card</span>
                    </button>
                    <button className="text-[#626F86] hover:text-[#172B4D] p-1.5 hover:bg-black/5 rounded">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Bottom Floating View Switcher Bar (Exact pill switcher in screenshot) ── */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white rounded-full p-1.5 shadow-2xl border border-gray-200 flex items-center gap-1 text-xs font-bold text-gray-700">
          <button
            onClick={() => setActiveView('inbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeView === 'inbox' ? 'bg-[#E9F2FF] text-[#0052CC]' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Inbox</span>
          </button>

          <button
            onClick={() => {
              setActiveView('planner');
              setShowLeftCalendar(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeView === 'planner' || showLeftCalendar ? 'bg-[#E9F2FF] text-[#0052CC]' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Planner</span>
          </button>

          <button
            onClick={() => setActiveView('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeView === 'board' ? 'bg-[#0052CC] text-white shadow' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Board</span>
          </button>

          <div className="w-px h-4 bg-gray-200 mx-1" />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Switch boards</span>
          </button>
        </div>
      </div>

      {/* ── 6. Full Card Creator Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-gray-900 w-full max-w-lg p-6 rounded-2xl space-y-4 shadow-2xl border border-gray-100 my-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0052CC]" />
                Tambah Trello Card Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs font-medium">
              <div>
                <label className="block text-gray-700 mb-1 font-bold">Judul Card *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Setting nilai konsesi bandara"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-bold">Deskripsi Pekerjaan</label>
                <textarea
                  rows={3}
                  placeholder="Detail spesifikasi teknis..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 font-bold">Status Kolom</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskColumnStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  >
                    <option value="TODO">Todo / Backlog</option>
                    <option value="IN_PROGRESS">Doing</option>
                    <option value="REVIEW">Testing</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-bold">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  >
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 mb-1 font-bold">Assigned To</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  >
                    {salesReps.map((rep) => (
                      <option key={rep} value={rep}>{rep}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1 font-bold">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-xl bg-[#0052CC] hover:bg-[#0065FF] shadow"
                >
                  Simpan Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 7. Trello Card Detail Modal ── */}
      {activeDetailTask && (
        <TrelloCardDetailModal
          task={activeDetailTask}
          isOpen={!!activeDetailTask}
          onClose={() => setActiveDetailTask(null)}
          onUpdateTask={(updates) => {
            if (onUpdateTaskDetail && activeDetailTask) {
              onUpdateTaskDetail(activeDetailTask.id, updates);
            }
          }}
          onDeleteTask={(taskId) => {
            if (onDeleteTask) {
              onDeleteTask(taskId);
            }
          }}
          salesReps={salesReps}
        />
      )}
    </div>
  );
};
