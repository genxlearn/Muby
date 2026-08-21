/* ============================================================
   SCREEN 5 Growth · 6 Add Measurement · 7 Log History · 8 Library
   Ported from project/screens/growth.jsx to React Native.
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  Card,
  Chip,
  EmptyState,
  Flower,
  FlowerField,
  Ic,
  Input,
  ListRow,
  NAV_CLEARANCE,
  Sheet,
} from '../components';
import * as D from '../data/sampleData';
import { Bong, BongFace } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

type Metric = 'weight' | 'height' | 'feed' | 'sleep' | 'diaper';

interface MetricSet {
  lo: number[];
  hi: number[];
  user: number[];
  unit: string;
  max: number;
  min: number;
}

/* ---- WHO-style growth chart ---- */
function GrowthChart({ metric }: { metric: Metric }) {
  const { colors } = useTheme();
  const W = 300,
    H = 180,
    padL = 8,
    padR = 8,
    padT = 12,
    padB = 18;
  const sets: Record<Metric, MetricSet> = {
    weight: { lo: [3.0, 4.0, 4.8, 5.4, 5.9, 6.3, 6.6], hi: [4.2, 5.4, 6.4, 7.1, 7.7, 8.2, 8.6], user: [3.3, 4.3, 5.2, 5.8, 6.1, 6.4], unit: 'kg', max: 9, min: 2.5 },
    height: { lo: [49, 53, 56, 58, 60, 61.5, 63], hi: [53, 57, 60, 62.5, 64.5, 66, 67.5], user: [50, 54, 57, 59, 60.5, 61], unit: 'cm', max: 70, min: 47 },
    feed: { lo: [560, 600, 640, 680, 700, 720, 720], hi: [900, 950, 1000, 1000, 1000, 1000, 1000], user: [580, 650, 720, 780, 700, 640], unit: 'ml/ngày', max: 1100, min: 450 },
    sleep: { lo: [14, 13.5, 13, 12.5, 12, 12, 12], hi: [17, 17, 16.5, 16.5, 16, 16, 16], user: [16, 15.5, 15, 14.5, 13.5, 14], unit: 'giờ/ngày', max: 18.5, min: 10.5 },
    diaper: { lo: [6, 6, 5.5, 5, 5, 5, 5], hi: [10, 9.5, 9, 8.5, 8, 8, 8], user: [8, 7.5, 7, 6.5, 6, 6], unit: 'tã/ngày', max: 11, min: 3.5 },
  };
  const d = sets[metric];
  const n = d.hi.length;
  const xs = (i: number, len: number) => padL + (i / (len - 1)) * (W - padL - padR);
  const ys = (v: number) => H - padB - ((v - d.min) / (d.max - d.min)) * (H - padT - padB);
  const bandTop = d.hi.map((v, i) => `${xs(i, n).toFixed(1)},${ys(v).toFixed(1)}`).join(' ');
  const bandBot = d.lo.map((v, i) => `${xs(i, n).toFixed(1)},${ys(v).toFixed(1)}`).reverse().join(' ');
  const userPath = d.user.map((v, i) => `${i ? 'L' : 'M'}${xs(i, d.user.length).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
  const lastX = xs(d.user.length - 1, d.user.length),
    lastY = ys(d.user[d.user.length - 1]);
  return (
    <Svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}>
      {[0.25, 0.5, 0.75].map((f) => (
        <Line
          key={f}
          x1={padL}
          x2={W - padR}
          y1={padT + f * (H - padT - padB)}
          y2={padT + f * (H - padT - padB)}
          stroke={colors.borderSubtle}
          strokeWidth={1}
          strokeDasharray="3 4"
        />
      ))}
      <Polygon points={`${bandTop} ${bandBot}`} fill={colors.intensity[1]} opacity={0.5} />
      <Polyline points={d.hi.map((v, i) => `${xs(i, n)},${ys(v)}`).join(' ')} fill="none" stroke={colors.success} strokeWidth={1.5} opacity={0.5} />
      <Polyline points={d.lo.map((v, i) => `${xs(i, n)},${ys(v)}`).join(' ')} fill="none" stroke={colors.success} strokeWidth={1.5} opacity={0.5} />
      <Path d={userPath} fill="none" stroke={colors.accentPrimary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      {d.user.map((v, i) => (
        <Circle key={i} cx={xs(i, d.user.length)} cy={ys(v)} r={3.5} fill={colors.accentPrimary} stroke={colors.bgElevated} strokeWidth={2} />
      ))}
      <Circle cx={lastX} cy={lastY} r={6} fill={colors.accentPrimary} stroke={colors.bgElevated} strokeWidth={3} />
    </Svg>
  );
}

const METRIC_TABS: { id: Metric; label: string }[] = [
  { id: 'weight', label: 'Cân nặng' },
  { id: 'height', label: 'Chiều cao' },
  { id: 'feed', label: 'Cữ ăn' },
  { id: 'sleep', label: 'Giấc ngủ' },
];

/** Per-metric empty-state copy (v3). */
const EMPTY_META: Record<Metric, { heading: string; helper: string; cta: string; measure?: boolean }> = {
  weight: { heading: 'Chưa có số đo nào', helper: 'Thêm số đo đầu tiên để bắt đầu vẽ đường lớn của bé nhé mama 💛', cta: '+ Thêm số đo đầu tiên', measure: true },
  height: { heading: 'Chưa có số đo nào', helper: 'Thêm số đo đầu tiên để bắt đầu vẽ đường lớn của bé nhé mama 💛', cta: '+ Thêm số đo đầu tiên', measure: true },
  feed: { heading: 'Chưa có cữ ăn nào', helper: 'Ghi cữ ăn đầu tiên để thấy nhịp bú của bé nhé mama 💛', cta: '+ Ghi cữ ăn' },
  sleep: { heading: 'Chưa có giấc ngủ nào', helper: 'Ghi giấc ngủ đầu tiên để thấy nhịp ngủ của bé 🌙', cta: '+ Ghi giấc ngủ' },
  diaper: { heading: 'Chưa có lần thay tã nào', helper: 'Tã ướt đều đặn là dấu hiệu bé bú đủ — ghi lại để cùng theo dõi nhé 💛', cta: '+ Ghi tã' },
};

/** Metric chip strip — shared by the normal and empty growth screens. */
function MetricChips({ metric, onPick }: { metric: Metric; onPick: (m: Metric) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginHorizontal: -20, marginTop: -8, marginBottom: 14, flexGrow: 0 }}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 }}
    >
      {METRIC_TABS.map((t) => (
        <Chip key={t.id} active={metric === t.id} onPress={() => onPick(t.id)}>{t.label}</Chip>
      ))}
    </ScrollView>
  );
}

/** Today's date in Vietnamese dd/mm/yyyy format. */
function todayVN(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const LOG_TITLE: Record<Metric, string> = {
  weight: 'đo lường',
  height: 'đo lường',
  feed: 'cữ ăn',
  sleep: 'giấc ngủ',
  diaper: 'tã',
};

export function GrowthScreen({ initialMetric }: { initialMetric?: Metric } = {}) {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [metric, setMetric] = useState<Metric>(initialMetric || 'weight');
  const { BABY } = D;
  const { state: st } = useBaby();
  const MEASURE_LOG = [
    { date: 'Hôm nay', label: `${BABY.weight} kg · ${BABY.height} cm` },
    { date: '20/06', label: '6.1 kg · 60.5 cm' },
    { date: '05/06', label: '5.8 kg · 59 cm' },
  ];
  const META: Record<Metric, { latest: string; sub: string; band: string }> = {
    weight: { latest: `${BABY.weight} kg`, sub: 'Bé đang phát triển khoẻ mạnh 💚', band: 'Vùng khoẻ mạnh theo WHO' },
    height: { latest: `${BABY.height} cm`, sub: 'Bé đang phát triển khoẻ mạnh 💚', band: 'Vùng khoẻ mạnh theo WHO' },
    feed: { latest: '640 ml/ngày', sub: 'Bé đang bú đủ — yên tâm nhé mama 💚', band: 'Khoảng thường gặp ở bé cùng tuổi' },
    sleep: { latest: '14 giờ/ngày', sub: 'Ngủ ít hơn chút trong leap là bình thường 💛', band: 'Khoảng thường gặp ở bé cùng tuổi' },
    diaper: { latest: '6 tã/ngày', sub: 'Tã ướt đều đặn = bé bú đủ 💚', band: 'Khoảng thường gặp ở bé cùng tuổi' },
  };
  const m = META[metric];
  // "today" stats and typical ranges come from the engine — age-appropriate for THIS baby
  const stat = st.dailyStats.find((s) => s.id === metric);
  const inRange = stat ? stat.num >= stat.lo && stat.num <= stat.hi : false;
  const pos = stat ? Math.min(100, Math.max(0, ((stat.num - stat.lo) / (stat.hi - stat.lo)) * 60 + 20)) : 0;
  const dailyLog = stat
    ? D.LOG_HISTORY.map((g) => ({ date: g.date, items: g.items.filter((it) => it.type === metric) })).filter((g) => g.items.length)
    : null;
  const isMeasure = metric === 'weight' || metric === 'height';

  if (ctx.empty) {
    const em = EMPTY_META[metric];
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
        <View style={{ paddingTop: 6, paddingHorizontal: 20, paddingBottom: 16 }}>
          <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, marginBottom: 24 }}>Bé lớn lên</Txt>
          <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginHorizontal: 2 }}>Đường lớn của bé</Txt>
          <MetricChips metric={metric} onPick={setMetric} />
          <EmptyState emotion="curious" onesie="sage" heading={em.heading} helper={em.helper} />
          <ButtonPrimary onPress={() => (em.measure ? ctx.go('measure') : ctx.openSheet('quicklog'))}>{em.cta}</ButtonPrimary>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
      <View style={{ paddingTop: 6, paddingHorizontal: 20 }}>
        <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, marginBottom: 24 }}>Bé lớn lên</Txt>

        <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginHorizontal: 2 }}>Đường lớn của bé</Txt>
        <MetricChips metric={metric} onPick={setMetric} />

        {/* HÔM NAY — chỉ số đối chiếu của tab đang chọn (cữ ăn / ngủ / tã) */}
        {stat ? (
          <Card pad={16} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: radii.md, backgroundColor: colors.bgSunken, alignItems: 'center', justifyContent: 'center' }}>
                <Txt style={{ fontSize: 20 }}>{stat.icon}</Txt>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600' }}>{stat.label}</Txt>
                <Txt style={{ fontSize: 16.5, fontWeight: '700', color: colors.textPrimary, marginTop: 2 }}>{stat.value}</Txt>
              </View>
              {inRange ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 11, borderRadius: 999, backgroundColor: colors.successSoft }}>
                  <Ic name="check" size={13} sw={3} color={colors.success} />
                  <Txt style={{ fontSize: 12, fontWeight: '700', color: colors.success }}>Trong khoảng</Txt>
                </View>
              ) : null}
            </View>
            <View style={{ marginTop: 14 }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.bgSunken }}>
                <View style={{ position: 'absolute', left: '20%', right: '20%', top: 0, bottom: 0, borderRadius: 4, backgroundColor: colors.successSoft }} />
                <View
                  style={{
                    position: 'absolute',
                    left: `${pos}%`,
                    top: -3,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: colors.accentPrimary,
                    borderWidth: 2.5,
                    borderColor: colors.bgElevated,
                    transform: [{ translateX: -7 }],
                  }}
                />
              </View>
              <Txt style={{ fontSize: 12, color: colors.textMuted, marginTop: 8, lineHeight: 17 }}>{stat.range}</Txt>
            </View>
            <Banner icon="💛" tone="soft" style={{ marginTop: 12 }}>
              <Txt style={{ fontSize: 12.5, color: colors.textSecondary, lineHeight: 18 }}>{stat.note}</Txt>
            </Banner>
          </Card>
        ) : (
          /* Số mới nhất — cho cân nặng / chiều cao */
          <Card pad={16} style={{ marginBottom: 24, backgroundColor: colors.bgAccentSoft }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <BongFace emotion="blissful" size={56} ring />
              <View>
                <Txt serif style={{ fontSize: 26, fontWeight: '600', color: colors.textPrimary }}>{m.latest}</Txt>
                <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>{m.sub}</Txt>
              </View>
            </View>
          </Card>
        )}

        {/* CHART */}
        <Card pad={14} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: colors.intensity[1], opacity: 0.7 }} />
            <Txt style={{ fontSize: 12.5, color: colors.textSecondary, fontWeight: '600' }}>{m.band}</Txt>
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: colors.accentPrimary }} />
              <Txt style={{ fontSize: 12.5, color: colors.accentPrimary, fontWeight: '600' }}>Bé</Txt>
            </View>
          </View>
          <GrowthChart metric={metric} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, paddingHorizontal: 2 }}>
            <Txt style={{ fontSize: 11.5, color: colors.textMuted, fontWeight: '600' }}>Mới sinh</Txt>
            <Txt style={{ fontSize: 11.5, color: colors.textMuted, fontWeight: '600' }}>Hiện tại · {st.ageLabel}</Txt>
          </View>
        </Card>

        {/* NHẬT KÝ theo tab */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 2 }}>
            <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary }}>Nhật ký {LOG_TITLE[metric]}</Txt>
            <ButtonText onPress={() => ctx.go('history')} style={{ padding: 0 }}>Xem tất cả →</ButtonText>
          </View>
          {dailyLog ? (
            dailyLog.length ? (
              dailyLog.map((g, gi) => (
                <View key={gi} style={{ marginBottom: 12 }}>
                  <Txt style={{ fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginHorizontal: 2, marginBottom: 8 }}>{g.date}</Txt>
                  <Card pad={6}>
                    {g.items.map((it, i) => (
                      <View key={i} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: colors.borderSubtle }}>
                        <ListRow icon={it.icon} title={it.label} right={<Txt style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600' }}>{it.time}</Txt>} />
                      </View>
                    ))}
                  </Card>
                </View>
              ))
            ) : (
              <Card pad={10}>
                <EmptyState
                  size="sm"
                  emotion="snug"
                  onesie="cream"
                  heading="Chưa có ghi chép hôm nay"
                  helper="Cứ thong thả mama 💛 Một chạm là ghi xong."
                  action={<ButtonSecondary onPress={() => ctx.openSheet('quicklog')}>＋ Ghi nhanh</ButtonSecondary>}
                />
              </Card>
            )
          ) : (
            <Card pad={6}>
              {MEASURE_LOG.map((r, i) => (
                <View key={i} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: colors.borderSubtle }}>
                  <ListRow icon="📏" title={r.label} sub={r.date} right={<Ic name="chevron" size={16} color={colors.textMuted} />} />
                </View>
              ))}
            </Card>
          )}
        </View>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ButtonPrimary onPress={() => (isMeasure ? ctx.go('measure') : ctx.openSheet('quicklog'))}>
          {isMeasure ? '+ Thêm đo lường' : '+ Ghi nhanh'}
        </ButtonPrimary>
      </View>
    </ScrollView>
  );
}

/* ---- SCREEN 6 Add Measurement ---- */
function Petal({ index }: { index: number }) {
  const { colors } = useTheme();
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: 1000 + (index % 5) * 200,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [t, index]);
  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-10, 720] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${index % 2 ? 360 : -360}deg`] });
  const opacity = t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
  const petalColors = [colors.warning, colors.accentPrimary, colors.success];
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: `${(index * 7 + 5) % 95}%`,
        top: 0,
        transform: [{ translateY }, { rotate }],
        opacity,
      }}
    >
      <Flower size={14 + (index % 3) * 6} color={petalColors[index % 3]} />
    </Animated.View>
  );
}

