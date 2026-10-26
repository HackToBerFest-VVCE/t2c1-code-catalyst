/**
 * Touristमित्र Design System Tokens
 * Source of truth for brand colors, typography, sizing, radii, and spacing.
 */

export const tokens = {
  colors: {
    // Core brand & background tokens
    pageBackground: "#101010",
    cardBackground: "#202020",
    cardBackgroundHover: "#262626",
    inputBackground: "#292929",
    inputBackgroundFocus: "#2F2F2F",

    // Accent colors
    primaryGold: "#FFD451",
    primaryGoldHover: "#E6BC3D",
    primaryGoldActive: "#CC9E29",
    emeraldGreen: "#00D995",
    emeraldGreenHover: "#00B87E",

    // Typography
    textPrimary: "#F5F5F5",
    textSecondary: "#969696",
    textMuted: "#666666",
    textInverse: "#101010",

    // Borders
    border: "#333333",
    borderSubtle: "#2A2A2A",
    borderFocus: "#FFD451",

    // Semantics
    success: "#00D995",
    successBg: "rgba(0, 217, 149, 0.12)",
    successBorder: "rgba(0, 217, 149, 0.30)",

    warning: "#FFB020",
    warningBg: "rgba(255, 176, 32, 0.12)",
    warningBorder: "rgba(255, 176, 32, 0.30)",

    error: "#FF4D4D",
    errorBg: "rgba(255, 77, 77, 0.12)",
    errorBorder: "rgba(255, 77, 77, 0.30)",

    info: "#3B82F6",
    infoBg: "rgba(59, 130, 246, 0.12)",
    infoBorder: "rgba(59, 130, 246, 0.30)",

    // Gold tint
    goldBg: "rgba(255, 212, 81, 0.10)",
    goldBorder: "rgba(255, 212, 81, 0.28)",
  },

  radii: {
    xs: "4px",
    sm: "8px",
    button: "11px", // 10–12px rule
    card: "16px",   // 14–16px rule
    modal: "20px",
    pill: "9999px",
  },

  heights: {
    buttonSm: "36px",
    buttonMd: "44px",
    buttonLg: "48px",
    input: "48px",      // ~48px input height rule
    iconContainer: "42px", // 40–44px container rule
  },

  iconSizes: {
    sm: 16,
    ui: 18,   // 18–20px standard UI icon rule
    md: 20,
    lg: 24,
  },

  shadows: {
    card: "0 4px 20px rgba(0, 0, 0, 0.35)",
    cardElevated: "0 8px 30px rgba(0, 0, 0, 0.45)",
    buttonPrimary: "0 2px 10px rgba(255, 212, 81, 0.25)",
    dropdown: "0 10px 25px rgba(0, 0, 0, 0.60)",
  },

  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
  },

  typography: {
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: {
      xs: "11px",
      sm: "12.5px",
      base: "14px",
      md: "15px",
      lg: "18px",
      xl: "22px",
      "2xl": "28px",
      "3xl": "36px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 850,
      black: 900,
    },
  },
} as const;

export type DesignTokens = typeof tokens;
