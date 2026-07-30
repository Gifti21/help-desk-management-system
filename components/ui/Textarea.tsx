import React from 'react';
import {
  BODY_TEXT_GREY,
  BORDER_GREY,
  PAGE_BACKGROUND,
  PRIMARY_TEXT,
} from '@/lib/colors';
import { BODY_SM, CAPTION_REGULAR, FONT_FAMILY, INPUT_REGULAR } from '@/lib/fonts';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label ? (
          <label
            htmlFor={textareaId}
            style={{
              color: BODY_TEXT_GREY,
              fontFamily: FONT_FAMILY.primary,
              fontSize: CAPTION_REGULAR.size,
              fontWeight: CAPTION_REGULAR.weight,
            }}
          >
            {label}
          </label>
        ) : null}

        <textarea
          ref={ref}
          id={textareaId}
          className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#2FD9C4]/30"
          style={{
            backgroundColor: PAGE_BACKGROUND,
            borderColor: error ? '#DC2626' : BORDER_GREY,
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY.primary,
            fontSize: INPUT_REGULAR.size,
            lineHeight: INPUT_REGULAR.lineHeight,
          }}
          aria-invalid={Boolean(error)}
          {...props}
        />

        {error ? (
          <p style={{ color: '#DC2626', fontSize: CAPTION_REGULAR.size }}>{error}</p>
        ) : hint ? (
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
