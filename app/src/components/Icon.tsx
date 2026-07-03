import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';

export type IconName =
  | 'home' | 'leap' | 'growth' | 'me' | 'back' | 'bell' | 'close' | 'plus'
  | 'chevron' | 'eye' | 'eyeOff' | 'mic' | 'play' | 'pause' | 'lock'
  | 'check' | 'music' | 'camera' | 'cal';

const PATHS: Record<IconName, string> = {
  home: 'M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5',
  leap: 'M12 3v18M5.5 8.5 12 3l6.5 5.5M4 14c3 2 5 2 8 0s5-2 8 0',
  growth: 'M4 20V4M4 20h16M7 16l4-5 3 3 5-7',
  me: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c1-3.5 4-5 7-5s6 1.5 7 5',
  back: 'M15 5l-7 7 7 7',
  bell: 'M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0',
  close: 'M6 6l12 12M18 6 6 18',
  plus: 'M12 5v14M5 12h14',
  chevron: 'M9 6l6 6-6 6',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  eyeOff: 'M3 3l18 18M10 6a9 9 0 0 1 11 6 13 13 0 0 1-2.3 3M6.5 7.5A13 13 0 0 0 3 12s4 7 9 7a8.6 8.6 0 0 0 3.5-.7',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3',
  play: 'M8 5v14l11-7z',
  pause: 'M9 5v14M15 5v14',
  lock: 'M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z',
  check: 'M5 12.5 10 17l9-10',
  music: 'M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  camera: 'M3 8h4l2-2h6l2 2h4v12H3zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  cal: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
};

export function Ic({
  name,
  size = 24,
  color,
  sw = 1.9,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  sw?: number;
  style?: object;
}) {
  const { colors } = useTheme();
  const stroke = color || colors.textPrimary;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <Path
        d={PATHS[name]}
        fill={name === 'play' ? stroke : 'none'}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