export function MeasureScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [hd, setHd] = useState('');
  const [petals, setPetals] = useState(false);
  const save = () => {
    setPetals(true);
    setTimeout(() => {
      ctx.back();
      ctx.toast('Đã lưu. Bé đang phát triển khoẻ mạnh 💚');
    }, 900);
  };
  const dashedBtn = {
    flex: 1,
    height: 80,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed' as const,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSunken,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: 5,
  };
  return (
    <View style={{ flex: 1, overflow: 'hidden' }}>
      <AppBar title="Thêm đo lường" onBack={ctx.back} />
      {petals ? (
        <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <Petal key={i} index={i} />
          ))}
        </View>
      ) : null}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 44, flexGrow: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <Bong emotion="happy" onesie="orange" size={100} float />
        </View>
        <View style={{ gap: 14 }}>
          <Input
            label="Ngày đo"
            value={'Hôm nay · ' + todayVN()}
            onChange={() => {}}
            editable={false}
            rightSlot={<Ic name="cal" size={20} color={colors.textMuted} />}
          />
          <Input label="Cân nặng (kg)" type="tel" value={w} onChange={setW} placeholder="6.4" />
          <Input label="Chiều cao (cm)" type="tel" value={h} onChange={setH} placeholder="61" />
          <Input label="Vòng đầu (cm) · không bắt buộc" type="tel" value={hd} onChange={setHd} placeholder="40.2" />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable style={dashedBtn}>
              <Ic name="camera" size={22} color={colors.textMuted} />
              <Txt style={{ fontSize: 12.5, fontWeight: '600', color: colors.textMuted }}>Thêm ảnh</Txt>
            </Pressable>
            <Pressable style={dashedBtn}>
              <Txt style={{ fontSize: 18, color: colors.textMuted }}>✎</Txt>
              <Txt style={{ fontSize: 12.5, fontWeight: '600', color: colors.textMuted }}>Ghi chú</Txt>
            </Pressable>
          </View>
        </View>
        <View style={{ flex: 1, minHeight: 16 }} />
        <ButtonPrimary disabled={!w || !h} onPress={save}>Lưu số đo</ButtonPrimary>
      </ScrollView>
    </View>
  );
}

