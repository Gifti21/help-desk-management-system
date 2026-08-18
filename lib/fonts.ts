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
  // BUTTON TEXT
  button: {
    lg: {
      size: '1rem',
      lineHeight: '1.5',
      weight: 600,
      letterSpacing: '0.01em',
    },
    regular: {
      size: '0.9375rem',
      lineHeight: '1.5',
      weight: 600,
      letterSpacing: '0.01em',
    },
    sm: {
      size: '0.875rem',
      lineHeight: '1.4',
      weight: 600,
      letterSpacing: '0.015em',
    },
  },

  // INPUT TEXT
  input: {
    regular: {
      size: '0.9375rem',
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0.005em',
    },
    placeholder: {
      size: '0.9375rem',
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0.005em',
    },
  },

  // CODE/MONO TEXT
  code: {
    regular: {
      size: '0.875rem',
      lineHeight: '1.6',
      weight: 400,
      letterSpacing: '0em',
    },
    small: {
      size: '0.8125rem',
      lineHeight: '1.5',
      weight: 400,
      letterSpacing: '0em',
    },
  },
} as const;

export const FONT_FAMILY = fonts.fontFamily;
export const FONT_WEIGHT = fonts.fontWeight;
export const HEADING = fonts.heading;
export const BODY_TEXT = fonts.body;
export const CAPTION = fonts.caption;
export const BUTTON_TEXT = fonts.button;
export const INPUT_TEXT = fonts.input;
export const CODE_TEXT = fonts.code;

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

export const CAPTION_REGULAR = fonts.caption.regular;
export const CAPTION_SMALL = fonts.caption.small;

export const BUTTON_LG = fonts.button.lg;
export const BUTTON_REGULAR = fonts.button.regular;
export const BUTTON_SM = fonts.button.sm;

export const INPUT_REGULAR = fonts.input.regular;
export const INPUT_PLACEHOLDER = fonts.input.placeholder;

export const CODE_REGULAR = fonts.code.regular;
export const CODE_SMALL = fonts.code.small;

