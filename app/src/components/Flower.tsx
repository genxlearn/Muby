import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

/** TinyNest-DNA flower motif. */
export function Flower({
  size = 40,
  color,
  center,
  style,
}: {
  size?: number;
  color?: string;
  center?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  const petal = color || colors.warning;
  const mid = center || colors.bgCanvas;
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 40 40">
        {[0, 72, 144, 216, 288].map((a) => (
          <Ellipse key={a} cx={20} cy={9} rx={6.4} ry={8.4} fill={petal} transform={`rotate(${a} 20 20)`} />
        ))}
        <Circle cx={20} cy={20} r={4.6} fill={mid} />
      </Svg>
    </View>
  );
}

export interface FlowerItem { x: number; y: number; s: number; c: string; o?: number; r?: number }

/** Scattered decoration layer (absolute-positioned flowers). */
export function FlowerField({ items }: { items: FlowerItem[] }) {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
      {items.map((f, i) => (
        <Flower
          key={i}
          size={f.s}
          color={f.c}
          style={{ position: 'absolute', left: f.x, top: f.y, opacity: f.o ?? 0.9, transform: [{ rotate: `${f.r || 0}deg` }] }}
        />
      ))}
    </View>
  );
}
