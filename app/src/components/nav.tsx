import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { Ic, IconName } from './Icon';
import type { Tab } from '../navigation/AppContext';

/* ---------- Bottom Nav — modern floating pill (Muby App Final) ---------- */
const NAV_ITEMS: { id: Tab; icon: IconName; label: string }[] = [
  { id: 'today', icon: 'home', label: 'Hôm nay' },
  { id: 'leap', icon: 'leap', label: 'Leap' },
  { id: 'growth', icon: 'growth', label: 'Phát triển' },
  { id: 'market', icon: 'market', label: 'Market' },
];

/** Height the floating nav needs at the bottom of scrollable tab content. */
export const NAV_CLEARANCE = 118;

export function BottomNav({ active, onNav }: { active: Tab; onNav: (t: Tab) => void }) {
  const { colors, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  // hex canvas + alpha — approximates the CSS color-mix fade above the pill
  const fadeTop = colors.bgCanvas + '00';
  const fadeBottom = colors.bgCanvas + 'E0';
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <LinearGradient
        pointerEvents="none"
        colors={[fadeTop, fadeBottom]}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <View style={{ paddingTop: 28, paddingHorizontal: 18, paddingBottom: Math.max(insets.bottom, 14) + 8 }}>
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colors.bgElevated + 'F0',
              borderWidth: 1,
              borderColor: colors.borderSubtle,
              borderRadius: 999,
              padding: 6,
            },
            shadows[3],
          ]}
        >
          {NAV_ITEMS.map((it) => {
            const on = active === it.id;
            return (
              <Pressable
                key={it.id}
                onPress={() => onNav(it.id)}
                accessibilityLabel={it.label}
                style={[
                  {
                    // flex ratios (not content width) so the 4 items always sum
                    // exactly to the pill's width — nothing can overflow it
                    flex: on ? 2 : 1,
                    minWidth: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    minHeight: 48,
                    borderRadius: 999,
                    paddingHorizontal: on ? 10 : 4,
                    backgroundColor: on ? colors.accentPrimary : 'transparent',
                  },
                  on && {
                    shadowColor: '#F96B26',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.35,
                    shadowRadius: 16,
                    elevation: 5,
                  },
                ]}
              >
                <Ic name={it.icon} size={23} sw={on ? 2.4 : 1.8} color={on ? '#fff' : colors.textMuted} />
                {on ? (
                  <Txt numberOfLines={1} style={{ fontSize: 13, fontWeight: '700', color: '#fff', flexShrink: 1 }}>
                    {it.label}
                  </Txt>
                ) : null}
              </Pressable>
            );
          })}
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
