import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../theme/ThemeContext';
import { fontFamily } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { Ic } from './Icon';
import { hasIcon3D, Icon3D } from './Icon3D';

/* ---------- Buttons ---------- */
export function ButtonPrimary({
  children,
  onPress,
  disabled,
  full = true,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, shadows } = useTheme();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: full ? '100%' : undefined,
          minHeight: 56,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          backgroundColor: disabled ? colors.borderDefault : colors.accentPrimary,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
        !disabled && {
          shadowColor: '#F96B26',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.32,
          shadowRadius: 22,
          elevation: 5,
        },
        style,
      ]}
    >
      <Txt style={{ fontSize: 16.5, fontWeight: '700', color: disabled ? colors.textMuted : colors.textOnAccent }}>
        {children as any}
      </Txt>
    </Pressable>
  );
}

export function ButtonSecondary({
  children,
  onPress,
  full = true,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  full?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: full ? '100%' : undefined,
          minHeight: 56,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          borderWidth: 1.5,
          borderColor: colors.borderDefault,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Txt style={{ fontSize: 16.5, fontWeight: '600', color: colors.textPrimary }}>{children as any}</Txt>
    </Pressable>
  );
}

export function ButtonText({
  children,
  onPress,
  style,
  textStyle,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: object;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ padding: 8, opacity: pressed ? 0.6 : 1 }, style]}>
      <Txt style={{ color: colors.accentPrimary, fontSize: 15, fontWeight: '600', ...(textStyle || {}) }}>
        {children as any}
      </Txt>
    </Pressable>
  );
}

/* ---------- Card / HeroCard ---------- */
export function Card({
  children,
  style,
  onPress,
  pad = 18,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  pad?: number;
}) {
  const { colors, radii, shadows } = useTheme();
  const base: StyleProp<ViewStyle> = [
    { backgroundColor: colors.bgElevated, borderRadius: radii.lg, padding: pad },
    shadows[2],
    style,
  ];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, { opacity: pressed ? 0.94 : 1 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

/** Decorative tone-on-tone pattern: soft concentric arcs + scattered dots. */
function HeroPattern() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Svg width="100%" height="100%" viewBox="0 0 353 200" preserveAspectRatio="xMaxYMin slice">
        <G fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1.5}>
          <Circle cx={335} cy={-10} r={52} />
          <Circle cx={335} cy={-10} r={86} />
          <Circle cx={335} cy={-10} r={122} />
          <Circle cx={-14} cy={205} r={46} />
          <Circle cx={-14} cy={205} r={78} />
        </G>
        <G fill="rgba(255,255,255,0.14)">
          <Circle cx={52} cy={34} r={2.4} />
          <Circle cx={120} cy={16} r={1.7} />
          <Circle cx={205} cy={42} r={2} />
          <Circle cx={86} cy={88} r={1.6} />
          <Circle cx={290} cy={132} r={2.2} />
          <Circle cx={180} cy={150} r={1.6} />
        </G>
      </Svg>
    </View>
  );
}

/** Muby gradient hero — vivid orange gradient + arc/dot pattern (Muby App Final). */
export function HeroCard({
  children,
  style,
  pad = 20,
}: {
  children: React.ReactNode;
  /** kept for call-site compatibility; the final design drops the intensity band */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  pad?: number;
}) {
  const { colors, radii, shadows } = useTheme();
  return (
    <View style={[{ borderRadius: radii.xl, overflow: 'hidden' }, shadows[3], style]}>
      <LinearGradient colors={colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 0 }}>
        <HeroPattern />
        <View style={{ padding: pad }}>{children}</View>
      </LinearGradient>
    </View>
  );
}

/* ---------- Chip — active is solid orange (Muby App Final) ---------- */
export function Chip({
  children,
  active,
  onPress,
  style,
}: {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 18,
          minHeight: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          backgroundColor: active ? colors.accentPrimary : colors.bgElevated,
          borderWidth: 1.5,
          borderColor: active ? colors.accentPrimary : colors.borderSubtle,
        },
        active && {
          shadowColor: '#F96B26',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
    >
      <Txt style={{ fontSize: 14, fontWeight: '600', color: active ? '#fff' : colors.textSecondary }}>
        {children as any}
      </Txt>
    </Pressable>
  );
}

