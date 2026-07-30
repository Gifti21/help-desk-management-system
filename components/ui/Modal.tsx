'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { DARK_GREEN, PAGE_BACKGROUND, PRIMARY_TEXT } from '@/lib/colors';
import { FONT_FAMILY, HEADING_SM } from '@/lib/fonts';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${sizeClasses[size]} rounded-2xl border shadow-2xl`}
        style={{
          backgroundColor: PAGE_BACKGROUND,
          borderColor: '#E3ECE8',
          fontFamily: FONT_FAMILY.primary,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className="flex items-start justify-between border-b px-6 py-4"
          style={{ borderColor: '#E3ECE8' }}
        >
          <div>
            <h2
              id="modal-title"
              style={{
                color: PRIMARY_TEXT,
                fontSize: HEADING_SM.size,
                fontWeight: HEADING_SM.weight,
              }}
            >
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm" style={{ color: '#6B6E6C' }}>
                {subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-[#E5F9F6]"
            style={{ color: DARK_GREEN }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
