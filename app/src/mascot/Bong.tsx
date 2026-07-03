/* ============================================================
   BỐNG — semi-3D baby mascot (Muby v1.0), ported to react-native-svg.
   <Bong emotion="happy" onesie="orange" size={130} />
   ViewBox 0 0 200 240. CSS variables resolved from the active theme.
   ============================================================ */
import React, { useRef } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { Floating, Hop } from '../components/anim/Floating';
import { useTheme } from '../theme/ThemeContext';
import { ThemeColors } from '../theme/tokens';

export type Emotion =
  | 'happy' | 'blissful' | 'curious' | 'excited' | 'fussy' | 'snug'
  | 'eating' | 'surprise' | 'uncertain' | 'crying' | 'sleeping';
export type Onesie = 'orange' | 'sage' | 'cream' | 'lavender';

const ONESIE: Record<Onesie, { base: string; light: string; dark: string }> = {
  orange: { base: '#D87242', light: '#E89867', dark: '#B85A30' },
  sage: { base: '#9CB888', light: '#B5CCA4', dark: '#7E9A6C' },
  cream: { base: '#E8D4B5', light: '#F4E6CE', dark: '#CDB48E' },
  lavender: { base: '#B5A8C4', light: '#CBC0D8', dark: '#94859F' },
};

let UID = 0;

/* ---------- gradient defs per instance ---------- */
function BongDefs({ id, onesie, c }: { id: string; onesie: Onesie; c: ThemeColors }) {
  const o = ONESIE[onesie] || ONESIE.orange;
  return (
    <Defs>
      <RadialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.85">
        <Stop offset="0%" stopColor={c.charSkinHi} />
        <Stop offset="55%" stopColor={c.charSkin} />
        <Stop offset="100%" stopColor={c.charSkinShade} />
      </RadialGradient>
      <LinearGradient id={`${id}-onesie`} x1="0" y1="0" x2="0.35" y2="1">
        <Stop offset="0%" stopColor={o.light} />
        <Stop offset="50%" stopColor={o.base} />
        <Stop offset="100%" stopColor={o.dark} />
      </LinearGradient>
      <LinearGradient id={`${id}-limb`} x1="0" y1="0" x2="1" y2="0.4">
        <Stop offset="0%" stopColor={o.base} />
        <Stop offset="100%" stopColor={o.dark} />
      </LinearGradient>
      <RadialGradient id={`${id}-blush`} cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0%" stopColor={c.charBlush} stopOpacity="0.75" />
        <Stop offset="100%" stopColor={c.charBlush} stopOpacity="0" />
      </RadialGradient>
      <RadialGradient id={`${id}-ground`} cx="0.5" cy="0.5" r="0.5">
        <Stop offset="0%" stopColor="#2A1A14" stopOpacity="0.18" />
        <Stop offset="70%" stopColor="#2A1A14" stopOpacity="0.07" />
        <Stop offset="100%" stopColor="#2A1A14" stopOpacity="0" />
      </RadialGradient>
    </Defs>
  );
}

/* ---------- EYES ---------- */
const RoundEye = ({ x, y, r = 6, c }: { x: number; y: number; r?: number; c: ThemeColors }) => (
  <G>
    <Circle cx={x} cy={y + 0.8} r={r + 0.6} fill="rgba(42,26,20,0.10)" />
    <Circle cx={x} cy={y} r={r} fill={c.charEyes} />
    <Circle cx={x + r * 0.32} cy={y - r * 0.38} r={r * 0.32} fill="#fff" opacity={0.95} />
    <Circle cx={x - r * 0.3} cy={y + r * 0.32} r={r * 0.16} fill="#fff" opacity={0.5} />
  </G>
);
const HappyEye = ({ x, y, w = 8, c }: { x: number; y: number; w?: number; c: ThemeColors }) => (
  <Path d={`M${x - w},${y + 2} Q${x},${y - 5} ${x + w},${y + 2}`} stroke={c.charEyes} strokeWidth={3.2} fill="none" strokeLinecap="round" />
);
const SadEye = ({ x, y, w = 8, c }: { x: number; y: number; w?: number; c: ThemeColors }) => (
  <Path d={`M${x - w},${y - 2} Q${x},${y + 5} ${x + w},${y - 2}`} stroke={c.charEyes} strokeWidth={3.2} fill="none" strokeLinecap="round" />
);
const SleepEye = ({ x, y, w = 8, c }: { x: number; y: number; w?: number; c: ThemeColors }) => (
  <Path d={`M${x - w},${y} Q${x},${y - 3} ${x + w},${y}`} stroke={c.charEyes} strokeWidth={2.8} fill="none" strokeLinecap="round" />
);
const SlitEye = ({ x, y, w = 7, tilt = 0, c }: { x: number; y: number; w?: number; tilt?: number; c: ThemeColors }) => (
  <Path d={`M${x - w},${y + tilt} Q${x},${y + 1} ${x + w},${y - tilt}`} stroke={c.charEyes} strokeWidth={3.2} fill="none" strokeLinecap="round" />
);

