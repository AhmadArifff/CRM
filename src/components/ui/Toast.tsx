'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  text: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl glass-panel border flex items-center justify-between gap-3 shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-300 ${
        toast.type === 'success'
          ? 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200'
          : toast.type === 'error'
          ? 'border-rose-500/40 bg-rose-950/80 text-rose-200'
          : 'border-indigo-500/40 bg-indigo-950/80 text-indigo-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
        ) : toast.type === 'error' ? (
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        ) : (
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        )}
        <span className="text-xs font-semibold leading-tight">{toast.text}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="touch-target p-1 rounded-lg text-gray-400 hover:text-white shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