/* ---------- Input ---------- */
const KEYBOARD: Record<string, KeyboardTypeOptions> = {
  tel: 'phone-pad',
  email: 'email-address',
  number: 'numeric',
};

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  prefix,
  error,
  hint,
  rightSlot,
  editable = true,
}: {
  label?: string;
  value: string;
  onChange?: (v: string) => void;
  type?: 'text' | 'tel' | 'email' | 'number' | 'password';
  placeholder?: string;
  prefix?: string;
  error?: string;
  hint?: string;
  rightSlot?: React.ReactNode;
  editable?: boolean;
}) {
  const { colors, radii } = useTheme();
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Txt style={{ fontSize: 13.5, fontWeight: '600', color: colors.textSecondary, marginBottom: 7 }}>{label}</Txt>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minHeight: 56,
          paddingHorizontal: 16,
          backgroundColor: colors.bgSunken,
          borderRadius: radii.md,
          borderWidth: 1.5,
          borderColor: error ? colors.danger : colors.borderSubtle,
        }}
      >
        {prefix ? <Txt style={{ color: colors.textMuted, fontWeight: '600', fontSize: 16 }}>{prefix}</Txt> : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPw && !show}
          keyboardType={type !== 'text' && type !== 'password' ? KEYBOARD[type] : 'default'}
          editable={editable}
          style={{
            flex: 1,
            fontSize: 16.5,
            color: colors.textPrimary,
            fontFamily: fontFamily(400),
            paddingVertical: 0,
          }}
        />
        {isPw ? (
          <Pressable onPress={() => setShow((s) => !s)} accessibilityLabel="hiện mật khẩu" hitSlop={8}>
            <Ic name={show ? 'eyeOff' : 'eye'} size={20} sw={1.7} color={colors.textMuted} />
          </Pressable>
        ) : null}
        {rightSlot}
      </View>
      {error ? <Txt style={{ fontSize: 12.5, color: colors.danger, marginTop: 6 }}>{error}</Txt> : null}
      {hint && !error ? <Txt style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 6 }}>{hint}</Txt> : null}
    </View>
  );
}

/* ---------- ListRow ---------- */
export function ListRow({
  icon,
  iconBg,
  title,
  sub,
  right,
  onPress,
  style,
}: {
  icon?: React.ReactNode;
  iconBg?: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radii } = useTheme();
  const Container: any = onPress ? Pressable : View;
  return (
    <Container onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12, paddingHorizontal: 4 }, style]}>
      {icon != null ? (
        <View style={{ width: 44, height: 44, borderRadius: radii.md, backgroundColor: iconBg || colors.bgSunken, alignItems: 'center', justifyContent: 'center' }}>
          {typeof icon === 'string' ? <Txt style={{ fontSize: 20 }}>{icon}</Txt> : icon}
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt style={{ fontSize: 15.5, fontWeight: '600', color: colors.textPrimary }}>{title}</Txt>
        {sub ? <Txt style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>{sub}</Txt> : null}
      </View>
      {right}
    </Container>
  );
}

/* ---------- Banner (inline) ---------- */
export function Banner({
  icon,
  children,
  tone = 'soft',
  onClose,
  style,
}: {
  icon?: string;
  children: React.ReactNode;
  tone?: 'soft' | 'sunken';
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radii } = useTheme();
  const bg = tone === 'soft' ? colors.bgAccentSoft : colors.bgSunken;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 12, paddingHorizontal: 14, backgroundColor: bg, borderRadius: radii.md }, style]}>
      {icon ? (hasIcon3D(icon) ? <Icon3D emo={icon} size={30} /> : <Txt style={{ fontSize: 16 }}>{icon}</Txt>) : null}
      <View style={{ flex: 1 }}>
        {typeof children === 'string' ? (
          <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>{children}</Txt>
        ) : (
          children
        )}
      </View>
      {onClose ? (
        <Pressable onPress={onClose} hitSlop={8}>
          <Ic name="close" size={16} sw={2} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- SkeletonCard ---------- */
export function SkeletonCard({ h = 120 }: { h?: number }) {
  const { colors, radii } = useTheme();
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 0.5, duration: 750, useNativeDriver: true }),
        Animated.timing(v, { toValue: 1, duration: 750, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return <Animated.View style={{ height: h, borderRadius: radii.lg, backgroundColor: colors.bgSunken, opacity: v }} />;
}

/* ---------- Toggle switch ---------- */
export function Toggle({ on, onPress }: { on: boolean; onPress?: () => void }) {
  const { colors, shadows } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 50, height: 30, borderRadius: 999, backgroundColor: on ? colors.accentPrimary : colors.borderDefault, justifyContent: 'center' }}
    >
      <View style={[{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' }, shadows[1]]} />
    </Pressable>
  );
}
