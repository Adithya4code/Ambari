// src/theme.ts
// Centralized design tokens so components can share colors/spacing/typography.
// This keeps visual consistency and makes future theme changes easy.
export const Colors = {
  terracotta: '#C65D3B',   // primary CTA
  royalBlue: '#2E4F9A',    // secondary / accent
  gold: '#D4AF37',         // highlights/badges
  warmWhite: '#FFF8F3',    // app background
  heritageBrown: '#8B4513',// headings
  mutedText: '#616161',    // body copy
  cardBg: '#FFFFFF',
  overlayDark: 'rgba(0,0,0,0.45)',
};

export const Spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Typography = {
  fontFamily: 'Poppins_400Regular', // base font family loaded in App.tsx
  fontFamilySemi: 'Poppins_600SemiBold',
  fontFamilyBold: 'Poppins_700Bold',
};
