/* ============================================================
   SCREEN 0 — Design System Foundation (Muby v1.0)
   Reference page: tokens, hue-shift intensity palette, all 11 Bống
   emotions, IntensityBadge states, components, flower motifs.
   ============================================================ */
import React from 'react';
import { ScrollView, View } from 'react-native';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  Card,
  Chip,
  Flower,
  Input,
  IntensityBadge,
  MiniIntensityCurve,
} from '../components';
import { Bong, BongIntensity, Emotion } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/tokens';
import { Txt } from '../theme/Txt';

const EMOTIONS: Emotion[] = [
  'happy', 'blissful', 'curious', 'excited', 'fussy', 'snug',
  'eating', 'surprise', 'uncertain', 'crying', 'sleeping',
];

function SectionTitle({ children }: { children: string }) {
  const { colors } = useTheme();
  return <Txt style={{ fontSize: 12.5, fontWeight: '700', letterSpacing: 1, color: colors.textMuted, marginBottom: 12 }}>{children}</Txt>;
}

function Swatch({ label, color, ink }: { label: string; color: string; ink?: string }) {
  const { colors, radii } = useTheme();
  return (
    <View style={{ width: 96 }}>
      <View style={{ height: 56, borderRadius: radii.md, backgroundColor: color, borderWidth: 1, borderColor: colors.borderSubtle, alignItems: 'center', justifyContent: 'center' }}>
        {ink ? <Txt style={{ color: ink, fontWeight: '700', fontSize: 13 }}>Aa</Txt> : null}
      </View>
      <Txt style={{ fontSize: 11, color: colors.textSecondary, marginTop: 5 }}>{label}</Txt>
    </View>
  );
}

export function DesignSystemScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const surfaces: [string, keyof ThemeColors][] = [
    ['canvas', 'bgCanvas'], ['elevated', 'bgElevated'], ['sunken', 'bgSunken'], ['accent soft', 'bgAccentSoft'],
    ['accent', 'accentPrimary'], ['success', 'success'], ['warning', 'warning'], ['danger', 'danger'],
  ];
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Design System" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 32 }}>
        <View>
          <Txt serif style={{ fontSize: 30, fontWeight: '600', color: colors.textPrimary }}>Muby Design System</Txt>
          <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>Baby Wonder Weeks v3 · light + dark</Txt>
        </View>

        {/* Surfaces & brand */}
        <View>
          <SectionTitle>SURFACES & BRAND</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {surfaces.map(([label, key]) => (
              <Swatch key={key} label={label} color={colors[key] as string} />
            ))}
          </View>
        </View>

        {/* Intensity palette */}
        <View>
          <SectionTitle>INTENSITY — HUE-SHIFT PALETTE</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <Swatch key={n} label={`intensity ${n}`} color={colors.intensity[n]} ink={colors.intensityInk[n]} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <IntensityBadge key={n} level={n} size="sm" />
            ))}
          </View>
        </View>

        {/* Bống emotions */}
        <View>
          <SectionTitle>BỐNG — 11 EMOTIONS</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {EMOTIONS.map((e) => (
              <View key={e} style={{ width: 78, alignItems: 'center' }}>
                <Bong emotion={e} onesie="orange" size={62} shadow={false} />
                <Txt style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{e}</Txt>
              </View>
            ))}
          </View>
        </View>

        {/* Intensity → Bống mapping */}
        <View>
          <SectionTitle>INTENSITY → BỐNG</SectionTitle>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <View key={n} style={{ alignItems: 'center' }}>
                <BongIntensity level={n} size={70} />
                <Txt style={{ fontSize: 11, color: colors.textSecondary }}>level {n}</Txt>
              </View>
            ))}
          </View>
        </View>

        {/* Components */}
        <View>
          <SectionTitle>COMPONENTS</SectionTitle>
          <View style={{ gap: 12 }}>
            <ButtonPrimary onPress={() => {}}>Button Primary</ButtonPrimary>
            <ButtonSecondary onPress={() => {}}>Button Secondary</ButtonSecondary>
            <ButtonText onPress={() => {}} style={{ alignSelf: 'flex-start' }}>Button Text →</ButtonText>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip active onPress={() => {}}>Active</Chip>
              <Chip onPress={() => {}}>Default</Chip>
            </View>
            <Input label="Input" value="" onChange={() => {}} placeholder="Placeholder" />
            <Card pad={16}>
              <Txt style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>Card</Txt>
              <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>radius-lg · shadow-2 · no border</Txt>
              <View style={{ marginTop: 12 }}><MiniIntensityCurve w={280} h={40} /></View>
            </Card>
            <Banner icon="💛" tone="soft">Banner — reassuring bestie voice, always warm.</Banner>
          </View>
        </View>

        {/* Flower motifs */}
        <View>
          <SectionTitle>FLOWER MOTIFS</SectionTitle>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Flower size={44} color={colors.warning} />
            <Flower size={38} color={colors.success} />
            <Flower size={50} color={colors.accentSoftBg} />
            <Flower size={32} color={colors.onesieLavender} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
