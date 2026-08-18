/*
IMPORT EXAMPLES:

// Import individual color constants
import { TEAL_PRIMARY, PAGE_BACKGROUND, BUTTONS } from '@/lib/colors';

// Import the entire colors object
import { colors } from '@/lib/colors';

// Import CSS variables for use in stylesheets
import { cssVariables } from '@/lib/colors';

USAGE EXAMPLES:

// Using individual constants
const buttonColor = TEAL_PRIMARY;
const bgColor = PAGE_BACKGROUND;

// Using the colors object
const primaryButton = colors.buttons.primary;
const heroStart = colors.heroGradient.start;

// Using in React components
<button style={{ backgroundColor: BUTTONS.primary, color: BUTTONS.primaryText }}>
  Click me
</button>

// Using in CSS/Tailwind
<div style={{ background: `linear-gradient(${HERO_GRADIENT.direction}, ${HERO_GRADIENT.start}, ${HERO_GRADIENT.middle}, ${HERO_GRADIENT.end})` }}>
  Hero Section
</div>
*/

export const colors = {
  // HERO GRADIENT
  heroGradient: {
    start: '#16332B',
    middle: '#1F483D',
    end: '#16332B',
    direction: '135deg',
  },

  // BUTTONS
  buttons: {
    primary: '#2FD9C4',
    primaryText: '#16332B',
    hover: '#24C3B0',
    hoverText: '#16332B',
    disabled: '#AEECE4',
    disabledText: '#4D5F5A',
  },

  // ERROR COLORS
  error: {
    text: '#9F3D37',
    background: '#FFF5F3',
    border: '#F1B8B4',
  },

  // STATUS BADGE COLORS
  status: {
    open: {
      text: '#16332B',
      background: '#E5F9F6',
      border: '#8EF1E0',
    },
    inProgress: {
      text: '#1A365D',
      background: '#E3F2FD',
      border: '#90CAF9',
    },
    resolved: {
      text: '#166534',
      background: '#DCFCE7',
      border: '#86EFAC',
    },
    closed: {
      text: '#6B7280',
      background: '#F3F4F6',
      border: '#D1D5DB',
    },
  },

  // PRIORITY BADGE COLORS
  priority: {
    low: {
      text: '#166534',
      background: '#DCFCE7',
      border: '#86EFAC',
    },
    medium: {
      text: '#92400E',
      background: '#FEF3C7',
      border: '#FCD34D',
    },
    high: {
      text: '#9F3D37',
      background: '#FFF5F3',
      border: '#F1B8B4',
    },
  },

  // CORE COLORS
  darkGreen: '#16332B',
  tealPrimary: '#2FD9C4',
  tealHover: '#24C3B0',
  lightTealBg: '#E5F9F6',
  lightTealBgAlt: '#E6F8F5',
  lightTealBadge: '#8EF1E0',
  mutedGreyGreen: '#9BB0AB',
  bodyTextGrey: '#6B6E6C',
  placeholderText: '#4B5563',
  pageBackground: '#F7F9F8',
  secondaryBackground: '#F2F5F4',
  borderGrey: '#E3ECE8',
  lightBorder: '#DDE5E1',
  inputBorder: '#D9E4DE',
  cardBackground: '#FBFDFC',
  statsGrey: '#6B8079',
  mutedGreyGreen: '#9BB0AB',
  bodyTextGrey: '#6B6E6C',
  pageBackground: '#F7F9F8',
  secondaryBackground: '#F2F5F4',
  borderGrey: '#E3ECE8',
  lightBorder: '#DDE5E1',
  inputBorder: '#D9E4DE',
  cardBackground: '#FBFDFC',
  statsGrey: '#6B8079',
  primaryText: '#1A1D1C',
} as const;