/* ---------- MOUTHS ---------- */
const Smile = ({ y = 116, w = 13, c }: { y?: number; w?: number; c: ThemeColors }) => (
  <Path d={`M${100 - w},${y} Q100,${y + 11} ${100 + w},${y}`} stroke={c.charMouth} strokeWidth={3.6} fill="none" strokeLinecap="round" />
);
const BigSmile = ({ y = 114, c }: { y?: number; c: ThemeColors }) => (
  <G>
    <Path d={`M85,${y} Q100,${y + 18} 115,${y} Q100,${y + 6} 85,${y}Z`} fill={c.charMouth} />
    <Path d={`M92,${y + 7} Q100,${y + 11} 108,${y + 7}`} stroke="#fff" strokeWidth={2} fill="none" opacity={0.35} strokeLinecap="round" />
  </G>
);
const OpenMouth = ({ y = 116, rx = 7, ry = 8, c }: { y?: number; rx?: number; ry?: number; c: ThemeColors }) => (
  <G>
    <Ellipse cx={100} cy={y} rx={rx} ry={ry} fill={c.charMouth} />
    <Ellipse cx={100} cy={y + ry * 0.4} rx={rx * 0.55} ry={ry * 0.35} fill="#fff" opacity={0.25} />
  </G>
);
const TinyMouth = ({ y = 116, c }: { y?: number; c: ThemeColors }) => (
  <Path d={`M94,${y} Q100,${y + 5} 106,${y}`} stroke={c.charMouth} strokeWidth={3.2} fill="none" strokeLinecap="round" />
);
const Wobble = ({ y = 117, c }: { y?: number; c: ThemeColors }) => (
  <Path d={`M88,${y} Q94,${y - 4} 100,${y} T112,${y}`} stroke={c.charMouth} strokeWidth={3.2} fill="none" strokeLinecap="round" />
);
const Frown = ({ y = 120, w = 11, c }: { y?: number; w?: number; c: ThemeColors }) => (
  <Path d={`M${100 - w},${y} Q100,${y - 9} ${100 + w},${y}`} stroke={c.charMouth} strokeWidth={3.4} fill="none" strokeLinecap="round" />
);
const CryMouth = ({ c }: { c: ThemeColors }) => (
  <G>
    <Path d="M89,118 Q100,107 111,118 Q100,132 89,118Z" fill={c.charMouth} />
    <Path d="M93,121 Q100,126 107,121" stroke="#fff" strokeWidth={2} fill="none" opacity={0.5} strokeLinecap="round" />
  </G>
);

