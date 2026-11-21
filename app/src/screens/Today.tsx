/* ============================================================
   SCREEN 1 - TODAY (Home) - Muby UI v2.0 (Peachy)
   Figma: B1 (đang Leap) · B2 (tuần nắng) · E4/E5 (trống / lỗi).
   Day header + white hero (leap progress + 7-day forecast),
   "Bống nhận thấy", today's stats, symptoms, actions, recent logs.
   ============================================================ */
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonSecondary,
  ButtonTonal,
  Card,
  Chip,
  EmptyState,
  HeroCard,
  Ic,
  IconTile,
  InsightCard,
  IntensityBadge,
  NAV_CLEARANCE,
  ScreenGlow,
  SectionHeader,
  SkeletonCard,
  StatTile,
} from '../components';
import type { IconName, TileTone } from '../components';
import * as D from '../data/sampleData';
import { Bong, BongFace, INTENSITY_BONG } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { BabyAvatar, ForecastStrip } from './shared';
import { ActiveTimerPill, StatusStrip } from './care';
import { ago, clock } from '../state/care';

let _todayLoaded = false;

const DOW = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const greeting = () => {
  const h = new Date().getHours();
  return h < 11 ? 'Chào buổi sáng, mama 💛' : h < 18 ? 'Chào buổi chiều, mama 💛' : 'Chào buổi tối, mama 💛';
};
const ddmm = (d: Date) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

const LOG_TONE: Record<string, [TileTone, IconName]> = {
  feed: ['feed', 'bottle'],
  sleep: ['sleep', 'moon'],
  diaper: ['diaper', 'diaper'],
  mood: ['brand', 'heart'],
  milestone: ['ai', 'sparkle'],
};

/* ---- Header: avatar · greeting · bell / "Thứ Năm của Bống" ---- */
function TodayHeader() {
  const { colors, shadows } = useTheme();
  const ctx = useApp();
  const { state, displayName } = useBaby();
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 8, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={() => ctx.go('me')} accessibilityLabel="Trang của mama">
          <BabyAvatar size={44} />
        </Pressable>
        <Txt style={{ flex: 1, fontSize: 13, fontWeight: '500', color: colors.textSecondary }}>{greeting()}</Txt>
        <Pressable
          onPress={() => ctx.go('notifications')}
          accessibilityLabel="Thông báo"
          style={[{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }, shadows[3]]}
        >
          <Ic name="bell" size={22} color={colors.textPrimary} />
          <View style={{ position: 'absolute', top: 8, right: 9, width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accentPrimary, borderWidth: 2, borderColor: colors.bgElevated }} />
        </Pressable>
      </View>
      <View>
        <Txt serif style={{ fontSize: 34, lineHeight: 41, color: colors.textPrimary }}>
          {DOW[new Date().getDay()]} của {displayName}
        </Txt>
        <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{displayName} · {state.ageLabel}</Txt>
      </View>
    </View>
  );
}

/* ---- Leap progress bar (Peachy "Next nap" timeline) ---- */
function LeapProgress({ day, total }: { day: number; total: number }) {
  const { colors } = useTheme();
  const pct = Math.max(0.04, Math.min(1, day / total));
  const start = new Date();
  start.setDate(start.getDate() - (day - 1));
  const end = new Date(start);
  end.setDate(end.getDate() + total - 1);
  return (
    <View style={{ gap: 8 }}>
      <View style={{ height: 14, borderRadius: 7, backgroundColor: colors.bgSunken, justifyContent: 'center' }}>
        <View style={{ width: `${pct * 100}%`, height: 14, borderRadius: 7, overflow: 'hidden' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, backgroundColor: colors.accentSoftBg }} />
            <View style={{ flex: 1, backgroundColor: colors.accentPrimary, opacity: 0.55 }} />
            <View style={{ flex: 1, backgroundColor: colors.accentPrimary }} />
          </View>
        </View>
        <View style={{ position: 'absolute', left: `${pct * 100}%`, marginLeft: -1.5, top: -4, width: 3, height: 22, borderRadius: 2, backgroundColor: colors.textPrimary }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Txt style={{ fontSize: 11, fontWeight: '500', color: colors.textSecondary }}>Bắt đầu {ddmm(start)}</Txt>
        <Txt style={{ fontSize: 11, fontWeight: '600', color: colors.textPrimary }}>Hôm nay</Txt>
        <Txt style={{ fontSize: 11, fontWeight: '500', color: colors.textSecondary }}>~{ddmm(end)}</Txt>
      </View>
    </View>
  );
}

/* ---- Sunny: "Hôm nay của bé" - rotating daily card (fact / game / photo) ---- */
export function TodayOfBabyCard() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  const d = state.sunny.daily;
  return (
    <View>
      <SectionHeader title="Hôm nay của bé" />
      <Card>
        <Txt style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: colors.textBrand, marginBottom: 8, textTransform: 'uppercase' }}>{d.label}</Txt>
        <Txt style={{ fontSize: 17, lineHeight: 24, color: colors.textPrimary }}>{d.text}</Txt>
        {d.action ? (
          <ButtonTonal onPress={() => ctx.toast('Đã lưu vào Khoảnh khắc 🎉')} style={{ marginTop: 12 }}>
            {`📸  ${d.action}`}
          </ButtonTonal>
        ) : null}
      </Card>
    </View>
  );
}