export const cssVariables = {
  // Font families
  '--font-family-primary': fonts.fontFamily.primary,
  '--font-family-secondary': fonts.fontFamily.secondary,
  '--font-family-mono': fonts.fontFamily.mono,

  // Font weights
  '--font-weight-light': fonts.fontWeight.light.toString(),
  '--font-weight-regular': fonts.fontWeight.regular.toString(),
  '--font-weight-medium': fonts.fontWeight.medium.toString(),
  '--font-weight-semibold': fonts.fontWeight.semibold.toString(),
  '--font-weight-bold': fonts.fontWeight.bold.toString(),

  // Heading sizes
  '--heading-xl-size': fonts.heading.xl.size,
  '--heading-xl-line-height': fonts.heading.xl.lineHeight,
  '--heading-xl-weight': fonts.heading.xl.weight.toString(),
  '--heading-xl-letter-spacing': fonts.heading.xl.letterSpacing,

  '--heading-lg-size': fonts.heading.lg.size,
  '--heading-lg-line-height': fonts.heading.lg.lineHeight,
  '--heading-lg-weight': fonts.heading.lg.weight.toString(),
  '--heading-lg-letter-spacing': fonts.heading.lg.letterSpacing,

  '--heading-md-size': fonts.heading.md.size,
  '--heading-md-line-height': fonts.heading.md.lineHeight,
  '--heading-md-weight': fonts.heading.md.weight.toString(),
  '--heading-md-letter-spacing': fonts.heading.md.letterSpacing,

  '--heading-sm-size': fonts.heading.sm.size,
  '--heading-sm-line-height': fonts.heading.sm.lineHeight,
  '--heading-sm-weight': fonts.heading.sm.weight.toString(),
  '--heading-sm-letter-spacing': fonts.heading.sm.letterSpacing,

  '--heading-xs-size': fonts.heading.xs.size,
  '--heading-xs-line-height': fonts.heading.xs.lineHeight,
  '--heading-xs-weight': fonts.heading.xs.weight.toString(),
  '--heading-xs-letter-spacing': fonts.heading.xs.letterSpacing,

  // Body text sizes
  '--body-xl-size': fonts.body.xl.size,
  '--body-xl-line-height': fonts.body.xl.lineHeight,
  '--body-xl-weight': fonts.body.xl.weight.toString(),
  '--body-xl-letter-spacing': fonts.body.xl.letterSpacing,

  '--body-lg-size': fonts.body.lg.size,
  '--body-lg-line-height': fonts.body.lg.lineHeight,
  '--body-lg-weight': fonts.body.lg.weight.toString(),
  '--body-lg-letter-spacing': fonts.body.lg.letterSpacing,

  '--body-regular-size': fonts.body.regular.size,
  '--body-regular-line-height': fonts.body.regular.lineHeight,
  '--body-regular-weight': fonts.body.regular.weight.toString(),
  '--body-regular-letter-spacing': fonts.body.regular.letterSpacing,

  '--body-sm-size': fonts.body.sm.size,
  '--body-sm-line-height': fonts.body.sm.lineHeight,
  '--body-sm-weight': fonts.body.sm.weight.toString(),
  '--body-sm-letter-spacing': fonts.body.sm.letterSpacing,

  '--body-xs-size': fonts.body.xs.size,
  '--body-xs-line-height': fonts.body.xs.lineHeight,
  '--body-xs-weight': fonts.body.xs.weight.toString(),
  '--body-xs-letter-spacing': fonts.body.xs.letterSpacing,

  // Caption sizes
  '--caption-regular-size': fonts.caption.regular.size,
  '--caption-regular-line-height': fonts.caption.regular.lineHeight,
  '--caption-regular-weight': fonts.caption.regular.weight.toString(),
  '--caption-regular-letter-spacing': fonts.caption.regular.letterSpacing,

  '--caption-small-size': fonts.caption.small.size,
  '--caption-small-line-height': fonts.caption.small.lineHeight,
  '--caption-small-weight': fonts.caption.small.weight.toString(),
  '--caption-small-letter-spacing': fonts.caption.small.letterSpacing,

  // Button text sizes
  '--button-lg-size': fonts.button.lg.size,
  '--button-lg-line-height': fonts.button.lg.lineHeight,
  '--button-lg-weight': fonts.button.lg.weight.toString(),
  '--button-lg-letter-spacing': fonts.button.lg.letterSpacing,

  '--button-regular-size': fonts.button.regular.size,
  '--button-regular-line-height': fonts.button.regular.lineHeight,
  '--button-regular-weight': fonts.button.regular.weight.toString(),
  '--button-regular-letter-spacing': fonts.button.regular.letterSpacing,

  '--button-sm-size': fonts.button.sm.size,
  '--button-sm-line-height': fonts.button.sm.lineHeight,
  '--button-sm-weight': fonts.button.sm.weight.toString(),
  '--button-sm-letter-spacing': fonts.button.sm.letterSpacing,

  // Input text sizes
  '--input-regular-size': fonts.input.regular.size,
  '--input-regular-line-height': fonts.input.regular.lineHeight,
  '--input-regular-weight': fonts.input.regular.weight.toString(),
  '--input-regular-letter-spacing': fonts.input.regular.letterSpacing,

  '--input-placeholder-size': fonts.input.placeholder.size,
  '--input-placeholder-line-height': fonts.input.placeholder.lineHeight,
  '--input-placeholder-weight': fonts.input.placeholder.weight.toString(),
  '--input-placeholder-letter-spacing': fonts.input.placeholder.letterSpacing,

  // Code text sizes
  '--code-regular-size': fonts.code.regular.size,
  '--code-regular-line-height': fonts.code.regular.lineHeight,
  '--code-regular-weight': fonts.code.regular.weight.toString(),
  '--code-regular-letter-spacing': fonts.code.regular.letterSpacing,

  '--code-small-size': fonts.code.small.size,
  '--code-small-line-height': fonts.code.small.lineHeight,
  '--code-small-weight': fonts.code.small.weight.toString(),
  '--code-small-letter-spacing': fonts.code.small.letterSpacing,
} as const;