/* ---------- EXTRAS ---------- */
const Tear = ({ x, y, c }: { x: number; y: number; c: ThemeColors }) => (
  <G>
    <Path d={`M${x},${y} C${x - 4},${y + 6} ${x - 4},${y + 11} ${x},${y + 11} C${x + 4},${y + 11} ${x + 4},${y + 6} ${x},${y}Z`} fill={c.tear} />
    <Circle cx={x - 1.2} cy={y + 7.5} r={1.3} fill="#fff" opacity={0.7} />
  </G>
);
const Sparkle = ({ x, y, s = 5, o = 1, c }: { x: number; y: number; s?: number; o?: number; c: ThemeColors }) => (
  <Path d={`M${x},${y - s} Q${x + 1},${y - 1} ${x + s},${y} Q${x + 1},${y + 1} ${x},${y + s} Q${x - 1},${y + 1} ${x - s},${y} Q${x - 1},${y - 1} ${x},${y - s}Z`} fill={c.accentPrimary} opacity={o} />
);
const Zzz = ({ c }: { c: ThemeColors }) => (
  <G fill="none" stroke={c.textMuted} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M150,48 h9 l-9,10 h9" />
    <Path d="M168,30 h6 l-6,7 h6" />
  </G>
);
const BrowRaise = ({ side = 1, c }: { side?: number; c: ThemeColors }) => {
  const x = side > 0 ? 122 : 78;
  return <Path d={`M${x - 8},72 Q${x},68 ${x + 8},72`} stroke={c.charEyes} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
};
const BrowWorried = ({ c }: { c: ThemeColors }) => (
  <G stroke={c.charEyes} strokeWidth={2.6} fill="none" strokeLinecap="round">
    <Path d="M70,74 Q78,70 86,75" />
    <Path d="M114,75 Q122,70 130,74" />
  </G>
);
const BrowAngry = ({ c }: { c: ThemeColors }) => (
  <G stroke={c.charEyes} strokeWidth={2.8} fill="none" strokeLinecap="round">
    <Path d="M70,73 L86,78" />
    <Path d="M130,73 L114,78" />
  </G>
);

/* accentPrimary needed by Sparkle — extend the color set locally */
type FaceColors = ThemeColors;

/* ---------- FACE BY EMOTION ---------- */
function Face({ emotion, c }: { emotion: Emotion; c: FaceColors }) {
  const L = 78, R = 122, EY = 90;
  switch (emotion) {
    case 'happy':
      return <G><RoundEye x={L} y={EY} c={c} /><RoundEye x={R} y={EY} c={c} /><Smile c={c} /></G>;
    case 'blissful':
      return <G><HappyEye x={L} y={EY} c={c} /><HappyEye x={R} y={EY} c={c} /><BigSmile c={c} /><Sparkle x={150} y={70} s={6} o={0.8} c={c} /><Sparkle x={48} y={78} s={4} o={0.7} c={c} /></G>;
    case 'curious':
      return <G><BrowRaise side={1} c={c} /><RoundEye x={L} y={EY} r={5.5} c={c} /><RoundEye x={R} y={EY} r={6.5} c={c} /><OpenMouth y={117} rx={4.5} ry={5} c={c} /></G>;
    case 'excited':
      return <G><RoundEye x={L} y={EY} r={7} c={c} /><RoundEye x={R} y={EY} r={7} c={c} /><BigSmile c={c} /><Sparkle x={150} y={64} s={6} c={c} /><Sparkle x={46} y={70} s={5} c={c} /><Sparkle x={156} y={96} s={4} o={0.8} c={c} /></G>;
    case 'fussy':
      return <G><BrowAngry c={c} /><SlitEye x={L} y={EY} tilt={2} c={c} /><SlitEye x={R} y={EY} tilt={-2} c={c} /><Frown c={c} /></G>;
    case 'snug':
      return <G><SleepEye x={L} y={EY} c={c} /><SleepEye x={R} y={EY} c={c} /><TinyMouth c={c} /></G>;
    case 'eating':
      return <G><HappyEye x={L} y={EY} c={c} /><HappyEye x={R} y={EY} c={c} /><OpenMouth y={118} rx={6} ry={7} c={c} /></G>;
    case 'surprise':
      return <G><BrowWorried c={c} /><RoundEye x={L} y={EY} r={7.5} c={c} /><RoundEye x={R} y={EY} r={7.5} c={c} /><OpenMouth y={119} rx={6} ry={8} c={c} /></G>;
    case 'uncertain':
      return <G><BrowRaise side={1} c={c} /><RoundEye x={L} y={EY} r={4.6} c={c} /><RoundEye x={R} y={EY} r={6.4} c={c} /><Wobble c={c} /></G>;
    case 'crying':
      return <G><BrowWorried c={c} /><SadEye x={L} y={EY} c={c} /><SadEye x={R} y={EY} c={c} /><CryMouth c={c} /></G>;
    case 'sleeping':
      return <G><SleepEye x={L} y={EY} c={c} /><SleepEye x={R} y={EY} c={c} /><TinyMouth y={117} c={c} /><Zzz c={c} /></G>;
    default:
      return <G><RoundEye x={L} y={EY} c={c} /><RoundEye x={R} y={EY} c={c} /><Smile c={c} /></G>;
  }
}

