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
  /* Surfaces — bright, airy (Muby App Final) */
  bgCanvas: '#FFF9F4',
  bgElevated: '#FFFFFF',
  bgSunken: '#F5F3F0',
  bgAccentSoft: '#FFEDE0',

  textPrimary: '#201A15',
  textSecondary: '#6E655C',
  textMuted: '#A89F96',
  textOnAccent: '#FFFFFF',

  /* Brand — vivid orange */
  accentPrimary: '#F96B26',
  accentHover: '#E4570F',
  accentSoftBg: '#FFD9C2',

  success: '#7A9A65',
  warning: '#D4A540',
  danger: '#B85450',
  successSoft: '#EDF5E7',
  warningSoft: '#FFF8E8',
  dangerSoft: '#FCEEEC',

  /* Gradient hero — vivid orange */
  gradientHero: ['#FF9051', '#F96B26'],
  textOnHero: '#FFFFFF',

  borderSubtle: '#F0EBE5',
  borderDefault: '#DED6CD',

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
  bgCanvas: '#17120E',
  bgElevated: '#221C16',
  bgSunken: '#120E0A',
  bgAccentSoft: '#47250F',

  textPrimary: '#F7F1EA',
  textSecondary: '#B5ABA0',
  textMuted: '#786E64',
  textOnAccent: '#FFFFFF',

  accentPrimary: '#FF8A50',
  accentHover: '#FFA070',
  accentSoftBg: '#3D2E22',

  success: '#8FB07A',
  warning: '#D4A540',
  danger: '#C26864',
  successSoft: '#2C3924',
  warningSoft: '#4E370F',
  dangerSoft: '#481A19',

  gradientHero: ['#C24E12', '#8C3407'],
  textOnHero: '#FFF3EA',

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

/* Radii — extra rounded (Muby App Final) */
export const radii = { sm: 10, md: 16, lg: 24, xl: 32, full: 999 } as const;

/* Spacing scale (8pt base) */
export const spacing = {
  s1: 4, s2: 8, s3: 12, s4: 16, s5: 20,
  s6: 24, s8: 32, s10: 40, s14: 56, s20: 80,
} as const;

/* Shadow style objects (iOS shadow* props + Android elevation), per mode */
export type ShadowLevels = { 1: ViewStyle; 2: ViewStyle; 3: ViewStyle; 4: ViewStyle };

function shadowsFor(mode: ThemeMode): ShadowLevels {
  const color = mode === 'dark' ? '#000000' : '#201A15';
  const o = (light: number, dark: number) => (mode === 'dark' ? dark : light);
  return {
    1: { shadowColor: color, shadowOffset: { width: 0, height: 1 }, shadowOpacity: o(0.05, 0.4), shadowRadius: 3, elevation: 1 },
    2: { shadowColor: color, shadowOffset: { width: 0, height: 6 }, shadowOpacity: o(0.06, 0.4), shadowRadius: 14, elevation: 3 },
    3: { shadowColor: color, shadowOffset: { width: 0, height: 14 }, shadowOpacity: o(0.08, 0.45), shadowRadius: 26, elevation: 8 },
    4: { shadowColor: color, shadowOffset: { width: 0, height: 24 }, shadowOpacity: o(0.13, 0.5), shadowRadius: 44, elevation: 16 },
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