/* ---- Sunny: "Kỹ năng đang nở" - blossoming skills + milestone button ---- */
const BLOOM_CARD_W = 256;
const CARD_GAP = 12;

export function BloomSection() {
  const { colors, radii, shadows } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  const S = state.sunny;
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  if (!S.bloom.length) return null;
  return (
    <View>
      <SectionHeader title={`Kỹ năng đang nở 🌱`} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={BLOOM_CARD_W + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: 20, paddingBottom: 12, paddingTop: 2 }}
      >
        {S.bloom.map((b, i) => (
          <View key={i} style={[{ width: BLOOM_CARD_W, borderRadius: radii.lg, backgroundColor: colors.bgElevated, padding: 16, gap: 8 }, shadows[2]]}>
            <Txt style={{ fontSize: 17, fontWeight: '600', lineHeight: 22 }}>{b.sign}</Txt>
            <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18, flex: 1 }}>{b.game}</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <ButtonTonal
                disabled={!!saved[i]}
                onPress={() => {
                  setSaved((x) => ({ ...x, [i]: true }));
                  ctx.toast(`Đã ghi nhận: con ${b.skill} 🎉`);
                }}
              >
                {saved[i] ? '✓ Đã lưu vào Nhật ký' : '🎉 Con làm được rồi!'}
              </ButtonTonal>
              {!ctx.premium ? (
                <Pressable onPress={() => ctx.openPaywall('Mở khóa hướng dẫn từng bước')} hitSlop={6}>
                  <Txt style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary }}>Từng bước →</Txt>
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---- "Chuẩn bị cho Leap {n+1}" - pre-leap prep card ---- */
export function PrepCard() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  const S = state.sunny;
  if (!S.prep || !S.nextLeap) return null;
  return (
    <View style={{ padding: 20, gap: 10, borderRadius: radii.lg, backgroundColor: colors.bgAccentSoft }}>
      <Txt style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: colors.textBrand }}>☁️  CHUẨN BỊ CHO LEAP {S.nextLeap.n}</Txt>
      <Txt style={{ fontSize: 15, lineHeight: 20, color: colors.textPrimary }}>
        Leap {S.nextLeap.n} sắp đến (dự kiến ngày {S.nextDate}). Vài dấu hiệu sớm:{' '}
        <Txt style={{ fontWeight: '600' }}>{S.prep.signs.join(', ')}</Txt>.
      </Txt>
      {S.prep.tips.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
          <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>·</Txt>
          <Txt style={{ flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>{t}</Txt>
        </View>
      ))}
      <Pressable onPress={() => ctx.go('leapdetail')} hitSlop={6}>
        <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand }}>Đọc trước về Leap {S.nextLeap.n} →</Txt>
      </Pressable>
    </View>
  );
}

