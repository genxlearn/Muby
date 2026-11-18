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
import { useTheme } from '../theme/ThemeContext';
import { fontFamily } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { Ic } from './Icon';
import { hasIcon3D, Icon3D } from './Icon3D';

/* ---------- Buttons (Peachy: pill 52px · label 15 SemiBold) ---------- */
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
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          width: full ? '100%' : undefined,
          minHeight: 52,
          paddingHorizontal: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          backgroundColor: disabled ? colors.borderDefault : pressed ? colors.accentHover : colors.accentPrimary,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Txt style={{ fontSize: 15, fontWeight: '600', color: disabled ? colors.textMuted : colors.textOnAccent }}>{children}</Txt>
      ) : (
        children
      )}
    </Pressable>
  );
}

/** Outline coral button (Peachy "Add measurement" / "Sign out"). */
export function ButtonSecondary({
  children,
  onPress,
  full = true,
  small,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  full?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: full ? '100%' : undefined,
          minHeight: small ? 34 : 52,
          paddingHorizontal: small ? 14 : 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          borderWidth: 1,
          borderColor: colors.accentPrimary,
          backgroundColor: pressed ? colors.bgAccentSoft : 'transparent',
        },
        style,
      ]}
    >
      <Txt style={{ fontSize: small ? 13 : 15, fontWeight: '600', color: colors.textBrand }}>{children as any}</Txt>
    </Pressable>
  );
}

/** Tonal coral pill — small secondary actions ("Ghi", "Xem chi tiết →"). */
export function ButtonTonal({
  children,
  onPress,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          alignSelf: 'flex-start',
          minHeight: 34,
          paddingHorizontal: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          backgroundColor: disabled ? colors.successSoft : pressed ? colors.bgAccentSoft : colors.accentSoftBg,
        },
        style,
      ]}
    >
      <Txt style={{ fontSize: 13, fontWeight: '600', color: disabled ? colors.success : colors.textBrand }}>{children as any}</Txt>
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
      <Txt style={{ color: colors.textBrand, fontSize: 15, fontWeight: '500', ...(textStyle || {}) }}>
        {children as any}
      </Txt>
    </Pressable>
  );
}

