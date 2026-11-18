/* ============================================================
   MUBY DESIGN SYSTEM v2.0 — TOKENS (React Native)
   Peachy iOS UI Kit foundations · Figma: Muby — UI v2.0 (MJWQvXPYVgGdwpZ2KlzuHw).
   CSS custom properties become a typed JS theme object because
   React Native has no CSS variables. light = default, dark = override.
   ============================================================ */
import { TextStyle, ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  /* Surfaces (Peachy: bg/canvas · bg/elevated · bg/surface · bg/brand-subtle) */
  bgCanvas: string;
  bgElevated: string;
  bgSunken: string;
  bgAccentSoft: string;
  bgInverse: string;

  /* Text */
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;
  textBrand: string;
  textInverse: string;

  /* Brand (coral) */
  accentPrimary: string;
  accentHover: string;
  accentSoftBg: string; // bg/brand-tonal

  /* "Bống nhận thấy" — AI lavender */
  aiPrimary: string;
  aiSubtle: string;
  aiTonal: string;
  aiText: string;

  /* Activity colors — Ăn · Ngủ · Tã · Lớn */
  activity: Record<'feed' | 'sleep' | 'diaper' | 'growth', { bg: string; fg: string }>;

  /* Semantic status + soft backgrounds */
  success: string;
  warning: string;
  danger: string;
  successSoft: string;
  warningSoft: string;
  dangerSoft: string;

  /* Top-of-screen glow (peach → pink → transparent) */
  glow: [string, string, string];

  /* Legacy hero fields — v2 heroes are white cards, so these resolve to card colors */
  gradientHero: [string, string];
  textOnHero: string;

  /* Borders */
  borderSubtle: string;
  borderDefault: string;

  /* Leap intensity: subtle→strong backgrounds (1..5) + ink, and solid dot colors */
  intensity: Record<1 | 2 | 3 | 4 | 5, string>;
  intensityInk: Record<1 | 2 | 3 | 4 | 5, string>;
  leap: Record<1 | 2 | 3 | 4 | 5, string>;

  /* Character Bống */
  charSkin: string;
  charSkinShade: string;
  charSkinHi: string;
  charMouth: string;
  charBlush: string;
  charHair: string;
  charEyes: string;
  tear: string;

  /* Onesie palette (token layer) */
  onesieOrange: string;
  onesieSage: string;
  onesieCream: string;
  onesieLavender: string;
}

/* Muby UI v2.0 — Peachy iOS UI Kit palette (light) */
const lightColors: ThemeColors = {
  bgCanvas: '#FAFAFA',
  bgElevated: '#FFFFFF',
  bgSunken: '#F5F5F5',
  bgAccentSoft: '#FFF0F0',
  bgInverse: '#222222',

  textPrimary: '#222222',
  textSecondary: '#6B6B6B',
  textMuted: '#A3A3A3',
  textOnAccent: '#FFFFFF',
  textBrand: '#E5565D',
  textInverse: '#FFFFFF',

  accentPrimary: '#F2646C',
  accentHover: '#E5565D',
  accentSoftBg: '#FFE4E5',

  aiPrimary: '#9B82F0',
  aiSubtle: '#F6F4FF',
  aiTonal: '#E3DEFF',
  aiText: '#7259CF',

  activity: {
    feed: { bg: '#FEF4EB', fg: '#EF8C0F' },
    sleep: { bg: '#F0F7FE', fg: '#2288E8' },
    diaper: { bg: '#E3FDF2', fg: '#099D78' },
    growth: { bg: '#FEF5E0', fg: '#CFA101' },
  },

  success: '#099D78',
  warning: '#CFA101',
  danger: '#B42318',
  successSoft: '#E3FDF2',
  warningSoft: '#FEF5E0',
  dangerSoft: '#FFF1F0',

  glow: ['rgba(255,214,194,0.75)', 'rgba(255,189,190,0.22)', 'rgba(250,250,250,0)'],

  gradientHero: ['#FFFFFF', '#FFFFFF'],
  textOnHero: '#222222',

  borderSubtle: '#EFEFEF',
  borderDefault: '#E7E7E7',

  intensity: { 1: '#E3FDF2', 2: '#FEF5E0', 3: '#F2BE3A', 4: '#EF8C0F', 5: '#F2646C' },
  intensityInk: { 1: '#099D78', 2: '#9A7700', 3: '#222222', 4: '#FFFFFF', 5: '#FFFFFF' },
  leap: { 1: '#07C496', 2: '#7CE2BD', 3: '#F2BE3A', 4: '#EF8C0F', 5: '#F2646C' },

  charSkin: '#FBE0CB',
  charSkinShade: '#F2C9A7',
  charSkinHi: '#FFF0E2',
  charMouth: '#B85450',
  charBlush: '#F19F8B',
  charHair: '#2A1A14',
  charEyes: '#2A1A14',
  tear: '#A8C8D8',

  onesieOrange: '#D87242',
  onesieSage: '#9CB888',
  onesieCream: '#E8D4B5',
  onesieLavender: '#B5A8C4',
};

