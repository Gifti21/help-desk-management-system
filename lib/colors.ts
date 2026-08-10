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

  // CORE COLORS
  darkGreen: '#16332B',
  tealPrimary: '#2FD9C4',
  tealHover: '#24C3B0',
  lightTealBg: '#E5F9F6',
  lightTealBgAlt: '#E6F8F5',
  mutedGreyGreen: '#9BB0AB',
  bodyTextGrey: '#6B6E6C',
  pageBackground: '#F7F9F8',
  borderGrey: '#E3ECE8',
  primaryText: '#1A1D1C',

  // CHART COLORS
  charts: {
    indigo: '#6366F1',
    blue: '#3B82F6',
    green: '#10B981',
    emerald: '#10B981',
    amber: '#F59E0B',
    orange: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    pink: '#EC4899',
    grey: '#6B7280',
    yellow: '#F59E0B',
  },

  // STATUS COLORS
  status: {
    success: '#10B981',
    successBg: '#dcfce7',
    successText: '#15803d',
    warning: '#F59E0B',
    warningBg: '#fef3c7',
    warningText: '#92400e',
    error: '#EF4444',
    errorBg: '#fee2e2',
    errorText: '#dc2626',
    info: '#3B82F6',
    infoBg: '#dbeafe',
    infoText: '#1e40af',
    inactive: '#6B7280',
    inactiveBg: '#f3f4f6',
    inactiveText: '#6b7280',
  },

  // PRIORITY COLORS
  priority: {
    critical: '#EF4444',
    criticalBg: '#fee2e2',
    criticalText: '#dc2626',
    high: '#F59E0B',
    highBg: '#fed7aa',
    highText: '#c2410c',
    medium: '#3B82F6',
    mediumBg: '#dbeafe',
    mediumText: '#1e40af',
    low: '#6B7280',
    lowBg: '#f3f4f6',
    lowText: '#6b7280',
  },
} as const;

export const HERO_GRADIENT = colors.heroGradient;
export const BUTTONS = colors.buttons;
export const DARK_GREEN = colors.darkGreen;
export const TEAL_PRIMARY = colors.tealPrimary;
export const TEAL_HOVER = colors.tealHover;
export const LIGHT_TEAL_BG = colors.lightTealBg;
export const LIGHT_TEAL_BG_ALT = colors.lightTealBgAlt;
export const MUTED_GREY_GREEN = colors.mutedGreyGreen;
export const BODY_TEXT_GREY = colors.bodyTextGrey;
export const PAGE_BACKGROUND = colors.pageBackground;
export const BORDER_GREY = colors.borderGrey;
export const PRIMARY_TEXT = colors.primaryText;
export const CHARTS = colors.charts;
export const STATUS = colors.status;
export const PRIORITY = colors.priority;

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

  // Core colors
  '--color-dark-green': colors.darkGreen,
  '--color-teal-primary': colors.tealPrimary,
  '--color-teal-hover': colors.tealHover,
  '--color-light-teal-bg': colors.lightTealBg,
  '--color-light-teal-bg-alt': colors.lightTealBgAlt,
  '--color-muted-grey-green': colors.mutedGreyGreen,
  '--color-body-text-grey': colors.bodyTextGrey,
  '--color-page-background': colors.pageBackground,
  '--color-border-grey': colors.borderGrey,
  '--color-primary-text': colors.primaryText,
} as const;