/* ---------- Card / HeroCard (Peachy: white · radius 16 / 24 · shadow/card) ---------- */
export function Card({
  children,
  style,
  onPress,
  pad = 20,
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

/** Hero card — the big white card at the top of a tab (Peachy "Next nap"). */
export function HeroCard({
  children,
  style,
  pad = 20,
}: {
  children: React.ReactNode;
  /** kept for call-site compatibility */
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  pad?: number;
}) {
  const { colors, radii, shadows } = useTheme();
  return (
    <View style={[{ borderRadius: radii.xl, backgroundColor: colors.bgElevated, padding: pad }, shadows[2], style]}>
      {children}
    </View>
  );
}

/** Soft peach → pink glow behind the top of a screen (Peachy screen background). */
export function ScreenGlow({ height = 380 }: { height?: number }) {
  const { colors } = useTheme();
  return (
    <LinearGradient
      pointerEvents="none"
      colors={colors.glow}
      locations={[0, 0.5, 1]}
      style={{ position: 'absolute', left: 0, right: 0, top: 0, height }}
    />
  );
}

/* ---------- Chip (Peachy: radius 8 · selected = coral tonal) ---------- */
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
  const { colors, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          paddingHorizontal: 14,
          minHeight: 36,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: radii.sm,
          backgroundColor: active ? colors.accentSoftBg : colors.bgSunken,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <Txt style={{ fontSize: 13, fontWeight: active ? '600' : '500', color: active ? colors.textBrand : colors.textSecondary }}>
        {children as any}
      </Txt>
    </Pressable>
  );
}

/* ---------- Tag (small tone pill) ---------- */
export type TagTone = 'brand' | 'success' | 'warning' | 'ai' | 'neutral' | 'danger';
export function Tag({ children, tone = 'neutral', style }: { children: React.ReactNode; tone?: TagTone; style?: StyleProp<ViewStyle> }) {
  const { colors, radii } = useTheme();
  const map: Record<TagTone, [string, string]> = {
    brand: [colors.accentSoftBg, colors.textBrand],
    success: [colors.successSoft, colors.success],
    warning: [colors.warningSoft, colors.warning],
    ai: [colors.aiTonal, colors.aiText],
    neutral: [colors.bgSunken, colors.textSecondary],
    danger: [colors.dangerSoft, colors.danger],
  };
  const [bg, fg] = map[tone];
  return (
    <View style={[{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm, backgroundColor: bg }, style]}>
      <Txt style={{ fontSize: 13, fontWeight: '500', color: fg }}>{children as any}</Txt>
    </View>
  );
}

/* ---------- Icon tile (40px, tinted per activity) ---------- */
export type TileTone = 'feed' | 'sleep' | 'diaper' | 'growth' | 'brand' | 'ai' | 'neutral';
export function tileColors(c: ReturnType<typeof useTheme>['colors'], tone: TileTone): [string, string] {
  switch (tone) {
    case 'feed': return [c.activity.feed.bg, c.activity.feed.fg];
    case 'sleep': return [c.activity.sleep.bg, c.activity.sleep.fg];
    case 'diaper': return [c.activity.diaper.bg, c.activity.diaper.fg];
    case 'growth': return [c.activity.growth.bg, c.activity.growth.fg];
    case 'brand': return [c.bgAccentSoft, c.textBrand];
    case 'ai': return [c.aiSubtle, c.aiText];
    default: return [c.bgSunken, c.textPrimary];
  }
}
export function IconTile({
  tone = 'neutral',
  icon,
  emoji,
  size = 40,
}: {
  tone?: TileTone;
  icon?: React.ComponentProps<typeof Ic>['name'];
  emoji?: string;
  size?: number;
}) {
  const { colors, radii } = useTheme();
  const [bg, fg] = tileColors(colors, tone);
  return (
    <View style={{ width: size, height: size, borderRadius: radii.md, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      {icon ? <Ic name={icon} size={Math.round(size * 0.55)} sw={1.6} color={fg} /> : emoji ? <Txt style={{ fontSize: size * 0.48 }}>{emoji}</Txt> : null}
    </View>
  );
}

/* ---------- Section header (Fraunces title + coral link) ---------- */
export function SectionHeader({ title, link, onLink, style }: { title: string; link?: string; onLink?: () => void; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }, style]}>
      <Txt serif style={{ flex: 1, fontSize: 22, lineHeight: 28, color: colors.textPrimary }}>{title}</Txt>
      {link ? (
        <Pressable onPress={onLink} hitSlop={8}>
          <Txt style={{ fontSize: 15, fontWeight: '500', color: colors.textBrand }}>{link}</Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- "Bống nhận thấy" insight card (Peachy AI Insight Card) ---------- */
export function InsightCard({
  eyebrow,
  children,
  meta,
  link,
  onLink,
  style,
}: {
  eyebrow: string;
  children: string;
  meta?: string;
  link?: string;
  onLink?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radii } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: 12, padding: 16, borderRadius: radii.lg, backgroundColor: colors.aiSubtle }, style]}>
      <View style={{ width: 3, borderRadius: 2, backgroundColor: colors.aiPrimary }} />
      <View style={{ flex: 1, gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ic name="sparkle" size={14} sw={1.8} color={colors.aiText} />
          <Txt style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: colors.aiText, textTransform: 'uppercase' }}>{eyebrow}</Txt>
        </View>
        <Txt italic style={{ fontSize: 17, lineHeight: 24, color: colors.textPrimary }}>{children}</Txt>
        {meta || link ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={{ width: 4, height: 12, borderRadius: 1, backgroundColor: i < 5 ? colors.aiPrimary : colors.aiTonal }} />
              ))}
            </View>
            <Txt style={{ flex: 1, fontSize: 13, color: colors.textSecondary }}>{meta}</Txt>
            {link ? (
              <Pressable onPress={onLink} hitSlop={8}>
                <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.aiText }}>{link}</Txt>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