/* ---- Post-leap premium moment (one-time, dismissible, never at intensity ≥ 4) ---- */
export function PostLeapCard({ onDismiss }: { onDismiss: () => void }) {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state, displayName } = useBaby();
  const S = state.sunny;
  const done = S.refLeap;
  if (!done || ctx.intensity >= 4 || ctx.purchased) return null;
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Bong emotion="blissful" onesie="sage" size={60} />
        <View style={{ flex: 1, gap: 6 }}>
          <Txt style={{ fontSize: 15, fontWeight: '600', lineHeight: 20 }}>
            Leap {done.n} đã qua rồi 🌼 Mama và {displayName} đã cùng nhau vượt qua.
          </Txt>
          <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
            {S.nextLeap
              ? `Leap ${S.nextLeap.n} sẽ đến trong khoảng ${Math.max(1, Math.round((S.daysToNext || 7) / 7))} tuần nữa. Mở khóa toàn bộ 10 leap để luôn sẵn sàng nhé.`
              : 'Mở khóa toàn bộ 10 leap để luôn sẵn sàng nhé.'}
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 }}>
            <ButtonTonal onPress={() => ctx.openPaywall('Luôn sẵn sàng cho leap tiếp theo')}>Xem Muby Premium</ButtonTonal>
            <Pressable onPress={onDismiss} hitSlop={6}>
              <Txt style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary }}>Để sau</Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );
}

