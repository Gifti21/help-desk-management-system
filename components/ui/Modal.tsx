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
