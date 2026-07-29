'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a no-op fallback so pages don't crash if used outside provider
    return {
      toasts: [],
      toast: (message: string, _type?: ToastType) => {
        console.log(`[Toast] ${message}`);
      },
      dismiss: (_id: string) => { },
    };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = iconMap[toast.type];

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[var(--success)] text-[var(--success-foreground)] border-[var(--success)]';
      case 'error':
        return 'bg-[var(--error)] text-[var(--error-foreground)] border-[var(--error)]';
      case 'warning':
        return 'bg-[var(--warning)] text-[var(--warning-foreground)] border-[var(--warning)]';
      case 'info':
        return 'bg-[var(--info)] text-[var(--info-foreground)] border-[var(--info)]';
      default:
        return 'bg-[var(--card)] text-[var(--card-foreground)] border-[var(--card-border)]';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-[slideIn_0.3s_ease-out] ${getToastStyles()}`}
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0" />
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4 opacity-70" />
      </button>
    </div>
  );
}
