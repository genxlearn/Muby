/* ============================================================
   Icon3D — semi-3D gradient badge that replaces emojis.
   Web prototype uses Phosphor fill icons; RN uses the equivalent
   MaterialCommunityIcons glyph on the same gradient chip.
   ============================================================ */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type Glyph = keyof typeof MaterialCommunityIcons.glyphMap;

/* emoji → [glyph, gradient-light, gradient-dark] (mirrors EMOJI3D in the prototype) */
const EMOJI3D: Record<string, [Glyph, string, string]> = {
  '🍼': ['baby-bottle-outline', '#FFB877', '#E0692A'],
  '🤱': ['baby-face-outline', '#F8A3B8', '#D95C7E'],
  '🌙': ['weather-night', '#A9A3E8', '#6C63C8'],
  '😴': ['bed', '#A9A3E8', '#6C63C8'],
  '🛏️': ['bed', '#A9A3E8', '#6C63C8'],
  '💧': ['water', '#8FCBEF', '#3E8FC9'],
  '💛': ['heart', '#FFD97A', '#E8A81E'],
  '🎵': ['music', '#F8A3B8', '#D95C7E'],
  '🌼': ['flower', '#B5D99A', '#6E9A4E'],
  '✨': ['star-four-points', '#FFD97A', '#E8A81E'],
  '☕': ['coffee', '#D9B48F', '#9C6B3F'],
  '👀': ['eye', '#8FCBEF', '#3E8FC9'],
  '😢': ['emoticon-sad', '#8FCBEF', '#3E8FC9'],
  '😰': ['emoticon-sad', '#A9A3E8', '#6C63C8'],
  '😤': ['emoticon-angry', '#FFA98F', '#D9603A'],
  '🤚': ['hand-front-right', '#FFB877', '#E0692A'],
  '🗣️': ['account-voice', '#B5D99A', '#6E9A4E'],
  '🚪': ['door-open', '#D9B48F', '#9C6B3F'],
  '🐕': ['dog', '#D9B48F', '#9C6B3F'],
  '🍽️': ['silverware-fork-knife', '#FFB877', '#E0692A'],
  '🧸': ['cube', '#F8A3B8', '#D95C7E'],
  '🌧️': ['weather-pouring', '#8FCBEF', '#3E8FC9'],
  '🌊': ['waves', '#8FCBEF', '#3E8FC9'],
  '🤫': ['weather-windy', '#B5D99A', '#6E9A4E'],
  '📌': ['pin', '#FFA98F', '#D9603A'],
  '☁️': ['cloud', '#A9A3E8', '#6C63C8'],
};

export function hasIcon3D(emo: string): boolean {
  return !!EMOJI3D[emo];
}

export function Icon3D({
  emo,
  size = 40,
  radius,
  style,
}: {
  emo: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const m = EMOJI3D[emo] || (['star-four-points', '#FFD97A', '#E8A81E'] as [Glyph, string, string]);
  const r = radius != null ? radius : Math.round(size * 0.32);
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: r,
          overflow: 'hidden',
          shadowColor: m[2],
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.33,
          shadowRadius: 6,
          elevation: 3,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[m[1], m[2]]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        {/* top inner highlight for the semi-3D read */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: Math.max(2, size * 0.16), backgroundColor: 'rgba(255,255,255,0.35)', borderTopLeftRadius: r, borderTopRightRadius: r }} />
        <MaterialCommunityIcons name={m[0]} size={Math.round(size * 0.52)} color="#fff" />
      </LinearGradient>
    </View>
  );
}
