/* ============================================================
   SCREEN 5 Growth · 6 Add Measurement · 7 Log History · 8 Library
   Ported from project/screens/growth.jsx to React Native.
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Line, Path, Polygon, Polyline } from 'react-native-svg';
import {
  AppBar,
  ButtonPrimary,
  Card,
  Chip,
  EmptyState,
  Flower,
  FlowerField,
  Ic,
  Input,
  ListRow,
  SubTabs,
} from '../components';
import * as D from '../data/sampleData';
import { Bong, BongFace } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

type Metric = 'weight' | 'height' | 'head';

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
    head: { lo: [33, 35.5, 37, 38.5, 39.5, 40.3, 41], hi: [36, 38.5, 40, 41.5, 42.5, 43.3, 44], user: [34, 36.5, 38, 39.2, 39.8, 40.2], unit: 'cm', max: 45, min: 32 },
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

export function GrowthScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const [metric, setMetric] = useState<Metric>('weight');
  const { BABY } = D;
  const latest: Record<Metric, string> = { weight: `${BABY.weight} kg`, height: `${BABY.height} cm`, head: `${BABY.head} cm` };
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
      <View style={{ paddingTop: 6, paddingHorizontal: 20 }}>
        <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, marginBottom: 14 }}>Bé lớn lên</Txt>
        <SubTabs<Metric>
          tabs={[
            { id: 'weight', label: 'Cân nặng' },
            { id: 'height', label: 'Chiều cao' },
            { id: 'head', label: 'Vòng đầu' },
          ]}
          value={metric}
          onChange={setMetric}
          style={{ marginBottom: 16 }}
        />
        <Card pad={14} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: colors.intensity[1], opacity: 0.7 }} />
            <Txt style={{ fontSize: 12.5, color: colors.textSecondary, fontWeight: '600' }}>Vùng khoẻ mạnh theo WHO</Txt>
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 16, height: 3, borderRadius: 2, backgroundColor: colors.accentPrimary }} />
              <Txt style={{ fontSize: 12.5, color: colors.accentPrimary, fontWeight: '600' }}>Bé</Txt>
            </View>
          </View>
          <GrowthChart metric={metric} />
        </Card>
        <Card pad={16} style={{ marginBottom: 24, backgroundColor: colors.bgAccentSoft }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <BongFace emotion="blissful" size={56} ring />
            <View>
              <Txt serif style={{ fontSize: 26, fontWeight: '600', color: colors.textPrimary }}>{latest[metric]}</Txt>
              <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 2 }}>Bé đang phát triển khoẻ mạnh 💚</Txt>
            </View>
          </View>
        </Card>
      </View>
      <View style={{ paddingHorizontal: 20 }}>
        <ButtonPrimary onPress={() => ctx.go('measure')}>+ Thêm đo lường</ButtonPrimary>
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
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, flexGrow: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <Bong emotion="happy" onesie="orange" size={100} float />
        </View>
        <View style={{ gap: 14 }}>
          <Input
            label="Ngày đo"
            value="Hôm nay · 05/06/2026"
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
  const groups = D.LOG_HISTORY.map((g) => ({ ...g, items: g.items.filter((it) => filter === 'all' || it.type === filter) })).filter((g) => g.items.length);
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Nhật ký của bé" onBack={ctx.back} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 14 }} style={{ flexGrow: 0 }}>
        {chips.map(([id, label]) => (
          <Chip key={id} active={filter === id} onPress={() => setFilter(id)}>{label}</Chip>
        ))}
      </ScrollView>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}>
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

export function LibraryScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [tab, setTab] = useState('leap');
  const chips: [string, string][] = [
    ['leap', 'Theo Leap'],
    ['age', 'Theo Tuổi'],
    ['saved', 'Đã lưu'],
    ['all', 'Tất cả'],
  ];
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Thư viện" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        {/* Hero card */}
        <View style={{ borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.accentPrimary, padding: 20, marginBottom: 24 }}>
          <FlowerField items={[{ x: 250, y: -6, s: 60, c: 'rgba(255,255,255,0.18)', r: 10 }, { x: 300, y: 90, s: 40, c: 'rgba(255,255,255,0.14)' }]} />
          <View>
            <Txt style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 1.2, color: colors.textOnAccent, opacity: 0.85 }}>CHO TUẦN NÀY CỦA BẠN</Txt>
            <Txt serif style={{ fontSize: 23, fontWeight: '600', color: colors.textOnAccent, marginTop: 8, lineHeight: 29, maxWidth: 240 }}>Vì sao bé bám mẹ hơn trong Leap 4</Txt>
            <Txt style={{ fontSize: 13, color: colors.textOnAccent, opacity: 0.9, marginTop: 10 }}>4 phút đọc · dành cho mama</Txt>
          </View>
        </View>
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
                <Card key={i} pad={0} style={{ overflow: 'hidden' }} onPress={locked ? () => ctx.openPaywall('Mở khóa toàn bộ thư viện') : undefined}>
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
    </View>
  );
}
