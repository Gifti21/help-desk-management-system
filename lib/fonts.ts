/*
IMPORT EXAMPLES:

// Import individual font constants
import { FONT_FAMILY, HEADING_XL, BODY_TEXT } from '@/lib/fonts';

// Import the entire fonts object
import { fonts } from '@/lib/fonts';

// Import CSS variables for use in stylesheets
import { cssVariables } from '@/lib/fonts';

USAGE EXAMPLES:

// Using individual constants
const primaryFont = FONT_FAMILY.primary;
const headingSize = HEADING_XL.size;

// Using the fonts object
const headingFont = fonts.heading.xl;
const bodyFont = fonts.body.regular;

// Using in React components
<h1 style={{ fontFamily: FONT_FAMILY.primary, fontSize: HEADING_XL.size, fontWeight: HEADING_XL.weight }}>
  Heading
</h1>

// Using in CSS/Tailwind
<div style={{ fontFamily: FONT_FAMILY.primary, fontSize: BODY_TEXT.size, lineHeight: BODY_TEXT.lineHeight }}>
  Body text
</div>
*/

export const fonts = {
  // FONT FAMILIES
  fontFamily: {
    primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    secondary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Consolas", "Monaco", monospace',
  },

  // FONT WEIGHTS
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // HEADING SIZES
  heading: {
    xl: {
      size: '2.5rem',
      lineHeight: '1.2',
      weight: 700,
      letterSpacing: '-0.02em',
    },
    lg: {
      size: '2rem',
      lineHeight: '1.25',
      weight: 700,
      letterSpacing: '-0.015em',
    },
    md: {
      size: '1.5rem',
      lineHeight: '1.33',
      weight: 600,
      letterSpacing: '-0.01em',
    },
    sm: {
      size: '1.25rem',
      lineHeight: '1.4',
      weight: 600,
      letterSpacing: '-0.005em',
    },
    xs: {
      size: '1.125rem',
      lineHeight: '1.5',
      weight: 600,
      letterSpacing: '0em',
    },
  },

  // BODY TEXT SIZES
  body: {
    xl: {
      size: '1.125rem',
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '0em',
    },
    lg: {
      size: '1rem',
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '0em',
    },
    regular: {
      size: '0.9375rem',
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '0.005em',
    },
    sm: {
      size: '0.875rem',
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0.01em',
    },
    xs: {
      size: '0.8125rem',
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0.015em',
    },
  },

  // CAPTION/LABEL SIZES
  caption: {
    regular: {
      size: '0.75rem',
      lineHeight: '1.4',
      weight: 500,
      letterSpacing: '0.02em',
    },
    small: {
      size: '0.6875rem',
      lineHeight: '1.4',
      weight: 500,
      letterSpacing: '0.025em',
    },
  },

  // INPUT SIZES
  input: {
    regular: {
      size: '0.9375rem',
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0.005em',
    },
  },

  // BUTTON SIZES
  button: {
    sm: {
      size: '0.875rem',
      lineHeight: '1.4',
      weight: 500,
      letterSpacing: '0.01em',
    },
    regular: {
      size: '0.9375rem',
      lineHeight: '1.5',
      weight: 500,
      letterSpacing: '0.005em',
    },
    lg: {
      size: '1rem',
      lineHeight: '1.5',
      weight: 500,
      letterSpacing: '0em',
    },
  },
} as const;

export const FONT_FAMILY = fonts.fontFamily;
export const FONT_WEIGHT = fonts.fontWeight;
export const HEADING_XL = fonts.heading.xl;
export const HEADING_LG = fonts.heading.lg;
export const HEADING_MD = fonts.heading.md;
export const HEADING_SM = fonts.heading.sm;
export const HEADING_XS = fonts.heading.xs;
export const BODY_XL = fonts.body.xl;
export const BODY_LG = fonts.body.lg;
export const BODY_REGULAR = fonts.body.regular;
export const BODY_SM = fonts.body.sm;
export const BODY_XS = fonts.body.xs;
export const CAPTION_REGULAR = fonts.caption.regular;
export const CAPTION_SMALL = fonts.caption.small;
export const INPUT_REGULAR = fonts.input.regular;
export const BUTTON_SM = fonts.button.sm;
export const BUTTON_REGULAR = fonts.button.regular;
export const BUTTON_LG = fonts.button.lg;

export const cssVariables = {
  '--font-family-primary': fonts.fontFamily.primary,
  '--font-family-secondary': fonts.fontFamily.secondary,
  '--font-family-mono': fonts.fontFamily.mono,
  '--font-weight-light': fonts.fontWeight.light,
  '--font-weight-regular': fonts.fontWeight.regular,
  '--font-weight-medium': fonts.fontWeight.medium,
  '--font-weight-semibold': fonts.fontWeight.semibold,
  '--font-weight-bold': fonts.fontWeight.bold,
} as const;
