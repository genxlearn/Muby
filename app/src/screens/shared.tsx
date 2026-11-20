/* ============================================================
   Shared screen pieces reused by Today + Leap:
   BabyAvatar, ForecastStrip, ActionCard, EasyEducationCard,
   SunnyPlaySection, SymptomSheet.
   ============================================================ */
import React, { useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, View } from 'react-native';
import { Banner, Card, Ic, Icon3D, IconTile, Sheet } from '../components';
import type { IconName, TileTone } from '../components';
import * as D from '../data/sampleData';
import { LeapAction, Leap } from '../data/sampleData';
import { BongFace } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
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

/* 7-day forecast row - Peachy "Forecast Day" cells: day · Bống face · intensity bar */
export function ForecastStrip({ data, onPick }: { data: D.ForecastDay[]; onPick?: (d: D.ForecastDay) => void }) {
  const { colors, radii } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {data.slice(0, 7).map((d, i) => {
        const lv = clampLv(d.n);
        return (
          <Pressable
            key={i}
            onPress={() => onPick && onPick(d)}
            accessibilityLabel={`${d.today ? 'Hôm nay' : d.day}: ${D.INTENSITY_COPY[lv].label}`}
            style={{
              width: 42,
              alignItems: 'center',
              gap: 8,
              paddingTop: 8,
              paddingBottom: 10,
              borderRadius: radii.lg,
              backgroundColor: d.today ? colors.bgAccentSoft : 'transparent',
              borderWidth: 1,
              borderColor: d.today ? colors.accentPrimary : 'transparent',
            }}
          >
            <Txt style={{ fontSize: 11, fontWeight: '500', color: d.today ? colors.textBrand : colors.textSecondary }}>
              {d.today ? 'Nay' : d.day}
            </Txt>
            <BongFace emotion={D.FORECAST_EMO[d.n]} size={30} />
            <View style={{ width: 20, height: 4, borderRadius: 2, backgroundColor: colors.leap[lv] }} />
          </Pressable>
        );
      })}
    </View>
  );
}

/* Action card - Icon3D badge + progressive disclosure (Muby App Final) */
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
        <IconTile tone="brand" emoji={action.emoji} />
        <Txt style={{ flex: 1, fontSize: 15, fontWeight: '600', color: colors.textPrimary, lineHeight: 20 }}>{action.title}</Txt>
        <View style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          <Ic name="chevron" size={18} color={colors.textMuted} />
        </View>
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Txt style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 20 }}>
            <Txt style={{ fontWeight: '600', color: colors.textPrimary }}>Vì sao? </Txt>
            {action.why}
          </Txt>
          <View style={{ marginTop: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, backgroundColor: colors.bgAccentSoft }}>
            <Txt style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 18 }}>
              <Txt style={{ fontWeight: '600' }}>Nên làm: </Txt>
              {action.what}
            </Txt>
          </View>
          {action.hasSound && onSound ? (
            <Pressable
              onPress={onSound}
              style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 16, minHeight: 36, borderRadius: 999, backgroundColor: colors.accentSoftBg }}
            >
              <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand }}>🎵 Bật tiếng ồn trắng</Txt>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

/* EASY teaser card → opens the dedicated EASY stack screen (Muby App Final) */
const EASY_BLOCKS: { k: string; label: string; tone: TileTone; icon: IconName }[] = [
  { k: 'E', label: 'Ăn', tone: 'feed', icon: 'bottle' },
  { k: 'A', label: 'Chơi', tone: 'growth', icon: 'sun' },
  { k: 'S', label: 'Ngủ', tone: 'sleep', icon: 'moon' },
  { k: 'Y', label: 'Mama', tone: 'brand', icon: 'heart' },
];

export function EasyEducationCard() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const { state: st } = useBaby();
  return (
    <Card pad={16} onPress={() => ctx.go('easy')}>
      <View style={{ gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>Nhịp sinh hoạt EASY</Txt>
            <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{st.easyVariant} · phù hợp bé {st.ageLabel}</Txt>
          </View>
          <Ic name="chevron" size={20} color={colors.textSecondary} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {EASY_BLOCKS.map((b) => (
            <View key={b.k} style={{ flex: 1, alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 4, borderRadius: radii.md, backgroundColor: colors.bgSunken }}>
              <IconTile tone={b.tone} icon={b.icon} size={32} />
              <Txt style={{ fontSize: 11, fontWeight: '600', color: colors.textPrimary }}>{b.k} · {b.label}</Txt>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

/* Sunny Play section (intensity <= 2) - horizontal step-card carousel (v3) */
const PLAY_CARD_W = 250;

export function SunnyPlaySection({ leap }: { leap: Leap }) {
  const { colors, radii, shadows } = useTheme();
  const ctx = useApp();
  const plays = leap.sunnyPlay || [];
  if (plays.length === 0) return null;
  return (
    <View>
      <Txt serif style={{ fontSize: 22, lineHeight: 28, marginBottom: 4 }}>Sunny Play 🌼</Txt>
      <Txt style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>Bé sẵn sàng học · hoạt động nhẹ nhàng cho Leap {leap.n}</Txt>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={PLAY_CARD_W + 12}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 10, paddingTop: 4 }}
      >
        {plays.map((a, i) => (
          <View
            key={i}
            style={[
              { width: PLAY_CARD_W, borderRadius: radii.lg, backgroundColor: colors.bgElevated, padding: 16, gap: 10 },
              shadows[2],
            ]}
          >
            <View style={{ width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }}>
              <BongFace emotion="curious" size={34} />
            </View>
            <Txt style={{ fontSize: 17, fontWeight: '600' }}>{a.title}</Txt>
            <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20, flex: 1 }}>{a.desc}</Txt>
            <Pressable
              onPress={() => !ctx.premium && ctx.openPaywall('Mở khóa hướng dẫn từng bước')}
              style={{ alignSelf: 'flex-start', minHeight: 34, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.accentSoftBg, alignItems: 'center', justifyContent: 'center' }}
            >
              <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand }}>Thử ngay →</Txt>
            </Pressable>
          </View>
        ))}
      </ScrollView>
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
              <Txt style={{ fontWeight: '600' }}>Vì sao? </Txt>
              {action.why}
            </Txt>
            <Txt style={{ fontSize: 15, lineHeight: 24, color: colors.textPrimary }}>
              <Txt style={{ fontWeight: '600' }}>Nên làm gì? </Txt>
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
          <Txt style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary }}>{s}</Txt>
        );
        const style = {
          paddingVertical: 8,
          paddingHorizontal: 14,
          minHeight: 36,
          justifyContent: 'center' as const,
          borderRadius: 8,
          backgroundColor: colors.bgSunken,
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