/* ---- SCREEN 7 Log History ---- */
export function HistoryScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const [filter, setFilter] = useState('all');
  const chips: [string, string][] = [
    ['all', 'Tất cả'],
    ['feed', 'Cữ ăn'],
    ['sleep', 'Giấc ngủ'],
    ['diaper', 'Tã'],
    ['mood', 'Cảm xúc'],
  ];
  const groups = (ctx.empty ? [] : D.LOG_HISTORY).map((g) => ({ ...g, items: g.items.filter((it) => filter === 'all' || it.type === filter) })).filter((g) => g.items.length);
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Nhật ký của bé" onBack={ctx.back} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 14 }} style={{ flexGrow: 0 }}>
        {chips.map(([id, label]) => (
          <Chip key={id} active={filter === id} onPress={() => setFilter(id)}>{label}</Chip>
        ))}
      </ScrollView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {groups.length === 0 ? (
          <EmptyState emotion="snug" onesie="cream" heading="Chưa có ghi chép nào" helper="Cứ thong thả mama 💛 Mọi khoảnh khắc sẽ được lưu ở đây." />
        ) : (
          groups.map((g, gi) => (
            <View key={gi} style={{ marginBottom: 24 }}>
              <Txt style={{ fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginTop: 4, marginBottom: 8, marginHorizontal: 2, letterSpacing: 0.3 }}>{g.date}</Txt>
              <Card pad={6}>
                {g.items.map((it, i) => (
                  <View key={i} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: colors.borderSubtle }}>
                    <ListRow icon={it.icon} title={it.label} right={<Txt style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600' }}>{it.time}</Txt>} />
                  </View>
                ))}
              </Card>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* ---- SCREEN 8 Library ---- */
function resolveColorKey(colors: ReturnType<typeof useTheme>['colors'], key: string): string {
  switch (key) {
    case 'intensity1':
      return colors.intensity[1];
    case 'intensity2':
      return colors.intensity[2];
    case 'intensity3':
      return colors.intensity[3];
    case 'intensity4':
      return colors.intensity[4];
    case 'intensity5':
      return colors.intensity[5];
    case 'accentSoftBg':
      return colors.accentSoftBg;
    default:
      return colors.bgSunken;
  }
}

interface Article {
  tag: string;
  title: string;
  mins: number;
  locked: boolean;
}

const FEATURED = { tag: 'LEAP 4', title: 'Vì sao bé bám mẹ hơn trong Leap 4', mins: 4 };

export function LibraryScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [tab, setTab] = useState('leap');
  const [art, setArt] = useState<Article | null>(null);
  const openArt = (a: { tag: string; title: string; mins: number }, locked: boolean) =>
    setArt({ tag: a.tag, title: a.title, mins: a.mins, locked });
  const chips: [string, string][] = [
    ['leap', 'Theo Leap'],
    ['age', 'Theo Tuổi'],
    ['saved', 'Đã lưu'],
    ['all', 'Tất cả'],
  ];
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Thư viện" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {/* Hero card */}
        <Pressable
          onPress={() => openArt(FEATURED, false)}
          style={{ borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.accentPrimary, padding: 20, marginBottom: 24 }}
        >
          <FlowerField items={[{ x: 250, y: -6, s: 60, c: 'rgba(255,255,255,0.18)', r: 10 }, { x: 300, y: 90, s: 40, c: 'rgba(255,255,255,0.14)' }]} />
          <View>
            <Txt style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 1.2, color: colors.textOnAccent, opacity: 0.85 }}>CHO TUẦN NÀY CỦA BẠN</Txt>
            <Txt serif style={{ fontSize: 23, fontWeight: '600', color: colors.textOnAccent, marginTop: 8, lineHeight: 29, maxWidth: 240 }}>Vì sao bé bám mẹ hơn trong Leap 4</Txt>
            <Txt style={{ fontSize: 13, color: colors.textOnAccent, opacity: 0.9, marginTop: 10 }}>4 phút đọc · dành cho mama</Txt>
          </View>
        </Pressable>
        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} style={{ flexGrow: 0, marginBottom: 20 }}>
          {chips.map(([id, l]) => (
            <Chip key={id} active={tab === id} onPress={() => setTab(id)}>{l}</Chip>
          ))}
        </ScrollView>
        {tab === 'saved' ? (
          <EmptyState emotion="happy" onesie="sage" heading="Chưa lưu bài nào" helper="Chạm ♥ ở bài viết để đọc lại sau nhé mama." />
        ) : (
          <View style={{ gap: 12 }}>
            {D.LIBRARY.map((a, i) => {
              const locked = i >= 3 && !ctx.premium;
              return (
                <Card key={i} pad={0} style={{ overflow: 'hidden' }} onPress={() => openArt(a, locked)}>
                  <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
                    <View style={{ width: 84, backgroundColor: resolveColorKey(colors, a.colorKey), alignItems: 'center', justifyContent: 'center' }}>
                      <Flower size={34} color="rgba(255,255,255,0.5)" />
                      {locked ? (
                        <View style={{ position: 'absolute', top: 6, right: 6 }}>
                          <Ic name="lock" size={15} color={colors.textPrimary} />
                        </View>
                      ) : null}
                    </View>
                    <View style={{ flex: 1, paddingVertical: 13, paddingHorizontal: 14 }}>
                      <Txt style={{ fontSize: 10.5, fontWeight: '700', letterSpacing: 0.8, color: colors.accentPrimary }}>{a.tag}</Txt>
                      <Txt style={{ fontSize: 14.5, fontWeight: '600', color: colors.textPrimary, marginTop: 5, lineHeight: 20 }}>{a.title}</Txt>
                      <Txt style={{ fontSize: 12, color: colors.textMuted, marginTop: 6 }}>{a.mins} phút đọc</Txt>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* ---- Article reader sheet ---- */}
      <Sheet open={!!art} onClose={() => setArt(null)} height="82%" title={art ? art.title : ''} sub={art ? `${art.tag} · ${art.mins} phút đọc` : ''}>
        {art ? (
          <View style={{ gap: 14, paddingTop: 4 }}>
            <Txt style={{ fontSize: 14.5, lineHeight: 25, color: colors.textPrimary }}>
              Tuần này, não bé đang mở ra một cách nhìn thế giới hoàn toàn mới. Những điều quen thuộc bỗng trở nên lạ lẫm — và người duy nhất con thấy an toàn lúc này chính là mẹ.
            </Txt>
            <Txt style={{ fontSize: 14.5, lineHeight: 25, color: colors.textPrimary }}>
              Đó là lý do bé bám mẹ hơn, khóc khi mẹ rời phòng, và đòi bế nhiều hơn hẳn. Đây không phải thói quen xấu — đây là nhu cầu thật của một bộ não đang lớn rất nhanh.
            </Txt>
            {art.locked ? (
              <Card pad={16} style={{ backgroundColor: colors.bgAccentSoft, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.accentPrimary }}>
                <Txt style={{ fontSize: 14, lineHeight: 22, color: colors.textPrimary, marginBottom: 12 }}>
                  Đọc đầy đủ bài này và toàn bộ thư viện — Muby Premium 199.000đ trọn đời 💛
                </Txt>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <ButtonPrimary
                    full={false}
                    onPress={() => {
                      setArt(null);
                      ctx.openPaywall('Mở khóa toàn bộ thư viện');
                    }}
                    style={{ flex: 1, minHeight: 48 }}
                  >
                    Mở khóa
                  </ButtonPrimary>
                  <ButtonSecondary full={false} onPress={() => setArt(null)} style={{ flex: 1, minHeight: 48 }}>
                    Để sau
                  </ButtonSecondary>
                </View>
              </Card>
            ) : (
              <>
                <Txt style={{ fontSize: 14.5, lineHeight: 25, color: colors.textPrimary }}>
                  Điều mẹ có thể làm: giữ nhịp sinh hoạt quen thuộc, ôm con nhiều hơn, và nhớ rằng giai đoạn này sẽ qua. Sau mỗi leap, bé lại biết thêm một kỹ năng mới — và nụ cười của con sẽ cho mẹ biết ngay.
                </Txt>
                <Banner icon="💛" tone="soft">
                  Mẹo nhỏ: đọc xong bài này, thử ôm con thêm 5 phút trước giờ ngủ — cả hai mẹ con đều sẽ dễ chịu hơn.
                </Banner>
              </>
            )}
          </View>
        ) : null}
      </Sheet>
    </View>
  );
}