/* Peachy dark mode */
const darkColors: ThemeColors = {
  bgCanvas: '#141414',
  bgElevated: '#222222',
  bgSunken: '#333333',
  bgAccentSoft: '#2E2223',
  bgInverse: '#F5F5F5',

  textPrimary: '#F5F5F5',
  textSecondary: '#A3A3A3',
  textMuted: '#6B6B6B',
  textOnAccent: '#FFFFFF',
  textBrand: '#FF7376',
  textInverse: '#222222',

  accentPrimary: '#F2646C',
  accentHover: '#E5565D',
  accentSoftBg: '#2E2223',

  aiPrimary: '#9B82F0',
  aiSubtle: '#242134',
  aiTonal: '#493D74',
  aiText: '#CBC1FF',

  activity: {
    feed: { bg: '#302012', fg: '#EF8C0F' },
    sleep: { bg: '#172535', fg: '#5FACFE' },
    diaper: { bg: '#112921', fg: '#07C496' },
    growth: { bg: '#28230F', fg: '#CFA101' },
  },

  success: '#07C496',
  warning: '#CFA101',
  danger: '#F97066',
  successSoft: '#112921',
  warningSoft: '#28230F',
  dangerSoft: '#3A2220',

  glow: ['rgba(44,34,24,0.9)', 'rgba(46,34,35,0.35)', 'rgba(20,20,20,0)'],

  gradientHero: ['#222222', '#222222'],
  textOnHero: '#F5F5F5',

  borderSubtle: '#2A2A2A',
  borderDefault: '#3B3B3B',

  intensity: { 1: '#112921', 2: '#28230F', 3: '#7A6010', 4: '#8C4F0A', 5: '#8C3438' },
  intensityInk: { 1: '#07C496', 2: '#CFA101', 3: '#F5F5F5', 4: '#F5F5F5', 5: '#F5F5F5' },
  leap: { 1: '#07C496', 2: '#7CE2BD', 3: '#F2BE3A', 4: '#EF8C0F', 5: '#F2646C' },

  charSkin: '#E5BFA0',
  charSkinShade: '#C99977',
  charSkinHi: '#F5D8BC',
  charMouth: '#D88278',
  charBlush: '#C97A6A',
  charHair: '#2A1A14',
  charEyes: '#2A1A14',
  tear: '#92B2C5',

  onesieOrange: '#D87242',
  onesieSage: '#9CB888',
  onesieCream: '#C9B187',
  onesieLavender: '#9C8FB0',
};

/* Radii — Peachy: chip 8 · tile 12 · card/input 16 · hero 24 · sheet 32 */
export const radii = { sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, full: 999 } as const;

/* Spacing scale (Peachy: screen margin 20 · card padding 20 · card gap 16) */
export const spacing = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 20,
  s6: 24, s8: 32, s10: 40, s14: 56, s20: 80,
} as const;

/* Shadow style objects (iOS shadow* props + Android elevation), per mode */
export type ShadowLevels = { 1: ViewStyle; 2: ViewStyle; 3: ViewStyle; 4: ViewStyle; fab: ViewStyle };

/* Peachy effect styles: card (y8 b32 4%) · float (y8 b28 8%) · sheet (y-4 b24 12%) · fab (coral y8 b20 35%) */
function shadowsFor(mode: ThemeMode): ShadowLevels {
  const color = mode === 'dark' ? '#000000' : '#232323';
  const o = (light: number, dark: number) => (mode === 'dark' ? dark : light);
  return {
    1: { shadowColor: color, shadowOffset: { width: 0, height: 2 }, shadowOpacity: o(0.04, 0.35), shadowRadius: 6, elevation: 1 },
    2: { shadowColor: color, shadowOffset: { width: 0, height: 8 }, shadowOpacity: o(0.05, 0.4), shadowRadius: 16, elevation: 2 },
    3: { shadowColor: color, shadowOffset: { width: 0, height: 8 }, shadowOpacity: o(0.08, 0.45), shadowRadius: 14, elevation: 6 },
    4: { shadowColor: '#000000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: o(0.12, 0.5), shadowRadius: 12, elevation: 16 },
    fab: { shadowColor: '#F2646C', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 8 },
  };
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  radii: typeof radii;
  spacing: typeof spacing;
  shadows: ShadowLevels;
}

export function makeTheme(mode: ThemeMode): Theme {
  return {
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    radii,
    spacing,
    shadows: shadowsFor(mode),
  };
}

/* ---------- Fonts ----------
   @expo-google-fonts exposes one family name per weight. Inter follows the
   numeric fontWeight; Fraunces (titles + Bống's voice) is always Regular in the
   Peachy type ramp, optionally italic. */
export function fontFamily(weight?: TextStyle['fontWeight'], serif?: boolean, italic?: boolean): string {
  if (serif) return italic ? 'Fraunces_400Regular_Italic' : 'Fraunces_400Regular';
  const n = typeof weight === 'number' ? weight : parseInt((weight as string) || '400', 10) || 400;
  const suffix = n >= 700 ? '700Bold' : n >= 600 ? '600SemiBold' : n >= 500 ? '500Medium' : '400Regular';
  return `Inter_${suffix}`;
}
