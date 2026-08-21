import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { Ic, IconName } from './Icon';
import type { Tab } from '../navigation/AppContext';

/* ---------- Bottom Nav — 2 tabs + Ghi nhanh FAB + 2 tabs (Muby v3) ---------- */
const NAV_LEFT: { id: Tab; icon: IconName; label: string }[] = [
  { id: 'today', icon: 'home', label: 'Hôm nay' },
  { id: 'leap', icon: 'leap', label: 'Leap' },
];
const NAV_RIGHT: { id: Tab; icon: IconName; label: string }[] = [
  { id: 'growth', icon: 'growth', label: 'Lớn khôn' },
  { id: 'me', icon: 'me', label: 'Mama' },
];

/** Height the floating nav needs at the bottom of scrollable tab content. */
export const NAV_CLEARANCE = 118;

export function BottomNav({
  active,
  onNav,
  onFab,
}: {
  active: Tab;
  onNav: (t: Tab) => void;
  onFab: () => void;
}) {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  // hex canvas + alpha — approximates the CSS color-mix fade above the pill
  const fadeTop = colors.bgCanvas + '00';
  const fadeBottom = colors.bgCanvas + 'E0';

  const Item = ({ it }: { it: { id: Tab; icon: IconName; label: string } }) => {
    const on = active === it.id;
    return (
      <Pressable
        onPress={() => onNav(it.id)}
        accessibilityLabel={it.label}
        style={{
          flex: 1,
          minWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          minHeight: 52,
          borderRadius: 999,
        }}
      >
        <Ic name={it.icon} size={23} sw={on ? 2.4 : 1.8} color={on ? colors.accentPrimary : colors.textMuted} />
        <Txt numberOfLines={1} style={{ fontSize: 10.5, fontWeight: on ? '700' : '500', color: on ? colors.accentPrimary : colors.textMuted }}>
          {it.label}
        </Txt>
      </Pressable>
    );
  };

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <LinearGradient
        pointerEvents="none"
        colors={[fadeTop, fadeBottom]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <View pointerEvents="box-none" style={{ paddingTop: 28, paddingHorizontal: 16, paddingBottom: Math.max(insets.bottom, 14) + 8 }}>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              backgroundColor: colors.bgElevated + 'F0',
              borderWidth: 1,
              borderColor: colors.borderSubtle,
              borderRadius: 999,
              paddingVertical: 6,
              paddingHorizontal: 8,
            },
            shadows[3],
          ]}
        >
          {NAV_LEFT.map((it) => (
            <Item key={it.id} it={it} />
          ))}
          {/* FAB — Ghi nhanh */}
          <Pressable
            onPress={onFab}
            accessibilityLabel="Ghi nhanh"
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              flexShrink: 0,
              marginTop: -14,
              marginHorizontal: 6,
              backgroundColor: colors.accentPrimary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 5,
              borderColor: colors.bgCanvas + 'CC',
              shadowColor: '#D87242',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Ic name="plus" size={26} sw={2.6} color="#fff" />
          </Pressable>
          {NAV_RIGHT.map((it) => (
            <Item key={it.id} it={it} />
          ))}
        </View>
      </View>
    </View>
  );
}

/* ---------- App bar (stack screens) ---------- */
export function AppBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6, paddingBottom: 12, paddingHorizontal: 14 }}>
      {onBack ? (
        <Pressable onPress={onBack} style={{ width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgSunken }}>
          <Ic name="back" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : null}
      <Txt serif style={{ flex: 1, fontSize: 20, fontWeight: '600', color: colors.textPrimary }}>
        {title}
      </Txt>
      {right}
    </View>
  );
}

/* ---------- Segmented sub-tabs ---------- */
export function SubTabs<T extends string>({
  tabs,
  value,
  onChange,
  style,
}: {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  style?: object;
}) {
  const { colors, shadows } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: 4, backgroundColor: colors.bgSunken, borderRadius: 999, padding: 4 }, style]}>
      {tabs.map((t) => {
        const on = value === t.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            style={[
              { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 999, backgroundColor: on ? colors.bgElevated : 'transparent' },
              on && shadows[1],
            ]}
          >
            <Txt style={{ fontSize: 13.5, fontWeight: '600', color: on ? colors.textPrimary : colors.textMuted }}>{t.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