export function TodayScreen() {
  const { colors, radii, shadows } = useTheme();
  const ctx = useApp();
  const { intensity, empty } = ctx;
  const { state: st, displayName, error: babyError, reload: reloadBaby } = useBaby();
  const CURRENT_LEAP = st.leap;
  const inLeap = st.status === 'in-leap';
  const PHASE = D.leapPhase(Math.max(1, st.leapDay), st.leapTotal);
  const [loading, setLoading] = useState(!_todayLoaded);
  const [symptomPick, setSymptomPick] = useState<string | null>(null);
  const [postLeapDismissed, setPostLeapDismissed] = useState(false);
  // sunny mode: calm days - the home screen turns to celebration + prep
  const sunny = intensity <= 2 && st.status !== 'after-all';
  const S = st.sunny;
  const C = D.INTENSITY_COPY[intensity];
  const faceEmotion = INTENSITY_BONG[Math.min(5, Math.max(1, intensity))].emotion;

  useEffect(() => {
    if (_todayLoaded) return;
    const t = setTimeout(() => { _todayLoaded = true; setLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <ScreenGlow />
        <TodayHeader />
        <View style={{ paddingTop: 20, paddingHorizontal: 20, gap: 20 }}>
          <SkeletonCard h={300} />
          <SkeletonCard h={110} />
          <SkeletonCard h={140} />
        </View>
      </View>
    );
  }

  /* Stored profile could not be read - Figma E5 */
  if (babyError) {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
        <ScreenGlow />
        <TodayHeader />
        <View style={{ paddingTop: 20, paddingHorizontal: 20, gap: 20 }}>
          <Banner tone="warning" icon="☁️">
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Txt style={{ flex: 1, fontSize: 13, fontWeight: '500', color: colors.textPrimary }}>Không tải được. Thử lại nhé 💛</Txt>
              <Txt onPress={() => { ctx.toast('Đang tải lại…'); reloadBaby(); }} style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand }}>
                Thử lại
              </Txt>
            </View>
          </Banner>
          <View style={{ opacity: 0.55 }}>
            <HeroCard>
              <Txt style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: colors.textSecondary }}>BẢN LƯU GẦN NHẤT</Txt>
              <Txt serif style={{ fontSize: 22, lineHeight: 28, marginTop: 8, color: colors.textPrimary }}>
                {inLeap ? `Bé đang ở ${PHASE.name} của Leap ${CURRENT_LEAP.n}` : `Bé đang giữa hai leap - Leap ${CURRENT_LEAP.n} sắp tới`}
              </Txt>
            </HeroCard>
          </View>
        </View>
      </ScrollView>
    );
  }

  /* First day, nothing logged - Figma E4 */
  if (empty) {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
        <ScreenGlow />
        <TodayHeader />
        <EmptyState
          emotion="snug"
          onesie="lavender"
          heading="Chưa có gì hôm nay"
          helper="Cứ thong thả mama 💛 Khi nào sẵn sàng, mình ghi lại khoảnh khắc đầu tiên nhé."
          action={<ButtonPrimary full={false} style={{ alignSelf: 'center' }} onPress={() => ctx.openSheet('quicklog')}>Ghi nhanh</ButtonPrimary>}
        />
      </ScrollView>
    );
  }

  const sp = CURRENT_LEAP.sunnyPlay[0];
  const todoItem: { emoji: string; title: string; why?: string; what: string; hasSound?: boolean } | null = sunny
    ? sp ? { emoji: '🌼', title: sp.title, what: sp.desc } : null
    : CURRENT_LEAP.actions[0] ?? null;
  const recent = ctx.logs.length
    ? ctx.logs.slice(0, 2).map((l) => ({ type: l.type, label: l.label, detail: l.detail, time: clock(l.at), ago: ago(l.endAt ?? l.at) }))
    : D.RECENT_LOGS.slice(0, 2);
  const insightEyebrow = sunny
    ? 'Bống nhận thấy · tuần nắng'
    : inLeap
      ? `Bống nhận thấy · ${PHASE.name}`
      : `Bống nhận thấy · Leap ${CURRENT_LEAP.n}`;
  const insightBody = sunny ? C.copy : inLeap ? PHASE.desc : `Leap ${CURRENT_LEAP.n} · ${CURRENT_LEAP.world} sắp đến - tranh thủ nghỉ ngơi và chơi cùng con nhé.`;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
        <ScreenGlow />
        <TodayHeader />
        <View style={{ paddingTop: 20, paddingHorizontal: 20, gap: 28 }}>
          {/* ===== LIVE STATUS + RUNNING TIMER (MVP v2.1) ===== */}
          <View style={{ gap: 10 }}>
            <StatusStrip />
            <ActiveTimerPill />
          </View>

          {/* ===== HERO - white card: leap status + progress + 7 days ===== */}
          <HeroCard>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
                {sunny ? (
                  <>
                    <IntensityBadge level={intensity} size="sm" />
                    <Txt serif style={{ fontSize: 22, lineHeight: 28, color: colors.textPrimary }}>Tuần nắng của {displayName} 🌼</Txt>
                    {S.nextLeap && S.daysToNext != null ? (
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                        <Txt style={{ fontSize: 28, lineHeight: 34, fontWeight: '600', letterSpacing: -0.3 }}>còn {S.daysToNext} ngày</Txt>
                        <Txt style={{ fontSize: 15, fontWeight: '500', color: colors.textSecondary }}>tới Leap {S.nextLeap.n}</Txt>
                      </View>
                    ) : null}
                  </>
                ) : inLeap ? (
                  <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <Txt style={{ fontSize: 15, fontWeight: '500', color: colors.textSecondary }}>Leap {CURRENT_LEAP.n}</Txt>
                      <IntensityBadge level={intensity} size="sm" />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
                      <Txt style={{ fontSize: 40, lineHeight: 44, fontWeight: '600', letterSpacing: -0.8 }}>Ngày {st.leapDay}</Txt>
                      <Txt style={{ fontSize: 17, fontWeight: '600', color: colors.textSecondary }}>/ {st.leapTotal}</Txt>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ic name="cloud" size={16} color={colors.textBrand} />
                      <Txt style={{ flex: 1, fontSize: 13, fontWeight: '500', color: colors.textBrand }}>
                        {PHASE.name[0].toUpperCase() + PHASE.name.slice(1)} · còn khoảng {st.leapTotal - st.leapDay} ngày
                      </Txt>
                    </View>
                  </>
                ) : (
                  <>
                    <IntensityBadge level={intensity} size="sm" />
                    <Txt serif style={{ fontSize: 22, lineHeight: 28, color: colors.textPrimary }}>
                      {st.status === 'after-all' ? 'Bé đã đi qua 10 leaps kỳ diệu' : `Leap ${CURRENT_LEAP.n} · ${CURRENT_LEAP.world}`}
                    </Txt>
                    <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
                      {st.status === 'after-all'
                        ? 'Hành trình Wonder Weeks đã trọn vẹn.'
                        : `Dự kiến bắt đầu trong ~${st.daysUntilLeap} ngày.`}
                    </Txt>
                  </>
                )}
              </View>
              <View style={{ width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: sunny ? colors.successSoft : colors.bgAccentSoft }}>
                <BongFace emotion={faceEmotion} size={54} />
              </View>
            </View>

            {inLeap && !sunny ? (
              <View style={{ marginTop: 16 }}>
                <LeapProgress day={st.leapDay} total={st.leapTotal} />
              </View>
            ) : null}
            {sunny && S.nextLeap ? (
              <View style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: radii.md, backgroundColor: colors.warningSoft }}>
                <Ic name="sun" size={16} color={colors.warning} />
                <Txt style={{ flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 18 }}>
                  Leap {S.nextLeap.n} dự kiến bắt đầu ngày {S.nextDate} - tranh thủ chơi cùng con nhé
                </Txt>
              </View>
            ) : null}
            {intensity >= 4 ? (
              <ButtonTonal onPress={() => ctx.openSheet('soothing')} style={{ marginTop: 14 }}>🎵  Bật tiếng ồn trắng</ButtonTonal>
            ) : null}

            <View style={{ height: 1, backgroundColor: colors.borderDefault, marginVertical: 16 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Txt style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>7 ngày tới</Txt>
              <Pressable onPress={() => ctx.setTab('leap')} hitSlop={8}>
                <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand }}>Xem chi tiết</Txt>
              </Pressable>
            </View>
            <ForecastStrip data={st.forecast} onPick={() => ctx.setTab('leap')} />
          </HeroCard>

          {/* ===== ALL-LEAPS-DONE celebration ===== */}
          {st.status === 'after-all' ? (
            <Card pad={10}>
              <EmptyState
                size="sm"
                emotion="blissful"
                onesie="sage"
                heading="10 leaps đã trọn vẹn 🎉"
                helper="Bé đã đi qua mọi tuần kỳ diệu. Giờ mình cùng dõi theo bé lớn lên mỗi ngày nhé."
                action={<ButtonSecondary onPress={() => ctx.setTab('growth')}>Xem bé lớn lên</ButtonSecondary>}
              />
            </Card>
          ) : null}

          {/* ===== HÔM NAY ĐẾN GIỜ - stat tiles ===== */}
          <View>
            <SectionHeader title="Hôm nay đến giờ" link="Xem tất cả" onLink={() => ctx.setTab('growth')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 12, paddingTop: 2 }}>
              {st.dailyStats.map((d) => {
                const [tone, icon] = LOG_TONE[d.id] || ['neutral', 'more'];
                return <StatTile key={d.id} tone={tone} icon={icon} label={d.label} value={d.value} sub={d.range} />;
              })}
            </ScrollView>
          </View>

          {/* ===== VIỆC NÊN LÀM HÔM NAY - one card, the rest lives in Leap ===== */}
          {st.status !== 'after-all' && todoItem ? (
            <View>
              <SectionHeader title="Việc nên làm hôm nay" link="Thêm ở Leap" onLink={() => ctx.setTab('leap')} />
              <View style={[{ padding: 20, gap: 12, borderRadius: radii.lg, backgroundColor: colors.bgElevated }, shadows[2]]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <IconTile tone={sunny ? 'growth' : 'brand'} emoji={todoItem.emoji} />
                  <Txt style={{ flex: 1, fontSize: 17, fontWeight: '600', lineHeight: 22 }}>{todoItem.title}</Txt>
                </View>
                {todoItem.why ? <Txt style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 20 }}>Vì sao? {todoItem.why}</Txt> : null}
                <View style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.md, backgroundColor: colors.bgAccentSoft }}>
                  <Txt style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 18 }}>
                    <Txt style={{ fontWeight: '600' }}>Nên làm: </Txt>
                    {todoItem.what}
                  </Txt>
                </View>
                {todoItem.hasSound ? <ButtonTonal onPress={() => ctx.openSheet('soothing')}>🎵  Bật tiếng ồn trắng</ButtonTonal> : null}
              </View>
            </View>
          ) : null}

          {/* ===== VỪA GHI ===== */}
          <View>
            <SectionHeader title="Vừa ghi" link="Xem tất cả" onLink={() => ctx.go('history')} />
            <View style={{ gap: 12 }}>
              {recent.map((l, i) => {
                const [tone, icon] = LOG_TONE[l.type] || ['neutral', 'more'];
                return (
                  <Card key={i} pad={16}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <IconTile tone={tone} icon={icon} />
                      <View style={{ flex: 1 }}>
                        <Txt style={{ fontSize: 15, fontWeight: '600' }}>{l.label} · {l.detail}</Txt>
                        <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{l.ago}</Txt>
                      </View>
                      <Txt style={{ fontSize: 15, fontWeight: '600' }}>{l.time}</Txt>
                    </View>
                  </Card>
                );
              })}
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

