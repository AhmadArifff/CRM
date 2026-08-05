'use client';

import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Paperclip,
  Clock,
  Tag,
  User,
  Plus,
  Trash2,
  Upload,
  Eye,
  FileText,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { ProjectTask, TaskAttachment, TaskCheckitem, TaskColumnStatus } from '../../types/crm';
import { apiClient } from '../../services/apiClient';

interface TrelloCardDetailModalProps {
  task: ProjectTask;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedData: any) => void;
  onDeleteTask: (taskId: string) => void;
  salesReps: string[];
}

export const TrelloCardDetailModal: React.FC<TrelloCardDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  salesReps,
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState<TaskColumnStatus>(task.status);
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [tagText, setTagText] = useState(task.tagText || 'Feature');
  const [tagColor, setTagColor] = useState(task.tagColor || 'bg-rose-500');
  const [coverImage, setCoverImage] = useState(task.coverImage || '');
  const [isWatched, setIsWatched] = useState(task.isWatched || false);

  // Checklists State
  const [checklists, setChecklists] = useState<TaskCheckitem[]>(task.checklists || []);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Attachments State
  const [attachments, setAttachments] = useState<TaskAttachment[]>(task.attachments || []);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const totalChecklist = checklists.length;
  const completedChecklist = checklists.filter((c) => c.isCompleted).length;
  const checklistProgressPct = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await apiClient.uploadFile(file);
      if (res.success) {
        const newAtt: TaskAttachment = {
          id: `att-${Date.now()}`,
          fileName: res.data.fileName,
          fileUrl: res.data.fileUrl,
          fileType: res.data.fileType,
          fileSize: res.data.fileSize,
        };
        setAttachments((prev) => [...prev, newAtt]);

        // If file is image, ask if set as cover
        if (res.data.fileType.startsWith('image/')) {
          setCoverImage(res.data.fileUrl);
        }

        onUpdateTask({
          newAttachment: {
            fileName: res.data.fileName,
            fileUrl: res.data.fileUrl,
            fileType: res.data.fileType,
            fileSize: res.data.fileSize,
          },
          coverImage: res.data.fileType.startsWith('image/') ? res.data.fileUrl : coverImage,
        });
      }
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // Add Checklist Item
  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;

    const newItem: TaskCheckitem = {
      id: `check-${Date.now()}`,
      itemText: newChecklistText.trim(),
      isCompleted: false,
    };

    setChecklists((prev) => [...prev, newItem]);
    onUpdateTask({ newChecklistItem: newChecklistText.trim() });
    setNewChecklistText('');
  };

  // Toggle Checklist Item
  const handleToggleChecklist = (checkId: string) => {
    setChecklists((prev) =>
      prev.map((c) => (c.id === checkId ? { ...c, isCompleted: !c.isCompleted } : c))
    );
    onUpdateTask({ toggleChecklistId: checkId });
  };

  // Save Title or Description Changes
  const handleSaveDetails = () => {
    onUpdateTask({
      title,
      description,
      status,
      priority,
      dueDate,
      tagText,
      tagColor,
      coverImage,
      isWatched,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white text-[#172B4D] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-gray-200 space-y-0">
        {/* 1. Cover Image Preview (if present) */}
        {coverImage && (
          <div className="w-full h-44 bg-gray-100 relative overflow-hidden group border-b border-gray-200">
            <img src={coverImage} alt="Card Cover" className="w-full h-full object-cover" />
            <button
              onClick={() => {
                setCoverImage('');
                onUpdateTask({ coverImage: '' });
              }}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black text-white p-1.5 rounded-full text-xs font-bold transition-all"
              title="Hapus Cover Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Header: Title & Close Button */}
        <div className="p-5 pb-3 flex items-start justify-between gap-3 border-b border-gray-100">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#0052CC] shrink-0" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveDetails}
                className="text-base sm:text-lg font-bold text-[#172B4D] w-full border-b border-transparent hover:border-gray-300 focus:border-[#0052CC] focus:outline-none py-0.5"
              />
            </div>
            <p className="text-xs text-[#626F86] font-medium pl-7">
              di kolom <span className="font-bold underline text-[#172B4D]">{status}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsWatched(!isWatched);
                onUpdateTask({ isWatched: !isWatched });
              }}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isWatched ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{isWatched ? 'Watching' : 'Watch'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3. Main Modal Content Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Quick Meta Grid: Status, Priority, Tag, Due Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200/60">
            <div>
              <label className="block font-bold text-gray-500 mb-1">Status Kolom</label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as TaskColumnStatus);
                  onUpdateTask({ status: e.target.value });
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-semibold text-[#172B4D] focus:outline-none"
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">Doing</option>
                <option value="REVIEW">Testing</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-500 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value as any);
                  onUpdateTask({ priority: e.target.value });
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-semibold text-[#172B4D] focus:outline-none"
              >
                <option value="HIGH">🔴 Urgent</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-500 mb-1">Tag Label</label>
              <input
                type="text"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                onBlur={handleSaveDetails}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-semibold text-[#172B4D] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-500 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value);
                  onUpdateTask({ dueDate: e.target.value });
                }}
                className="w-full bg-white border border-gray-200 rounded-lg p-2 font-semibold text-[#172B4D] focus:outline-none"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#172B4D] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0052CC]" />
              Deskripsi Pekerjaan
            </h4>
            <textarea
              rows={3}
              placeholder="Tambahkan penjelasan rinci mengenai task ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDetails}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-[#0052CC] resize-none"
            />
          </div>

          {/* Interactive Checklist Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#172B4D] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#1F845A]" />
                Checklist Subtasks ({completedChecklist}/{totalChecklist})
              </h4>
              <span className="text-[11px] font-extrabold text-[#1F845A]">{checklistProgressPct}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
              <div
                className="h-full bg-[#1F845A] rounded-full transition-all duration-300"
                style={{ width: `${checklistProgressPct}%` }}
              />
            </div>

            {/* Checklist Items List */}
            <div className="space-y-2">
              {checklists.map((item) => (
                <div key={item.id} className="flex items-center gap-2.5 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleToggleChecklist(item.id)}
                    className="w-4 h-4 rounded text-[#1F845A] focus:ring-[#1F845A] cursor-pointer"
                  />
                  <span className={`text-xs ${item.isCompleted ? 'line-through text-gray-400 font-normal' : 'text-[#172B4D] font-semibold'}`}>
                    {item.itemText}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Checklist Form */}
            <form onSubmit={handleAddChecklistItem} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Tambah checklist item baru..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-[#1F845A] hover:bg-[#166343] text-white font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Tambah
              </button>
            </form>
          </div>

          {/* Attachments & File Upload Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#172B4D] text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#0052CC]" />
                Lampiran File & Gambar ({attachments.length})
              </h4>

              <label className="cursor-pointer bg-[#0052CC] hover:bg-[#0065FF] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 shadow transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx"
                />
              </label>
            </div>

            {isUploading && (
              <div className="p-3 bg-blue-50 text-[#0052CC] rounded-xl font-semibold animate-pulse text-center">
                Mengunggah file ke storage Supabase...
              </div>
            )}

            {/* Attachments List */}
            <div className="space-y-2">
              {attachments.map((att) => (
                <div key={att.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 truncate">
                    {att.fileType.startsWith('image/') ? (
                      <ImageIcon className="w-5 h-5 text-purple-600 shrink-0" />
                    ) : (
                      <FileText className="w-5 h-5 text-indigo-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <p className="font-bold text-[#172B4D] truncate">{att.fileName}</p>
                      <p className="text-[10px] text-gray-500">
                        {att.fileSize ? `${Math.round(att.fileSize / 1024)} KB` : 'Dokumen'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={att.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 bg-white text-[#0052CC] hover:bg-blue-50 border border-gray-200 rounded-lg font-bold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Footer: Action Buttons (Delete Card / Close) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin menghapus Trello card ini?')) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Card Trello</span>
          </button>

          <button
            onClick={() => {
              handleSaveDetails();
              onClose();
            }}
            className="px-5 py-2 bg-[#0052CC] hover:bg-[#0065FF] text-white font-bold rounded-xl shadow transition-colors"
          >
            Selesai & Simpan
          </button>
        </div>
      </div>
    </div>
  );
};