export const HERO_GRADIENT = colors.heroGradient;
export const BUTTONS = colors.buttons;
export const ERROR = colors.error;
export const STATUS = colors.status;
export const PRIORITY = colors.priority;
export const DARK_GREEN = colors.darkGreen;
export const TEAL_PRIMARY = colors.tealPrimary;
export const TEAL_HOVER = colors.tealHover;
export const LIGHT_TEAL_BG = colors.lightTealBg;
export const LIGHT_TEAL_BG_ALT = colors.lightTealBgAlt;
export const LIGHT_TEAL_BADGE = colors.lightTealBadge;
export const MUTED_GREY_GREEN = colors.mutedGreyGreen;
export const BODY_TEXT_GREY = colors.bodyTextGrey;
export const PLACEHOLDER_TEXT = colors.placeholderText;
export const PAGE_BACKGROUND = colors.pageBackground;
export const SECONDARY_BACKGROUND = colors.secondaryBackground;
export const BORDER_GREY = colors.borderGrey;
export const LIGHT_BORDER = colors.lightBorder;
export const INPUT_BORDER = colors.inputBorder;
export const CARD_BACKGROUND = colors.cardBackground;
export const STATS_GREY = colors.statsGrey;
export const MUTED_GREY_GREEN = colors.mutedGreyGreen;
export const BODY_TEXT_GREY = colors.bodyTextGrey;
export const PAGE_BACKGROUND = colors.pageBackground;
export const SECONDARY_BACKGROUND = colors.secondaryBackground;
export const BORDER_GREY = colors.borderGrey;
export const LIGHT_BORDER = colors.lightBorder;
export const INPUT_BORDER = colors.inputBorder;
export const CARD_BACKGROUND = colors.cardBackground;
export const STATS_GREY = colors.statsGrey;
export const PRIMARY_TEXT = colors.primaryText;

export const cssVariables = {
  // Hero gradient
  '--hero-gradient-start': colors.heroGradient.start,
  '--hero-gradient-middle': colors.heroGradient.middle,
  '--hero-gradient-end': colors.heroGradient.end,
  '--hero-gradient-direction': colors.heroGradient.direction,

  // Buttons
  '--button-primary': colors.buttons.primary,
  '--button-primary-text': colors.buttons.primaryText,
  '--button-hover': colors.buttons.hover,
  '--button-hover-text': colors.buttons.hoverText,
  '--button-disabled': colors.buttons.disabled,
  '--button-disabled-text': colors.buttons.disabledText,

  // Error colors
  '--error-text': colors.error.text,
  '--error-background': colors.error.background,
  '--error-border': colors.error.border,

  // Core colors
  '--color-dark-green': colors.darkGreen,
  '--color-teal-primary': colors.tealPrimary,
  '--color-teal-hover': colors.tealHover,
  '--color-light-teal-bg': colors.lightTealBg,
  '--color-light-teal-bg-alt': colors.lightTealBgAlt,
  '--color-light-teal-badge': colors.lightTealBadge,
  '--color-muted-grey-green': colors.mutedGreyGreen,
  '--color-body-text-grey': colors.bodyTextGrey,
  '--color-page-background': colors.pageBackground,
  '--color-secondary-background': colors.secondaryBackground,
  '--color-border-grey': colors.borderGrey,
  '--color-light-border': colors.lightBorder,
  '--color-input-border': colors.inputBorder,
  '--color-card-background': colors.cardBackground,
  '--color-stats-grey': colors.statsGrey,
  '--color-muted-grey-green': colors.mutedGreyGreen,
  '--color-body-text-grey': colors.bodyTextGrey,
  '--color-page-background': colors.pageBackground,
  '--color-secondary-background': colors.secondaryBackground,
  '--color-border-grey': colors.borderGrey,
  '--color-light-border': colors.lightBorder,
  '--color-input-border': colors.inputBorder,
  '--color-card-background': colors.cardBackground,
  '--color-stats-grey': colors.statsGrey,
  '--color-primary-text': colors.primaryText,
} as const;