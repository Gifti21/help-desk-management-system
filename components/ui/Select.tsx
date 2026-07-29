import { INPUT_BORDER, TEAL_PRIMARY, DARK_GREEN, BODY_TEXT_GREY, PRIMARY_TEXT, ERROR, PAGE_BACKGROUND } from "@/lib/colors";
import { INPUT_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className = "", ...props }: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label
          className="mb-2 block font-semibold"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: INPUT_REGULAR.size,
            lineHeight: INPUT_REGULAR.lineHeight,
            fontWeight: FONT_WEIGHT.semibold,
            letterSpacing: INPUT_REGULAR.letterSpacing,
            color: DARK_GREEN,
          }}
        >
          {label}
        </label>
      )}
      <select
        className="w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: INPUT_REGULAR.size,
          lineHeight: INPUT_REGULAR.lineHeight,
          fontWeight: INPUT_REGULAR.weight,
          letterSpacing: INPUT_REGULAR.letterSpacing,
          color: PRIMARY_TEXT,
          borderColor: error ? ERROR.border : INPUT_BORDER,
          backgroundColor: PAGE_BACKGROUND,
          '--tw-ring-color': TEAL_PRIMARY,
          '--tw-ring-color-light': 'rgba(47, 217, 196, 0.2)',
        } as React.CSSProperties}
        {...props}
      />
      {error && (
        <p
          className="mt-2"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: INPUT_REGULAR.size,
            lineHeight: INPUT_REGULAR.lineHeight,
            fontWeight: INPUT_REGULAR.weight,
            letterSpacing: INPUT_REGULAR.letterSpacing,
            color: ERROR.text,
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
