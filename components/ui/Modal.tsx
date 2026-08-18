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
"use client";

import { HTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { BORDER_GREY, BODY_TEXT_GREY, DARK_GREEN } from '@/lib/colors';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, className = '', ...props }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ backgroundColor: '#00000080' }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          borderColor: BORDER_GREY,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        {...props}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full transition hover:bg-gray-100"
          style={{ color: BODY_TEXT_GREY }}
        >
          <X className="h-5 w-5" />
        </button>

        <h2
          className="mb-6"
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: DARK_GREEN,
          }}
        >
          {title}
        </h2>

        {children}
      </div>
    </div>,
    document.body
  );
}
