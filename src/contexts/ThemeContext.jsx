/**
 * Theme Context for The CRNA Club
 *
 * Provides theming capabilities across the app with support for:
 * - Page-specific color themes (focus ring colors, accent colors)
 * - Background gradients
 * - Consistent design tokens
 *
 * Usage:
 * 1. Wrap app with <ThemeProvider>
 * 2. Use useTheme() hook to access current theme
 * 3. Set page theme with <ThemeProvider theme="coral"> or setTheme('coral')
 */

import { createContext, useContext, useState, useMemo } from 'react';

// Theme color definitions
// Each theme defines colors for focus rings, accents, and related UI elements
export const themeColors = {
  // Warm themes
  coral: {
    name: 'Coral',
    focusRing: 'rgba(254, 144, 175, 0.15)',
    focusGlow: 'rgba(254, 144, 175, 0.1)',
    focusBorder: 'rgba(254, 144, 175, 0.4)',
    accent: '#FE90AF',
    accentLight: '#FFF0F3',
    accentDark: '#E8758D',
  },
  purple: {
    name: 'Purple',
    focusRing: 'rgba(168, 144, 254, 0.15)',
    focusGlow: 'rgba(168, 144, 254, 0.1)',
    focusBorder: 'rgba(168, 144, 254, 0.4)',
    accent: '#A890FE',
    accentLight: '#F5F0FF',
    accentDark: '#8B6FE8',
  },
  teal: {
    name: 'Teal',
    focusRing: 'rgba(94, 234, 212, 0.15)',
    focusGlow: 'rgba(94, 234, 212, 0.1)',
    focusBorder: 'rgba(94, 234, 212, 0.4)',
    accent: '#5EEAD4',
    accentLight: '#F0FDFA',
    accentDark: '#2DD4BF',
  },
  emerald: {
    name: 'Emerald',
    focusRing: 'rgba(16, 185, 129, 0.15)',
    focusGlow: 'rgba(16, 185, 129, 0.1)',
    focusBorder: 'rgba(16, 185, 129, 0.4)',
    accent: '#10B981',
    accentLight: '#ECFDF5',
    accentDark: '#059669',
  },
  amber: {
    name: 'Amber',
    focusRing: 'rgba(245, 158, 11, 0.15)',
    focusGlow: 'rgba(245, 158, 11, 0.1)',
    focusBorder: 'rgba(245, 158, 11, 0.4)',
    accent: '#F59E0B',
    accentLight: '#FFFBEB',
    accentDark: '#D97706',
  },
  blue: {
    name: 'Blue',
    focusRing: 'rgba(59, 130, 246, 0.15)',
    focusGlow: 'rgba(59, 130, 246, 0.1)',
    focusBorder: 'rgba(59, 130, 246, 0.4)',
    accent: '#3B82F6',
    accentLight: '#EFF6FF',
    accentDark: '#2563EB',
  },
  rose: {
    name: 'Rose',
    focusRing: 'rgba(244, 63, 94, 0.15)',
    focusGlow: 'rgba(244, 63, 94, 0.1)',
    focusBorder: 'rgba(244, 63, 94, 0.4)',
    accent: '#F43F5E',
    accentLight: '#FFF1F2',
    accentDark: '#E11D48',
  },
};

// Background gradient definitions
export const backgroundGradients = {
  // Default - Dusk (amber → slate → purple)
  dusk: 'from-amber-50/40 via-slate-100 to-purple-50/40',

  // Alternatives
  'sage-cream': 'from-[#f7f2e4]/50 via-green-50/30 to-slate-100',
  'soft-purple': 'from-purple-50/50 via-indigo-50/40 to-slate-100',
  'lavender-mist': 'from-indigo-50/50 via-purple-50/40 to-slate-100',
  'cream-slate': 'from-[#f7f2e4]/60 via-amber-50/40 to-slate-100',
  'neutral-warm': 'from-amber-50/80 via-orange-50/60 to-slate-100',
  'neutral-cool': 'from-slate-50 via-gray-50 to-zinc-100',
  'ocean-mist': 'from-slate-50 via-blue-50/40 to-teal-50/30',
  'purple-slate': 'from-slate-50 via-purple-50/60 to-indigo-50/40',
  'warm-neutral': 'from-orange-50/50 via-amber-50/30 to-gray-100',
};

// Default theme
const DEFAULT_THEME = 'coral';
const DEFAULT_BACKGROUND = 'dusk';

const ThemeContext = createContext(null);

export function ThemeProvider({
  children,
  theme: initialTheme = DEFAULT_THEME,
  background: initialBackground = DEFAULT_BACKGROUND
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [background, setBackground] = useState(initialBackground);

  const value = useMemo(() => ({
    // Current theme name
    theme,
    setTheme,

    // Current theme colors
    colors: themeColors[theme] || themeColors[DEFAULT_THEME],

    // All available themes
    availableThemes: Object.keys(themeColors),

    // Background
    background,
    setBackground,
    backgroundGradient: backgroundGradients[background] || backgroundGradients[DEFAULT_BACKGROUND],
    availableBackgrounds: Object.keys(backgroundGradients),

    // Helper to get CSS custom properties for current theme
    getCssVars: () => {
      const colors = themeColors[theme] || themeColors[DEFAULT_THEME];
      return {
        '--theme-focus-ring': colors.focusRing,
        '--theme-focus-glow': colors.focusGlow,
        '--theme-focus-border': colors.focusBorder,
        '--theme-accent': colors.accent,
        '--theme-accent-light': colors.accentLight,
        '--theme-accent-dark': colors.accentDark,
      };
    },

    // Helper to get focus ring shadow style
    getFocusRingStyle: () => {
      const colors = themeColors[theme] || themeColors[DEFAULT_THEME];
      return `0 0 0 3px ${colors.focusRing}, 0 0 12px ${colors.focusGlow}`;
    },
  }), [theme, background]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export for components that need direct access without hook
export { ThemeContext };