/* ---------- BODY (semi-3D onesie) ---------- */
function Body({ id, c }: { id: string; c: ThemeColors }) {
  return (
    <G>
      <Ellipse cx={50} cy={162} rx={13} ry={22} fill={`url(#${id}-limb)`} transform="rotate(14 50 162)" />
      <Ellipse cx={150} cy={162} rx={13} ry={22} fill={`url(#${id}-limb)`} transform="rotate(-14 150 162)" />
      <Circle cx={44} cy={180} r={10} fill={`url(#${id}-skin)`} />
      <Circle cx={156} cy={180} r={10} fill={`url(#${id}-skin)`} />
      <Ellipse cx={41.5} cy={177} rx={3.5} ry={2.6} fill="#fff" opacity={0.4} transform="rotate(-25 41.5 177)" />
      <Ellipse cx={153.5} cy={177} rx={3.5} ry={2.6} fill="#fff" opacity={0.4} transform="rotate(-25 153.5 177)" />
      <Path d="M58,140 Q58,128 72,127 L128,127 Q142,128 142,140 L146,196 Q146,210 132,210 L68,210 Q54,210 54,196 Z" fill={`url(#${id}-onesie)`} />
      <Ellipse cx={86} cy={152} rx={26} ry={18} fill="#fff" opacity={0.14} />
      <Path d="M56,190 Q100,206 144,190 L146,196 Q146,210 132,210 L68,210 Q54,210 54,196 Z" fill="#2A1A14" opacity={0.08} />
      <Path d="M70,200 Q70,224 84,224 Q96,224 96,206 L96,200 Z" fill={`url(#${id}-limb)`} />
      <Path d="M130,200 Q130,224 116,224 Q104,224 104,206 L104,200 Z" fill={`url(#${id}-limb)`} />
      <Ellipse cx={80} cy={224} rx={16} ry={9} fill={`url(#${id}-onesie)`} />
      <Ellipse cx={120} cy={224} rx={16} ry={9} fill={`url(#${id}-onesie)`} />
      <Ellipse cx={76} cy={221} rx={6} ry={3} fill="#fff" opacity={0.25} />
      <Ellipse cx={116} cy={221} rx={6} ry={3} fill="#fff" opacity={0.25} />
      <Path d="M100,130 L100,196" stroke="rgba(0,0,0,0.10)" strokeWidth={2} />
      <Circle cx={100} cy={150} r={2.6} fill="rgba(0,0,0,0.16)" />
      <Circle cx={100} cy={149.3} r={2.6} fill="rgba(255,255,255,0.22)" opacity={0.6} />
      <Circle cx={100} cy={168} r={2.6} fill="rgba(0,0,0,0.16)" />
      <Path d="M78,130 Q100,142 122,130" stroke="rgba(255,255,255,0.30)" strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  );
}

export interface BongProps {
  emotion?: Emotion;
  onesie?: Onesie;
  size?: number;
  float?: boolean;
  hop?: boolean;
  shadow?: boolean;
  tears?: number;
  style?: object;
}

