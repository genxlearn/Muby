/* ============================================================
   Shared screen pieces reused by Today + Leap:
   BabyAvatar, ForecastStrip, ActionCard, EasyEducationCard,
   SunnyPlaySection, SymptomSheet.
   ============================================================ */
import React, { useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, View } from 'react-native';
import { Banner, Card, Ic, Icon3D, Sheet } from '../components';
import * as D from '../data/sampleData';
import { LeapAction, Leap } from '../data/sampleData';
import { BongFace } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

const clampLv = (n: number) => (Math.min(5, Math.max(1, n)) as 1 | 2 | 3 | 4 | 5);

export function BabyAvatar({ size = 36 }: { size?: number }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.bgSunken,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: colors.borderSubtle,
      }}
    >
      <BongFace emotion="happy" size={size * 0.92} />
    </View>
  );
}

/* 7-day forecast strip — swipeable, larger cells (Muby App Final) */
export function ForecastStrip({ data, onPick }: { data: D.ForecastDay[]; onPick?: (d: D.ForecastDay) => void }) {
  const { colors, radii } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 6 }}>
      {data.map((d, i) => (
        <Pressable
          key={i}
          onPress={() => onPick && onPick(d)}
          style={{
            width: 64,
            alignItems: 'center',
            gap: 8,
            paddingVertical: 10,
            paddingHorizontal: 4,
            borderRadius: radii.md,
            backgroundColor: d.today ? colors.bgAccentSoft : colors.bgSunken,
            borderWidth: 1.5,
            borderColor: d.today ? colors.accentPrimary : 'transparent',
          }}
        >
          <Txt style={{ fontSize: 12, fontWeight: '700', color: d.today ? colors.accentPrimary : colors.textMuted }}>
            {d.today ? 'Hôm nay' : d.day}
          </Txt>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.intensity[clampLv(d.n)], alignItems: 'center', justifyContent: 'center' }}>
            <BongFace emotion={D.FORECAST_EMO[d.n]} size={38} />
          </View>
          <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.intensity[clampLv(d.n)] }} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

/* Action card — Icon3D badge + progressive disclosure (Muby App Final) */
export function ActionCard({
  action,
  onSound,
  defaultOpen = false,
}: {
  action: LeapAction;
  onSound?: (() => void) | null;
  /** kept for call-site compatibility; the final design drops the left strip */
  intensity?: number;
  defaultOpen?: boolean;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };
  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <Pressable
        onPress={toggle}
        accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 14, paddingLeft: 16, paddingRight: 14, minHeight: 56 }}
      >
        <Icon3D emo={action.emoji} size={40} />
        <Txt style={{ flex: 1, fontSize: 15, fontWeight: '700', color: colors.textPrimary, lineHeight: 20 }}>{action.title}</Txt>
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <Ic name="chevron" size={18} color={colors.textMuted} />
        </View>
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 21 }}>
            <Txt style={{ fontWeight: '600', color: colors.textPrimary }}>Vì sao? </Txt>
            {action.why}
          </Txt>
          <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 21, marginTop: 8 }}>
            <Txt style={{ fontWeight: '600', color: colors.textPrimary }}>Nên làm: </Txt>
            {action.what}
          </Txt>
          {action.hasSound && onSound ? (
            <Pressable
              onPress={onSound}
              style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingVertical: 11, paddingHorizontal: 16, minHeight: 44, borderRadius: 999, backgroundColor: colors.accentPrimary }}
            >
              <Txt style={{ fontSize: 13, fontWeight: '700', color: colors.textOnAccent }}>🎵 Bật tiếng ồn trắng</Txt>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

/* EASY teaser card → opens the dedicated EASY stack screen (Muby App Final) */
const EASY_BLOCKS = [
  { k: 'E', label: 'Ăn', icon: '🍼' },
  { k: 'A', label: 'Chơi', icon: '✨' },
  { k: 'S', label: 'Ngủ', icon: '🌙' },
  { k: 'Y', label: 'Mama', icon: '☕' },
];

