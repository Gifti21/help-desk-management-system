'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'default';
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
          button: 'bg-[var(--error)] text-[var(--error-foreground)] hover:opacity-90',
        };
      case 'warning':
        return {
          icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
          button: 'bg-[var(--warning)] text-[var(--warning-foreground)] hover:opacity-90',
        };
      case 'default':
        return {
          icon: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
          button: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]',
        };
      default:
        return {
          icon: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
          button: 'bg-[var(--error)] text-[var(--error-foreground)] hover:opacity-90',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-[scaleIn_0.2s_ease-out]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[var(--accent)] text-[var(--foreground-muted)] hover:text-[var(--accent-foreground)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full ${styles.icon} flex items-center justify-center mb-4`}>
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-[var(--card-foreground)] mb-2">{title}</h3>
          <p className="text-sm text-[var(--foreground-muted)] mb-6 max-w-sm">{message}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] rounded-xl transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${styles.button}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