/* ============================================================
   EASY SCREEN - full explanation (stack) - Figma B6
   ============================================================ */
const EASY_STEPS: { k: string; name: string; tone: TileTone; icon: IconName; desc: string }[] = [
  { k: 'E', name: 'Ăn', tone: 'feed', icon: 'bottle', desc: 'Bé thức dậy là được ăn ngay. Bú lúc tỉnh táo giúp bé ăn no hơn, không ngủ quên giữa cữ.' },
  { k: 'A', name: 'Chơi', tone: 'growth', icon: 'sun', desc: 'Sau ăn là lúc bé tỉnh táo nhất: tummy time, nói chuyện, nhìn ngắm. Với bé 3-4 tháng, 60-90 phút thức là vừa đủ.' },
  { k: 'S', name: 'Ngủ', tone: 'sleep', icon: 'moon', desc: 'Thấy bé dụi mắt, ngáp, quay mặt đi - đó là tín hiệu buồn ngủ. Đặt bé xuống khi lim dim, bé sẽ học tự vào giấc.' },
  { k: 'Y', name: 'Của mama', tone: 'brand', icon: 'heart', desc: 'Bé ngủ = giờ của bạn. Nghỉ ngơi, ăn uống, hay đơn giản là ngồi yên một chút. Chăm mình cũng là chăm con.' },
];

