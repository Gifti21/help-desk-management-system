'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { colors } from '@/lib/colors';

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
  const { colors: theme } = useTheme();

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: '#FEE2E2',
          iconColor: '#DC2626',
          buttonBg: '#EF4444',
          buttonText: '#FFFFFF',
        };
      case 'warning':
        return {
          iconBg: '#FEF3C7',
          iconColor: '#D97706',
          buttonBg: '#F59E0B',
          buttonText: '#000000',
        };
      case 'default':
        return {
          iconBg: '#DBEAFE',
          iconColor: colors.tealPrimary,
          buttonBg: colors.tealPrimary,
          buttonText: '#16332B',
        };
      default:
        return {
          iconBg: '#FEE2E2',
          iconColor: '#DC2626',
          buttonBg: '#EF4444',
          buttonText: '#FFFFFF',
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
      <div
        className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-[scaleIn_0.2s_ease-out]"
        style={{
          backgroundColor: theme.card,
          borderColor: theme.cardBorder,
          border: '1px solid',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:opacity-80 transition-colors"
          style={{
            color: colors.bodyTextGrey,
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{
              backgroundColor: styles.iconBg,
              color: styles.iconColor,
            }}
          >
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3
            className="text-lg font-bold mb-2"
            style={{ color: theme.foreground }}
          >
            {title}
          </h3>
          <p
            className="text-sm mb-6 max-w-sm"
            style={{ color: colors.bodyTextGrey }}
          >
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors"
              style={{
                backgroundColor: colors.lightTealBg,
                color: theme.foreground,
              }}
            >
              {cancelLabel}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors hover:opacity-90"
              style={{
                backgroundColor: styles.buttonBg,
                color: styles.buttonText,
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