export function Bong({
  emotion = 'happy',
  onesie = 'orange',
  size = 130,
  float = false,
  hop = false,
  shadow = true,
  tears = 1,
  style,
}: BongProps) {
  const { colors: c } = useTheme();
  const idRef = useRef<string>('');
  if (!idRef.current) idRef.current = 'bg' + ++UID;
  const id = idRef.current;
  const w = size, h = size * 1.2;

  const svg = (
    <Svg width={w} height={h} viewBox="0 0 200 240" style={{ overflow: 'visible' }}>
      <BongDefs id={id} onesie={onesie} c={c} />
      {shadow && <Ellipse cx={100} cy={233} rx={62} ry={10} fill={`url(#${id}-ground)`} />}
      <Body id={id} c={c} />
      <Ellipse cx={42} cy={92} rx={10} ry={14} fill={`url(#${id}-skin)`} />
      <Ellipse cx={158} cy={92} rx={10} ry={14} fill={`url(#${id}-skin)`} />
      <Ellipse cx={44} cy={92} rx={5} ry={7} fill={c.charSkinShade} opacity={0.7} />
      <Ellipse cx={156} cy={92} rx={5} ry={7} fill={c.charSkinShade} opacity={0.7} />
      <Ellipse cx={100} cy={86} rx={58} ry={55} fill={`url(#${id}-skin)`} />
      <Path d="M52,100 Q100,134 148,100 Q140,128 100,130 Q60,128 52,100Z" fill={c.charSkinShade} opacity={0.5} />
      <Ellipse cx={76} cy={52} rx={24} ry={14} fill="#fff" opacity={0.35} transform="rotate(-18 76 52)" />
      <Path d="M100,33 C100,20 87,18 91,8 C93,3 102,4 101,12" stroke={c.charHair} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      <Ellipse cx={66} cy={104} rx={11} ry={7.5} fill={`url(#${id}-blush)`} />
      <Ellipse cx={134} cy={104} rx={11} ry={7.5} fill={`url(#${id}-blush)`} />
      <Face emotion={emotion} c={c} />
      {emotion === 'crying' && <Tear x={70} y={100} c={c} />}
      {emotion === 'crying' && tears >= 2 && <Tear x={130} y={100} c={c} />}
    </Svg>
  );

  const sized = <View style={[{ width: w, height: h }, style]}>{svg}</View>;
  if (hop) return <Hop>{sized}</Hop>;
  if (float) return <Floating>{sized}</Floating>;
  return sized;
}

/* ---------- mini face (avatars, forecast) ---------- */
export function BongFace({
  emotion = 'happy',
  size = 32,
  ring = false,
  style,
}: {
  emotion?: Emotion;
  size?: number;
  ring?: boolean;
  style?: object;
}) {
  const { colors: c } = useTheme();
  const idRef = useRef<string>('');
  if (!idRef.current) idRef.current = 'bf' + ++UID;
  const id = idRef.current;
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="38 36 124 110" style={{ overflow: 'visible' }}>
        <Defs>
          <RadialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.85">
            <Stop offset="0%" stopColor={c.charSkinHi} />
            <Stop offset="55%" stopColor={c.charSkin} />
            <Stop offset="100%" stopColor={c.charSkinShade} />
          </RadialGradient>
          <RadialGradient id={`${id}-blush`} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0%" stopColor={c.charBlush} stopOpacity="0.75" />
            <Stop offset="100%" stopColor={c.charBlush} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {ring && <Circle cx={100} cy={92} r={62} fill={c.bgSunken} />}
        <Ellipse cx={42} cy={92} rx={10} ry={14} fill={`url(#${id}-skin)`} />
        <Ellipse cx={158} cy={92} rx={10} ry={14} fill={`url(#${id}-skin)`} />
        <Ellipse cx={100} cy={90} rx={58} ry={55} fill={`url(#${id}-skin)`} />
        <Ellipse cx={76} cy={56} rx={24} ry={14} fill="#fff" opacity={0.35} transform="rotate(-18 76 56)" />
        <Path d="M100,37 C100,24 87,22 91,12 C93,7 102,8 101,16" stroke={c.charHair} strokeWidth={6.5} fill="none" strokeLinecap="round" />
        <Ellipse cx={66} cy={108} rx={11} ry={7.5} fill={`url(#${id}-blush)`} />
        <Ellipse cx={134} cy={108} rx={11} ry={7.5} fill={`url(#${id}-blush)`} />
        <G transform="translate(0 4)"><Face emotion={emotion} c={c} /></G>
        {emotion === 'crying' && <Tear x={70} y={104} c={c} />}
      </Svg>
    </View>
  );
}

export const INTENSITY_BONG: Record<number, { emotion: Emotion; onesie: Onesie; tears?: number }> = {
  1: { emotion: 'blissful', onesie: 'sage' },
  2: { emotion: 'happy', onesie: 'orange' },
  3: { emotion: 'uncertain', onesie: 'cream' },
  4: { emotion: 'crying', onesie: 'lavender', tears: 1 },
  5: { emotion: 'crying', onesie: 'lavender', tears: 2 },
};

export function BongIntensity({
  level = 2,
  size = 130,
  float = false,
  ...rest
}: { level?: number; size?: number; float?: boolean } & Partial<BongProps>) {
  const m = INTENSITY_BONG[level] || INTENSITY_BONG[2];
  return <Bong emotion={m.emotion} onesie={m.onesie} tears={m.tears ?? 1} size={size} float={float} {...rest} />;
}
