import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { BODY_TEXT_GREY, PLACEHOLDER_TEXT, INPUT_BORDER, PAGE_BACKGROUND, TEAL_PRIMARY, PRIMARY_TEXT } from '@/lib/colors';
import { INPUT_REGULAR, FONT_FAMILY, FONT_WEIGHT } from '@/lib/fonts';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, iconPosition = 'left', className = '', type = 'text', ...props }, ref) => {
    const baseStyles = 'flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2';

    return (
      <div
        className={baseStyles}
        style={{
          borderColor: INPUT_BORDER,
          backgroundColor: PAGE_BACKGROUND,
          '--tw-ring-color': TEAL_PRIMARY,
          '--tw-ring-color-light': 'rgba(47, 217, 196, 0.2)',
        } as React.CSSProperties}
      >
        {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" style={{ color: PLACEHOLDER_TEXT }} />}
        <input
          ref={ref}
          type={type}
          className="w-full bg-transparent outline-none"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: INPUT_REGULAR.size,
            lineHeight: INPUT_REGULAR.lineHeight,
            fontWeight: FONT_WEIGHT.medium,
            letterSpacing: INPUT_REGULAR.letterSpacing,
            color: PRIMARY_TEXT,
          }}
          {...props}
        />
        {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" style={{ color: PLACEHOLDER_TEXT }} />}
      </div>
    );
  }
);

Input.displayName = 'Input';
