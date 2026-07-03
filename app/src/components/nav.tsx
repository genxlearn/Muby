import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { Ic, IconName } from './Icon';
import type { Tab } from '../navigation/AppContext';

/* ---------- Bottom Nav + raised FAB ---------- */
const NAV_ITEMS: { id: Tab | 'fab'; icon?: IconName; label?: string }[] = [
  { id: 'today', icon: 'home', label: 'Hôm nay' },
  { id: 'leap', icon: 'leap', label: 'Leap' },
  { id: 'fab' },
  { id: 'growth', icon: 'growth', label: 'Phát triển' },
  { id: 'me', icon: 'me', label: 'Mama' },
];

export function BottomNav({ active, onNav, onFab }: { active: Tab; onNav: (t: Tab) => void; onFab: () => void }) {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          paddingTop: 8,
          paddingHorizontal: 8,
          paddingBottom: Math.max(insets.bottom, 12),
          backgroundColor: colors.bgElevated,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
        },
        shadows[2],
      ]}
    >
      {NAV_ITEMS.map((it) =>
        it.id === 'fab' ? (
          <Pressable
            key="fab"
            onPress={onFab}
            accessibilityLabel="Ghi nhanh"
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.accentPrimary,
              alignItems: 'center',
              justifyContent: 'center',
              transform: [{ translateY: -18 }],
              borderWidth: 4,
              borderColor: colors.bgElevated,
              shadowColor: '#D87242',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.42,
              shadowRadius: 20,
              elevation: 8,
            }}
          >
            <Ic name="plus" size={30} sw={2.4} color={colors.textOnAccent} />
          </Pressable>
        ) : (
          <Pressable
            key={it.id}
            onPress={() => onNav(it.id as Tab)}
            accessibilityLabel={it.label}
            style={{ flex: 1, alignItems: 'center', gap: 3, paddingVertical: 6, minHeight: 48 }}
          >
            <Ic
              name={it.icon as IconName}
              size={25}
              sw={active === it.id ? 2.2 : 1.8}
              color={active === it.id ? colors.accentPrimary : colors.textMuted}
            />
            <Txt style={{ fontSize: 10.5, fontWeight: active === it.id ? '700' : '500', color: active === it.id ? colors.accentPrimary : colors.textMuted }}>
              {it.label}
            </Txt>
          </Pressable>
        )
      )}
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