export function EasyScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const { state: st } = useBaby();
  const info = D.EASY_INFO;
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Phương pháp EASY" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 48, gap: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }}>
            <BongFace emotion="snug" size={54} />
          </View>
          <Txt style={{ flex: 1, fontSize: 15, color: colors.textSecondary, lineHeight: 20 }}>
            Trong Leap {st.leap.n}, thế giới của bé đang thay đổi - một nhịp <Txt style={{ color: colors.textPrimary, fontWeight: '600' }}>quen thuộc</Txt> giúp con đoán được điều gì đến tiếp theo, nên bớt bất an hơn.
          </Txt>
        </View>

        <View style={{ padding: 20, gap: 10, borderRadius: radii.lg, backgroundColor: colors.bgAccentSoft }}>
          <Txt style={{ fontSize: 12, fontWeight: '600', letterSpacing: 1, color: colors.textBrand }}>EASY GIÚP GÌ TRONG LEAP {st.leap.n}?</Txt>
          {([
            ['🍼', 'Bé có thể bú ít mỗi cữ nhưng đòi ăn nhiều lần - cứ theo nhịp E, không ép đủ lượng.'],
            ['🌙', 'Trong leap bé dễ mệt sớm - đặt ngủ sớm hơn 30 phút so với lịch quen.'],
            ['✨', 'Giữ nguyên trình tự Ăn → Chơi → Ngủ - sự quen thuộc chính là điểm tựa của con lúc này.'],
          ] as [string, string][]).map(([e, t], i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
              <Txt style={{ fontSize: 13, lineHeight: 18 }}>{e}</Txt>
              <Txt style={{ flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 18 }}>{t}</Txt>
            </View>
          ))}
        </View>

        <Card pad={16} style={{ paddingVertical: 4 }}>
          {EASY_STEPS.map((s, i) => (
            <View key={s.k} style={{ flexDirection: 'row', gap: 12, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.borderSubtle }}>
              <IconTile tone={s.tone} icon={s.icon} />
              <View style={{ flex: 1 }}>
                <Txt style={{ fontSize: 15, fontWeight: '600' }}>{s.k} · {s.name}</Txt>
                <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginTop: 2 }}>{s.desc}</Txt>
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <View style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm, backgroundColor: colors.successSoft, marginBottom: 8 }}>
            <Txt style={{ fontSize: 13, fontWeight: '500', color: colors.success }}>{st.easyVariant} · bé {st.ageLabel}</Txt>
          </View>
          <Txt style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 20 }}>{st.easyDetail}</Txt>
        </Card>

        <Banner icon="☁️" tone="sunken">{info.note}</Banner>

        <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18, textAlign: 'center' }}>
          EASY là khung tham khảo, không phải lịch cứng.{'\n'}Bé của bạn luôn là người dẫn nhịp 💛
        </Txt>
      </ScrollView>
    </View>
  );
}
