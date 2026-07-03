/* ============================================================
   MUBY DESIGN SYSTEM v1.0 — TOKENS (React Native port)
   Ported from project/styles/tokens.css.
   CSS custom properties become a typed JS theme object because
   React Native has no CSS variables. light = default, dark = override.
   ============================================================ */
import { TextStyle, ViewStyle } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  /* Surfaces */
  bgCanvas: string;
  bgElevated: string;
  bgSunken: string;
  bgAccentSoft: string;

  /* Text */
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnAccent: string;

  /* Brand */
  accentPrimary: string;
  accentHover: string;
  accentSoftBg: string;

  /* Semantic status + soft backgrounds */
  success: string;
  warning: string;
  danger: string;
  successSoft: string;
  warningSoft: string;
  dangerSoft: string;

  /* Gradient hero (two stops) + text on hero */
  gradientHero: [string, string];
  textOnHero: string;

  /* Borders */
  borderSubtle: string;
  borderDefault: string;

  /* Intensity — hue-shift palette (1..5) + ink colors */
  intensity: Record<1 | 2 | 3 | 4 | 5, string>;
  intensityInk: Record<1 | 2 | 3 | 4 | 5, string>;

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

const lightColors: ThemeColors = {
  bgCanvas: '#FAF6EE',
  bgElevated: '#FFFFFF',
  bgSunken: '#F2EBDD',
  bgAccentSoft: '#FBE7D5',

  textPrimary: '#2A1A14',
  textSecondary: '#6B5B52',
  textMuted: '#A39989',
  textOnAccent: '#FFFFFF',

  accentPrimary: '#D87242',
  accentHover: '#C25E2F',
  accentSoftBg: '#F4D5BD',

  success: '#7A9A65',
  warning: '#D4A540',
  danger: '#B85450',
  successSoft: '#EDF5E7',
  warningSoft: '#FFF8E8',
  dangerSoft: '#FCEEEC',

  gradientHero: ['#3D2A1F', '#5C3D2A'],
  textOnHero: '#FAF6EE',

  borderSubtle: '#E8DECF',
  borderDefault: '#D4C7B5',

  intensity: { 1: '#C8DFBC', 2: '#F0E6C8', 3: '#F5C842', 4: '#E07C3A', 5: '#C24A2A' },
  intensityInk: { 1: '#3E5530', 2: '#6B5A2E', 3: '#6B5410', 4: '#FAF6EE', 5: '#FAF6EE' },

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

const darkColors: ThemeColors = {
  bgCanvas: '#1A1410',
  bgElevated: '#241D17',
  bgSunken: '#15100C',
  bgAccentSoft: '#4A2414',

  textPrimary: '#F5EFE2',
  textSecondary: '#B8AC9B',
  textMuted: '#7A6F62',
  textOnAccent: '#1A1410',

  accentPrimary: '#E8895E',
  accentHover: '#F0A07D',
  accentSoftBg: '#3D2E22',

  success: '#8FB07A',
  warning: '#D4A540',
  danger: '#C26864',
  successSoft: '#2C3924',
  warningSoft: '#4E370F',
  dangerSoft: '#481A19',

  gradientHero: ['#0F0C09', '#2A1D14'],
  textOnHero: '#F5EFE2',

  borderSubtle: '#2E251E',
  borderDefault: '#3A2F26',

  intensity: { 1: '#4A6B3C', 2: '#5C4E22', 3: '#7A6010', 4: '#8C4018', 5: '#7A2810' },
  intensityInk: { 1: '#D6E8CC', 2: '#E8DCB8', 3: '#F2E2A8', 4: '#F5EFE2', 5: '#F5EFE2' },

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

/* Radii */
export const radii = { sm: 8, md: 12, lg: 20, xl: 28, full: 999 } as const;

/* Spacing scale (8pt base) */
export const spacing = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 20,
  s6: 24, s8: 32, s10: 40, s14: 56, s20: 80,
} as const;

/* Shadow style objects (iOS shadow* props + Android elevation), per mode */
export type ShadowLevels = { 1: ViewStyle; 2: ViewStyle; 3: ViewStyle; 4: ViewStyle };

function shadowsFor(mode: ThemeMode): ShadowLevels {
  const color = mode === 'dark' ? '#000000' : '#2A1A14';
  const o = (light: number, dark: number) => (mode === 'dark' ? dark : light);
  return {
    1: { shadowColor: color, shadowOffset: { width: 0, height: 1 }, shadowOpacity: o(0.04, 0.4), shadowRadius: 2, elevation: 1 },
    2: { shadowColor: color, shadowOffset: { width: 0, height: 4 }, shadowOpacity: o(0.06, 0.4), shadowRadius: 12, elevation: 3 },
    3: { shadowColor: color, shadowOffset: { width: 0, height: 12 }, shadowOpacity: o(0.08, 0.45), shadowRadius: 24, elevation: 8 },
    4: { shadowColor: color, shadowOffset: { width: 0, height: 20 }, shadowOpacity: o(0.12, 0.5), shadowRadius: 40, elevation: 16 },
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
   @expo-google-fonts exposes one family name per weight. Map a numeric/string
   fontWeight (+ serif flag) to the correct loaded family. Mirrors the CSS where
   `.serif` = Fraunces and everything else = Inter. */
export function fontFamily(weight?: TextStyle['fontWeight'], serif?: boolean): string {
  const n = typeof weight === 'number' ? weight : parseInt((weight as string) || '400', 10) || 400;
  const fam = serif ? 'Fraunces' : 'Inter';
  const suffix = n >= 700 ? '700Bold' : n >= 600 ? '600SemiBold' : n >= 500 ? '500Medium' : '400Regular';
  return `${fam}_${suffix}`;
}