export function EasyEducationCard() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const info = D.EASY_INFO;
  return (
    <Card pad={16} onPress={() => ctx.go('easy')}>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 14.5, fontWeight: '700', color: colors.textPrimary }}>Nhịp sinh hoạt EASY</Txt>
            <Txt style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 2 }}>{info.variant} · phù hợp bé {D.BABY.ageLabel}</Txt>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Txt style={{ fontSize: 12.5, color: colors.accentPrimary, fontWeight: '700' }}>Tìm hiểu</Txt>
            <Ic name="chevron" size={15} sw={2.2} color={colors.accentPrimary} />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {EASY_BLOCKS.map((b) => (
            <View key={b.k} style={{ flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 4, borderRadius: radii.md, backgroundColor: colors.bgSunken }}>
              <Icon3D emo={b.icon} size={32} />
              <Txt style={{ fontSize: 11.5, fontWeight: '700', color: colors.textPrimary }}>{b.k} · {b.label}</Txt>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

/* Sunny Play section (intensity <= 2) */
export function SunnyPlaySection({ leap }: { leap: Leap }) {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const plays = leap.sunnyPlay || [];
  if (plays.length === 0) return null;
  return (
    <View>
      <Txt style={{ fontSize: 15.5, fontWeight: '700', marginBottom: 4, paddingHorizontal: 2 }}>Sunny Play — Bé sẵn sàng học! 🌼</Txt>
      <Txt style={{ fontSize: 13, color: colors.textMuted, marginBottom: 12, paddingHorizontal: 2 }}>Hoạt động nhẹ nhàng cho Leap {leap.n}</Txt>
      <View style={{ gap: 10 }}>
        {plays.map((a, i) => (
          <Card key={i} pad={14} onPress={() => !ctx.premium && ctx.openPaywall('Mở khóa hướng dẫn từng bước')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 46, height: 46, borderRadius: radii.md, backgroundColor: colors.intensity[1], alignItems: 'center', justifyContent: 'center' }}>
                <BongFace emotion="curious" size={36} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={{ fontSize: 15, fontWeight: '700' }}>{a.title}</Txt>
                <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{a.desc}</Txt>
              </View>
              <Txt style={{ fontSize: 12.5, color: colors.accentPrimary, fontWeight: '700' }}>Thử ngay →</Txt>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

/* Symptom detail bottom sheet */
export function SymptomSheet({ symptom, leap, open, onClose }: { symptom: string | null; leap: Leap; open: boolean; onClose: () => void }) {
  const { colors } = useTheme();
  if (!symptom) return null;
  const action = leap.actions.find((a) => a.title.toLowerCase().includes(symptom.toLowerCase().slice(0, 6)));
  return (
    <Sheet open={open} onClose={onClose} height="58%" title={symptom}>
      <View style={{ gap: 14 }}>
        {action ? (
          <>
            <Txt style={{ fontSize: 15, lineHeight: 24, color: colors.textPrimary }}>
              <Txt style={{ fontWeight: '700' }}>Vì sao? </Txt>
              {action.why}
            </Txt>
            <Txt style={{ fontSize: 15, lineHeight: 24, color: colors.textPrimary }}>
              <Txt style={{ fontWeight: '700' }}>Nên làm gì? </Txt>
              {action.what}
            </Txt>
          </>
        ) : (
          <Txt style={{ fontSize: 15, lineHeight: 24, color: colors.textSecondary }}>
            Đây là biểu hiện bình thường ở Leap {leap.n}. Bé đang học {leap.skill}. Ôm bé nhiều hơn và kiên nhẫn nhé mama 💛
          </Txt>
        )}
        <Banner icon="💛" tone="soft">Mỗi leap rồi sẽ qua. Bé đang lớn lên ngay trong vòng tay mama.</Banner>
      </View>
    </Sheet>
  );
}

/** Horizontal symptom pill strip. */
export function SymptomPills({ symptoms, onPick }: { symptoms: string[]; onPick?: (s: string) => void }) {
  const { colors } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 2 }}>
      {symptoms.map((s, i) => {
        const inner = (
          <Txt style={{ fontSize: 13.5, fontWeight: '600', color: colors.textPrimary }}>{s}</Txt>
        );
        const style = {
          paddingVertical: 11,
          paddingHorizontal: 16,
          minHeight: 44,
          justifyContent: 'center' as const,
          borderRadius: 999,
          backgroundColor: colors.bgAccentSoft,
          borderWidth: 1,
          borderColor: colors.borderSubtle,
        };
        return onPick ? (
          <Pressable key={i} onPress={() => onPick(s)} style={style}>{inner}</Pressable>
        ) : (
          <View key={i} style={style}>{inner}</View>
        );
      })}
    </ScrollView>
  );
}
