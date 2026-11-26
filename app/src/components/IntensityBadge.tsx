import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { INTENSITY_COPY } from '../data/sampleData';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

type Level = 1 | 2 | 3 | 4 | 5;
type Size = 'sm' | 'md' | 'lg';

export function IntensityBadge({ level = 2, size = 'md' }: { level?: number; size?: Size }) {
  const { colors } = useTheme();
  const lv = (Math.min(5, Math.max(1, level)) as Level);
  const C = INTENSITY_COPY[lv];
  const pad = { sm: { pv: 4, ph: 10 }, md: { pv: 5, ph: 12 }, lg: { pv: 8, ph: 16 } }[size];
  const fs = { sm: 12, md: 13, lg: 15 }[size];
  const dot = { sm: 7, md: 8, lg: 10 }[size];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: 4,
        paddingVertical: pad.pv,
        paddingHorizontal: pad.ph,
        borderRadius: 999,
        backgroundColor: colors.bgElevated,
        borderWidth: 1,
        borderColor: colors.borderDefault,
      }}
    >
      <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: colors.leap[lv] }} />
      <Txt style={{ fontSize: fs, fontWeight: '600', color: colors.textPrimary }}>{C.label}</Txt>
    </View>
  );
}

/** SVG 80×24 leap intensity spark line with a "you are here" dot. */
export function MiniIntensityCurve({
  data = [2, 3, 4, 4, 5, 4, 3],
  here = 4,
  w = 80,
  h = 24,
  showHere = true,
}: {
  data?: number[];
  here?: number;
  w?: number;
  h?: number;
  showHere?: boolean;
}) {
  const { colors } = useTheme();
  const max = 5, min = 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 6) + 3;
    const y = h - 3 - ((v - min) / (max - min)) * (h - 6);
    return [x, y] as const;
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const hp = pts[here];
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Path d={d} fill="none" stroke={colors.accentPrimary} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      {showHere && hp && (
        <Circle cx={hp[0]} cy={hp[1]} r={3.6} fill={colors.accentPrimary} stroke={colors.bgElevated} strokeWidth={2} />
      )}
    </Svg>
  );
}
