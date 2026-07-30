export const FONT_FAMILY = '"Inter", sans-serif';

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
