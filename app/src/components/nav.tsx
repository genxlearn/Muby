import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { Ic, IconName } from './Icon';
import type { Tab } from '../navigation/AppContext';
import { BongFace } from '../mascot/Bong';

/* ---------- Bottom Nav v2 (MVP v2.1) - white pill with 4 tabs + coral FAB outside on the right ----------
   Mama is no longer a tab: it opens from the avatar at the top of each tab. */
const TABS: { id: Tab; icon: IconName; label: string }[] = [
  { id: 'today', icon: 'home', label: 'Hôm nay' },
  { id: 'leap', icon: 'leap', label: 'Leap' },
  { id: 'growth', icon: 'growth', label: 'Lớn khôn' },
  { id: 'community', icon: 'users', label: 'Cộng đồng' },
];

/** Height the floating nav needs at the bottom of scrollable tab content. */
export const NAV_CLEARANCE = 124;

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
  const fadeTop = colors.bgCanvas + '00';
  const fadeBottom = colors.bgCanvas + 'E6';

  const tab = (it: (typeof TABS)[number]) => {
    const on = active === it.id;
    return (
      <Pressable
        key={it.id}
        onPress={() => onNav(it.id)}
        accessibilityRole="tab"
        accessibilityLabel={it.label}
        accessibilityState={{ selected: on }}
        style={{
          flex: 1,
          minWidth: 0,
          height: 52,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          borderRadius: 999,
          backgroundColor: on ? colors.bgSunken : 'transparent',
        }}
      >
        <Ic name={it.icon} size={24} sw={on ? 2 : 1.6} color={on ? colors.accentPrimary : colors.textPrimary} />
        <Txt numberOfLines={1} style={{ fontSize: 11, fontWeight: on ? '600' : '500', color: on ? colors.textBrand : colors.textPrimary }}>
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
      <View
        pointerEvents="box-none"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 24, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 6 }}
      >
        <View
          style={[
            { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, padding: 6, backgroundColor: colors.bgElevated, borderRadius: 999 },
            shadows[3],
          ]}
        >
          {TABS.map(tab)}
        </View>
        {/* FAB - Ghi nhanh, outside the pill on the right */}
        <Pressable
          onPress={onFab}
          accessibilityLabel="Ghi nhanh"
          style={({ pressed }) => [
            {
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: pressed ? colors.accentHover : colors.accentPrimary,
              alignItems: 'center',
              justifyContent: 'center',
            },
            shadows.fab,
          ]}
        >
          <Ic name="plus" size={26} sw={2.2} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

/** Avatar at the top-right of each tab; opens the Mama page. */
export function AvatarButton({ onPress }: { onPress: () => void }) {
  const { colors, shadows } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="Trang của mama"
      hitSlop={6}
      style={[{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }, shadows[2]]}
    >
      <BongFace emotion="happy" size={32} />
    </Pressable>
  );
}

/* ---------- App bar (stack screens) - Peachy: chevron + headline title ---------- */
export function AppBar({ title, onBack, right }: { title?: string; onBack?: () => void; right?: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 52, paddingHorizontal: 12 }}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityLabel="Quay lại"
          hitSlop={8}
          style={({ pressed }) => ({ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: pressed ? colors.bgSunken : 'transparent' })}
        >
          <Ic name="back" size={24} sw={1.8} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={{ width: 8 }} />
      )}
      <Txt numberOfLines={1} style={{ flex: 1, fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>
        {title}
      </Txt>
      {right}
    </View>
  );
}

/** Large Fraunces title for tab roots (Peachy "Title · large"). */
export function LargeTitle({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Txt serif style={{ flex: 1, fontSize: 34, lineHeight: 41, color: colors.textPrimary }}>{title}</Txt>
        {right}
      </View>
      {sub ? <Txt style={{ fontSize: 13, color: colors.textSecondary }}>{sub}</Txt> : null}
    </View>
  );
}

/* ---------- Segmented control (Peachy: surface track, white selected pill) ---------- */
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
  const { colors, radii, shadows } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: 4, backgroundColor: colors.bgSunken, borderRadius: radii.md, padding: 4 }, style]}>
      {tabs.map((t) => {
        const on = value === t.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            style={[
              { flex: 1, minHeight: 36, alignItems: 'center', justifyContent: 'center', borderRadius: radii.sm, backgroundColor: on ? colors.bgElevated : 'transparent' },
              on && shadows[3],
            ]}
          >
            <Txt style={{ fontSize: 13, fontWeight: on ? '600' : '500', color: on ? colors.textPrimary : colors.textSecondary }}>{t.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}