/* ---------- Stat tile ("Hôm nay đến giờ") ---------- */
export function StatTile({
  tone,
  icon,
  label,
  value,
  sub,
  subTone,
  badge,
  width = 164,
  style,
}: {
  tone: TileTone;
  icon: React.ComponentProps<typeof Ic>['name'];
  label: string;
  value: string;
  sub?: string;
  subTone?: 'success' | 'muted';
  badge?: React.ReactNode;
  width?: number | 'auto';
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radii, shadows } = useTheme();
  return (
    <View style={[{ width: width === 'auto' ? undefined : width, padding: 16, gap: 12, borderRadius: radii.lg, backgroundColor: colors.bgElevated }, shadows[2], style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <IconTile tone={tone} icon={icon} size={32} />
        <Txt style={{ flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary }} numberOfLines={1}>{label}</Txt>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Txt style={{ fontSize: 20, lineHeight: 26, fontWeight: '600', letterSpacing: -0.2, color: colors.textPrimary }}>{value}</Txt>
        {badge}
      </View>
      {sub ? (
        <Txt style={{ fontSize: 13, color: subTone === 'success' ? colors.success : colors.textSecondary }} numberOfLines={2}>{sub}</Txt>
      ) : null}
    </View>
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
  const [focused, setFocused] = useState(false);
  const isPw = type === 'password';
  return (
    <View style={{ width: '100%' }}>
      {label ? (
        <Txt style={{ fontSize: 13, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 }}>{label}</Txt>
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          minHeight: 52,
          paddingHorizontal: 16,
          backgroundColor: colors.bgElevated,
          borderRadius: radii.lg,
          borderWidth: focused || error ? 1.5 : 1,
          borderColor: error ? colors.danger : focused ? colors.accentPrimary : colors.borderDefault,
        }}
      >
        {prefix ? <Txt style={{ color: colors.textSecondary, fontSize: 15 }}>{prefix}</Txt> : null}
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPw && !show}
          keyboardType={type !== 'text' && type !== 'password' ? KEYBOARD[type] : 'default'}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            fontSize: 15,
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
      {error ? <Txt style={{ fontSize: 13, color: colors.danger, marginTop: 6 }}>{error}</Txt> : null}
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
    <Container onPress={onPress} style={[{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }, style]}>
      {icon != null ? (
        <View style={{ width: 40, height: 40, borderRadius: radii.md, backgroundColor: iconBg || colors.bgSunken, alignItems: 'center', justifyContent: 'center' }}>
          {typeof icon === 'string' ? <Txt style={{ fontSize: 19 }}>{icon}</Txt> : icon}
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{title}</Txt>
        {sub ? <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{sub}</Txt> : null}
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
  tone?: 'soft' | 'sunken' | 'ai' | 'warning';
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, radii } = useTheme();
  const bg = tone === 'soft' ? colors.bgAccentSoft : tone === 'ai' ? colors.aiSubtle : tone === 'warning' ? colors.warningSoft : colors.bgSunken;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: bg, borderRadius: radii.lg }, style]}>
      {icon ? (hasIcon3D(icon) ? <Icon3D emo={icon} size={28} /> : <Txt style={{ fontSize: 16 }}>{icon}</Txt>) : null}
      <View style={{ flex: 1 }}>
        {typeof children === 'string' ? (
          <Txt style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 18 }}>{children}</Txt>
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
      style={{ width: 51, height: 31, borderRadius: 999, backgroundColor: on ? colors.accentPrimary : colors.borderDefault, justifyContent: 'center' }}
    >
      <View style={[{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 27, height: 27, borderRadius: 14, backgroundColor: '#fff' }, shadows[3]]} />
    </Pressable>
  );
}
