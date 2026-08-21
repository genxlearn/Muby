/* ============================================================
   SCREEN 1 — TODAY (Home) — Muby App Final
   Compact phase-based hero (+progress +embedded forecast),
   symptoms grid, action carousel, EASY teaser + EasyScreen.
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  Card,
  EmptyState,
  HeroCard,
  Ic,
  Icon3D,
  IntensityBadge,
  NAV_CLEARANCE,
  SkeletonCard,
} from '../components';
import * as D from '../data/sampleData';
import { Bong, BongFace, BongIntensity, Emotion } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { BabyAvatar, EasyEducationCard, ForecastStrip, SymptomSheet } from './shared';

let _todayLoaded = false;

const CARD_W = 284;
const CARD_GAP = 12;

function GreetRow() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Txt style={{ fontSize: 13.5, color: colors.textMuted, fontWeight: '600' }}>Chào buổi sáng, mama 💛</Txt>
        <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, lineHeight: 26, marginTop: 2 }}>{state.ageLabel}</Txt>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={() => ctx.go('notifications')}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderSubtle, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ic name="bell" size={21} color={colors.textSecondary} />
          <View style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentPrimary, borderWidth: 2, borderColor: colors.bgElevated }} />
        </Pressable>
        {/* avatar → Mama profile (stack) */}
        <Pressable onPress={() => ctx.go('me')} accessibilityLabel="Trang của mama">
          <BabyAvatar size={42} />
        </Pressable>
      </View>
    </View>
  );
}

/* faces used by the symptoms grid, cycled per index */
const SYMPTOM_EMO: Emotion[] = ['crying', 'snug', 'sleeping', 'eating', 'uncertain', 'fussy'];

/* ---- Sunny: "Hôm nay của bé" — rotating daily card (fact / game / photo) ---- */
function TodayOfBabyCard() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  const d = state.sunny.daily;
  return (
    <Card pad={16}>
      <Txt style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: colors.accentPrimary, marginBottom: 8 }}>{d.label}</Txt>
      <Txt style={{ fontSize: 15.5, lineHeight: 25, color: colors.textPrimary }}>{d.text}</Txt>
      {d.action ? (
        <Pressable
          onPress={() => ctx.toast('Đã lưu vào Khoảnh khắc 🎉')}
          style={{ marginTop: 12, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.bgAccentSoft }}
        >
          <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.accentPrimary }}>📸 {d.action}</Txt>
        </Pressable>
      ) : null}
    </Card>
  );
}

/* ---- Sunny: "Kỹ năng đang nở" — blossoming skills + milestone button ---- */
const BLOOM_CARD_W = 264;

function BloomSection() {
  const { colors, radii, shadows } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  const S = state.sunny;
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  if (!S.bloom.length) return null;
  return (
    <View>
      <Txt style={{ fontSize: 15.5, fontWeight: '700', marginBottom: 12, paddingHorizontal: 2 }}>Kỹ năng đang nở sau Leap {S.refLeap.n} 🌱</Txt>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={BLOOM_CARD_W + CARD_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: 20, paddingBottom: 10, paddingTop: 4 }}
      >
        {S.bloom.map((b, i) => (
          <View
            key={i}
            style={[
              { width: BLOOM_CARD_W, borderRadius: radii.lg, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderSubtle, padding: 16, gap: 8 },
              shadows[2],
            ]}
          >
            <Txt style={{ fontSize: 14.5, fontWeight: '700', lineHeight: 19 }}>{b.sign}</Txt>
            <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 21, flex: 1 }}>{b.game}</Txt>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
              <Pressable
                disabled={!!saved[i]}
                onPress={() => {
                  setSaved((s) => ({ ...s, [i]: true }));
                  ctx.toast(`Đã lưu khoảnh khắc đầu tiên con ${b.skill} 🎉`);
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 999, backgroundColor: saved[i] ? colors.successSoft : colors.bgAccentSoft }}
              >
                <Txt style={{ fontSize: 13, fontWeight: '700', color: saved[i] ? colors.success : colors.accentPrimary }}>
                  {saved[i] ? '✓ Đã lưu vào Nhật ký' : '🎉 Con làm được rồi!'}
                </Txt>
              </Pressable>
              {!ctx.premium ? (
                <Pressable onPress={() => ctx.openPaywall('Mở khóa hướng dẫn từng bước')} style={{ minHeight: 44, paddingVertical: 10, paddingHorizontal: 4, justifyContent: 'center' }}>
                  <Txt style={{ fontSize: 12.5, fontWeight: '700', color: colors.textMuted }}>Từng bước →</Txt>
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---- "Chuẩn bị cho Leap {n+1}" — pre-leap prep card ---- */
function PrepCard() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state } = useBaby();
  const S = state.sunny;
  if (!S.prep || !S.nextLeap) return null;
  return (
    <Card pad={16} style={{ backgroundColor: colors.bgAccentSoft }}>
      <Txt style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: colors.accentPrimary, marginBottom: 8 }}>☁️ CHUẨN BỊ CHO LEAP {S.nextLeap.n}</Txt>
      <Txt style={{ fontSize: 14.5, lineHeight: 22, color: colors.textPrimary }}>
        Leap {S.nextLeap.n} sắp đến (dự kiến ngày {S.nextDate}). Vài dấu hiệu sớm:{' '}
        <Txt style={{ fontWeight: '700' }}>{S.prep.signs.join(', ')}</Txt>.
      </Txt>
      <View style={{ gap: 8, marginTop: 12 }}>
        {S.prep.tips.map((t, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>·</Txt>
            <Txt style={{ flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>{t}</Txt>
          </View>
        ))}
      </View>
      <Pressable onPress={() => ctx.go('leapdetail')} style={{ marginTop: 12, alignSelf: 'flex-start', minHeight: 44, paddingVertical: 10, paddingHorizontal: 2, justifyContent: 'center' }}>
        <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.accentPrimary }}>Đọc trước về Leap {S.nextLeap.n} →</Txt>
      </Pressable>
    </Card>
  );
}

/* ---- Post-leap premium moment (one-time, dismissible, never at intensity ≥ 4) ---- */
function PostLeapCard({ onDismiss }: { onDismiss: () => void }) {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state, displayName } = useBaby();
  const S = state.sunny;
  const done = S.refLeap;
  if (!done || ctx.intensity >= 4 || ctx.purchased) return null;
  return (
    <Card pad={16}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Bong emotion="blissful" onesie="sage" size={64} />
        <View style={{ flex: 1 }}>
          <Txt style={{ fontSize: 14.5, fontWeight: '700', lineHeight: 20 }}>
            Leap {done.n} đã qua rồi 🌼 Mama và {displayName} đã cùng nhau vượt qua.
          </Txt>
          <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginTop: 6 }}>
            {S.nextLeap
              ? `Leap ${S.nextLeap.n} sẽ đến trong khoảng ${Math.max(1, Math.round((S.daysToNext || 7) / 7))} tuần nữa. Mở khóa toàn bộ 10 leap để luôn sẵn sàng nhé.`
              : 'Mở khóa toàn bộ 10 leap để luôn sẵn sàng nhé.'}
          </Txt>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <Pressable
              onPress={() => ctx.openPaywall('Luôn sẵn sàng cho leap tiếp theo')}
              style={{ minHeight: 44, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.accentPrimary, alignItems: 'center', justifyContent: 'center' }}
            >
              <Txt style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Xem Muby Premium</Txt>
            </Pressable>
            <Pressable onPress={onDismiss} style={{ minHeight: 44, paddingVertical: 10, paddingHorizontal: 12, justifyContent: 'center' }}>
              <Txt style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted }}>Để sau</Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );
}

export function TodayScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const { intensity, empty } = ctx;
  const { state: st, displayName, error: babyError, reload: reloadBaby } = useBaby();
  const CURRENT_LEAP = st.leap;
  const inLeap = st.status === 'in-leap';
  const PHASE = D.leapPhase(Math.max(1, st.leapDay), st.leapTotal);
  const [loading, setLoading] = useState(!_todayLoaded);
  const [symptomPick, setSymptomPick] = useState<string | null>(null);
  const [actionIdx, setActionIdx] = useState(0);
  const [postLeapDismissed, setPostLeapDismissed] = useState(false);
  // sunny mode: calm days — the home screen turns to celebration + prep
  const sunny = intensity <= 2 && st.status !== 'after-all';
  const S = st.sunny;
  const C = D.INTENSITY_COPY[intensity];

  useEffect(() => {
    if (_todayLoaded) return;
    const t = setTimeout(() => { _todayLoaded = true; setLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.min(2, Math.round(e.nativeEvent.contentOffset.x / (CARD_W + CARD_GAP)));
    if (idx !== actionIdx) setActionIdx(idx);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, paddingTop: 4, paddingHorizontal: 20, gap: 24 }}>
        <GreetRow />
        <SkeletonCard h={280} />
        <SkeletonCard h={90} />
        <SkeletonCard h={180} />
      </View>
    );
  }

  /* Stored profile could not be read — keep the last known forecast on screen,
     dimmed, and offer a retry (the design's "BẢN LƯU GẦN NHẤT" state). */
  if (babyError) {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
        <View style={{ paddingTop: 4, paddingHorizontal: 20, gap: 24 }}>
          <GreetRow />
          <Banner icon="☁️">
            <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
              Không tải được. Thử lại nhé 💛{' '}
              <Txt
                onPress={() => { ctx.toast('Đang tải lại…'); reloadBaby(); }}
                style={{ color: colors.accentPrimary, fontWeight: '700' }}
              >
                Thử lại
              </Txt>
            </Txt>
          </Banner>
          <View style={{ opacity: 0.55 }}>
            <HeroCard pad={0}>
              <View style={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: 18 }}>
                <Txt style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: colors.textOnHero, opacity: 0.65 }}>BẢN LƯU GẦN NHẤT</Txt>
                <Txt serif style={{ fontSize: 19, fontWeight: '600', marginTop: 8, color: colors.textOnHero }}>
                  {inLeap
                    ? `Bé đang ở ${PHASE.name} của Leap ${CURRENT_LEAP.n}`
                    : `Bé đang giữa hai leap — Leap ${CURRENT_LEAP.n} sắp tới`}
                </Txt>
              </View>
            </HeroCard>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (empty) {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
        <View style={{ paddingTop: 4, paddingHorizontal: 20 }}>
          <GreetRow />
        </View>
        <EmptyState
          emotion="snug"
          onesie="cream"
          heading="Chưa có gì hôm nay"
          helper="Cứ thong thả mama 💛 Khi nào sẵn sàng, mình ghi lại khoảnh khắc đầu tiên nhé."
          action={<ButtonPrimary onPress={() => ctx.openSheet('quicklog')}>Ghi nhanh</ButtonPrimary>}
        />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
      <View style={{ paddingTop: 4, paddingHorizontal: 20, gap: 24 }}>
        <GreetRow />

        {/* ===== HERO (compact: forecast + phase + progress + 7 days) ===== */}
        <HeroCard pad={0}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingHorizontal: 20 }}>
            <Txt style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1.2, color: colors.textOnHero, opacity: 0.65 }}>DỰ BÁO HÔM NAY</Txt>
            {!sunny ? (
              <Txt style={{ fontSize: 11.5, fontWeight: '600', color: colors.textOnHero, opacity: 0.75 }}>
                {inLeap
                  ? `Ngày ${st.leapDay}/${st.leapTotal} · còn khoảng ${st.leapTotal - st.leapDay} ngày`
                  : st.status === 'after-all'
                    ? 'Đã qua 10 leaps 🎉'
                    : `Leap ${CURRENT_LEAP.n} sau ~${st.daysUntilLeap} ngày`}
              </Txt>
            ) : null}
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 10, paddingLeft: 20, paddingRight: 14, gap: 6 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <IntensityBadge level={intensity} size="sm" />
              <Txt serif style={{ fontSize: 20, fontWeight: '600', lineHeight: 25, marginTop: 10, color: colors.textOnHero }}>
                {sunny
                  ? `Tuần nắng của ${displayName} 🌼`
                  : inLeap
                    ? `Bé đang ở ${PHASE.name} của Leap ${CURRENT_LEAP.n}`
                    : st.status === 'after-all'
                      ? 'Bé đã đi qua 10 leaps kỳ diệu'
                      : 'Bé đang giữa hai leap — tuần nắng 🌼'}
              </Txt>
              <Txt style={{ fontSize: 13, color: colors.textOnHero, opacity: 0.85, lineHeight: 20, marginTop: 6 }}>
                {sunny
                  ? C.copy
                  : inLeap
                    ? PHASE.desc
                    : st.status === 'after-all'
                      ? 'Hành trình Wonder Weeks đã trọn vẹn. Giờ là lúc tận hưởng từng khoảnh khắc lớn khôn của con.'
                      : `Tranh thủ nghỉ ngơi và chơi cùng con nhé. Leap ${CURRENT_LEAP.n} · ${CURRENT_LEAP.world} dự kiến bắt đầu trong ~${st.daysUntilLeap} ngày.`}
              </Txt>
              {sunny && S.nextLeap ? (
                <Txt style={{ fontSize: 12.5, fontWeight: '600', color: colors.textOnHero, opacity: 0.85, marginTop: 8 }}>
                  🌤️ Leap {S.nextLeap.n} dự kiến bắt đầu ngày {S.nextDate} — còn {S.daysToNext} ngày nữa
                </Txt>
              ) : null}
              {intensity >= 4 ? (
                <Pressable
                  onPress={() => ctx.openSheet('soothing')}
                  style={{ marginTop: 10, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.92)' }}
                >
                  <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.accentPrimary }}>🎵 Bật tiếng ồn trắng</Txt>
                </Pressable>
              ) : null}
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <BongIntensity level={intensity} size={100} float />
            </View>
          </View>
          {/* thin progress (only meaningful inside a leap) */}
          {inLeap ? (
            <View style={{ paddingTop: 10, paddingHorizontal: 20 }}>
              <View style={{ height: 4, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.22)' }}>
                <View style={{ width: `${Math.round((st.leapDay / st.leapTotal) * 100)}%`, height: '100%', borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.9)' }} />
              </View>
            </View>
          ) : null}
          {/* 7 days — inset panel at the hero's bottom */}
          <View style={{ marginTop: 12, marginHorizontal: 6, marginBottom: 6, backgroundColor: colors.bgElevated, borderRadius: radii.xl - 6, paddingTop: 10, paddingHorizontal: 10, paddingBottom: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 6, marginBottom: 6 }}>
              <Txt style={{ fontSize: 11.5, fontWeight: '700', color: colors.textMuted }}>7 ngày tới</Txt>
              <Pressable onPress={() => ctx.setTab('leap')} style={{ flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 4, paddingHorizontal: 2 }}>
                <Txt style={{ fontSize: 12, fontWeight: '700', color: colors.accentPrimary }}>Xem chi tiết</Txt>
                <Ic name="chevron" size={13} sw={2.4} color={colors.accentPrimary} />
              </Pressable>
            </View>
            <ForecastStrip data={st.forecast} onPick={() => ctx.setTab('leap')} />
          </View>
        </HeroCard>

        {/* ===== ALL-LEAPS-DONE celebration (empty state) ===== */}
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

        {/* ===== POST-LEAP PREMIUM MOMENT (sunny, one-time, dismissible) ===== */}
        {sunny && !postLeapDismissed ? <PostLeapCard onDismiss={() => setPostLeapDismissed(true)} /> : null}

        {/* ===== PRE-LEAP PREP (từ 5 ngày trước leap kế) ===== */}
        {sunny && S.prep && S.daysToNext != null && S.daysToNext <= 5 ? <PrepCard /> : null}

        {/* ===== SLOT 2: stormy = symptoms · sunny = "Hôm nay của bé" ===== */}
        {sunny ? <TodayOfBabyCard /> : null}

        {/* ===== SYMPTOMS — 2-col grid with Bống faces ===== */}
        {!sunny && st.status !== 'after-all' && CURRENT_LEAP.symptoms.length > 0 ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 2 }}>
              <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary }}>
                {inLeap ? 'Biểu hiện thường thấy' : `Biểu hiện có thể gặp ở Leap ${CURRENT_LEAP.n}`}
              </Txt>
              <ButtonText onPress={() => ctx.go('leapdetail')} style={{ padding: 0 }}>Cách giúp bé →</ButtonText>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {CURRENT_LEAP.symptoms.map((s, i) => (
                <Pressable
                  key={i}
                  onPress={() => setSymptomPick(s)}
                  style={({ pressed }) => [
                    {
                      flexBasis: '47%',
                      flexGrow: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      padding: 12,
                      minHeight: 64,
                      borderRadius: radii.lg,
                      backgroundColor: colors.bgElevated,
                      borderWidth: 1,
                      borderColor: colors.borderSubtle,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ]}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgAccentSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <BongFace emotion={SYMPTOM_EMO[i % SYMPTOM_EMO.length]} size={33} />
                  </View>
                  <Txt style={{ flex: 1, fontSize: 12.5, fontWeight: '600', lineHeight: 17, color: colors.textPrimary }}>{s}</Txt>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {/* ===== SLOT 3: stormy = action cards · sunny = "Kỹ năng đang nở" ===== */}
        {sunny ? <BloomSection /> : null}

        {/* ===== ACTION CARDS — horizontal carousel with full content ===== */}
        {!sunny && st.status !== 'after-all' && CURRENT_LEAP.actions.length > 0 ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 2 }}>
              <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary }}>
                {inLeap ? `Giúp bé hợp tác ở Leap ${CURRENT_LEAP.n}` : `Chuẩn bị cho Leap ${CURRENT_LEAP.n}`}
              </Txt>
              <ButtonText onPress={() => ctx.go('leapdetail')} style={{ padding: 0 }}>Tất cả →</ButtonText>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_W + CARD_GAP}
              snapToAlignment="start"
              decelerationRate="fast"
              onScroll={onCarouselScroll}
              scrollEventThrottle={64}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: 20, paddingBottom: 12, paddingTop: 4 }}
            >
              {CURRENT_LEAP.actions.slice(0, 3).map((a, i) => (
                <Card key={i} pad={16} style={{ width: CARD_W, borderWidth: 1, borderColor: colors.borderSubtle }}>
                  <View style={{ gap: 10, flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
                      <Icon3D emo={a.emoji} size={42} />
                      <Txt style={{ flex: 1, fontSize: 14.5, fontWeight: '700', lineHeight: 19, color: colors.textPrimary }}>{a.title}</Txt>
                    </View>
                    <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
                      <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Vì sao? </Txt>
                      {a.why}
                    </Txt>
                    <View style={{ backgroundColor: colors.bgAccentSoft, borderRadius: radii.md, paddingVertical: 10, paddingHorizontal: 12, marginTop: 'auto' }}>
                      <Txt style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 20 }}>
                        <Txt style={{ fontWeight: '700' }}>Nên làm: </Txt>
                        {a.what}
                      </Txt>
                    </View>
                    {a.hasSound ? (
                      <Pressable
                        onPress={() => ctx.openSheet('soothing')}
                        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingVertical: 11, paddingHorizontal: 16, minHeight: 44, borderRadius: 999, backgroundColor: colors.accentPrimary }}
                      >
                        <Txt style={{ fontSize: 13, fontWeight: '700', color: colors.textOnAccent }}>🎵 Bật tiếng ồn trắng</Txt>
                      </Pressable>
                    ) : null}
                  </View>
                </Card>
              ))}
            </ScrollView>
            {/* dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 4 }}>
              {CURRENT_LEAP.actions.slice(0, 3).map((_, i) => (
                <View key={i} style={{ width: i === actionIdx ? 16 : 6, height: 6, borderRadius: 3, backgroundColor: i === actionIdx ? colors.accentPrimary : colors.borderDefault }} />
              ))}
            </View>
          </View>
        ) : null}

        {/* ===== EASY TEASER ===== */}
        <EasyEducationCard />

        {/* ===== RECENT LOGS + quick-log pill ===== */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 2 }}>
            <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.textSecondary }}>Vừa ghi</Txt>
            <ButtonText onPress={() => ctx.go('history')} style={{ padding: 0 }}>Xem tất cả</ButtonText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 9, paddingHorizontal: 20, paddingBottom: 8 }}>
            <Pressable
              onPress={() => ctx.openSheet('quicklog')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 10, paddingHorizontal: 16, minHeight: 48, backgroundColor: colors.textPrimary, borderRadius: 999 }}
            >
              <Ic name="plus" size={17} sw={2.6} color={colors.bgCanvas} />
              <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.bgCanvas }}>Ghi nhanh</Txt>
            </Pressable>
            {D.RECENT_LOGS.map((l, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.bgElevated, borderRadius: 999, borderWidth: 1, borderColor: colors.borderSubtle }}>
                <Icon3D emo={l.icon} size={30} />
                <View>
                  <Txt style={{ fontSize: 13.5, fontWeight: '600' }}>{l.detail}</Txt>
                  <Txt style={{ fontSize: 11, color: colors.textMuted }}>{l.ago}</Txt>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ===== SMART REMINDER ===== */}
        <Banner icon="🍼" tone="sunken">
          <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
            Khoảng <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>11:30</Txt> bé có thể đói. Mình sẽ nhắc nhẹ nhé.
          </Txt>
        </Banner>
      </View>
    </ScrollView>
      <SymptomSheet symptom={symptomPick} leap={CURRENT_LEAP} open={!!symptomPick} onClose={() => setSymptomPick(null)} />
    </View>
  );
}

/* ============================================================
   EASY SCREEN — full explanation (stack)
   ============================================================ */
const EASY_STEPS = [
  { k: 'E', name: 'Ăn', icon: '🍼', desc: 'Bé thức dậy là được ăn ngay. Bú lúc tỉnh táo giúp bé ăn no hơn, không ngủ quên giữa cữ.' },
  { k: 'A', name: 'Chơi', icon: '✨', desc: 'Sau ăn là lúc bé tỉnh táo nhất: tummy time, nói chuyện, nhìn ngắm. Với bé 3–4 tháng, 60–90 phút thức là vừa đủ.' },
  { k: 'S', name: 'Ngủ', icon: '🌙', desc: 'Thấy bé dụi mắt, ngáp, quay mặt đi — đó là tín hiệu buồn ngủ. Đặt bé xuống khi lim dim, bé sẽ học tự vào giấc.' },
  { k: 'Y', name: 'Của mama', icon: '☕', desc: 'Bé ngủ = giờ của bạn. Nghỉ ngơi, ăn uống, hay đơn giản là ngồi yên một chút. Chăm mình cũng là chăm con.' },
];

export function EasyScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { state: st } = useBaby();
  const info = D.EASY_INFO;
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Phương pháp EASY" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 44 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <Bong emotion="snug" onesie="sage" size={92} float />
          <Txt style={{ flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>
            Trong Leap {st.leap.n}, thế giới của bé đang thay đổi — một nhịp <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>quen thuộc</Txt> giúp con đoán được điều gì đến tiếp theo, nên bớt bất an hơn.
          </Txt>
        </View>

        <Card pad={16} style={{ backgroundColor: colors.bgAccentSoft, marginBottom: 24 }}>
          <Txt style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: colors.accentPrimary, marginBottom: 12 }}>
            EASY GIÚP GÌ TRONG LEAP {st.leap.n}?
          </Txt>
          <View style={{ gap: 10 }}>
            {([
              ['🍼', 'Bé có thể bú ít mỗi cữ nhưng đòi ăn nhiều lần — cứ theo nhịp E, không ép đủ lượng.'],
              ['🌙', 'Trong leap bé dễ mệt sớm — đặt ngủ sớm hơn 30 phút so với lịch quen.'],
              ['✨', 'Giữ nguyên trình tự Ăn → Chơi → Ngủ — sự quen thuộc chính là điểm tựa của con lúc này.'],
            ] as [string, string][]).map(([e, t], i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 10 }}>
                <Txt style={{ fontSize: 13.5, lineHeight: 21 }}>{e}</Txt>
                <Txt style={{ flex: 1, fontSize: 13.5, color: colors.textPrimary, lineHeight: 21 }}>{t}</Txt>
              </View>
            ))}
          </View>
        </Card>

        <View style={{ gap: 10, marginBottom: 24 }}>
          {EASY_STEPS.map((s) => (
            <Card key={s.k} pad={14}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Icon3D emo={s.icon} size={44} />
                <View style={{ flex: 1 }}>
                  <Txt style={{ fontSize: 14.5, fontWeight: '700' }}>
                    <Txt style={{ color: colors.accentPrimary, fontWeight: '700' }}>{s.k}</Txt> · {s.name}
                  </Txt>
                  <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 21, marginTop: 4 }}>{s.desc}</Txt>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <Card pad={16} style={{ backgroundColor: colors.bgAccentSoft, marginBottom: 24 }}>
          <Txt style={{ fontSize: 13, fontWeight: '700', color: colors.accentPrimary, marginBottom: 6 }}>
            {st.easyVariant} — DÀNH CHO BÉ {st.ageLabel.toUpperCase()}
          </Txt>
          <Txt style={{ fontSize: 14, color: colors.textPrimary, lineHeight: 22 }}>{st.easyDetail}</Txt>
        </Card>

        <Banner icon="☁️" tone="soft" style={{ marginBottom: 24 }}>{info.note}</Banner>

        <Txt style={{ fontSize: 13, color: colors.textMuted, lineHeight: 21, textAlign: 'center' }}>
          EASY là khung tham khảo, không phải lịch cứng.{'\n'}Bé của bạn luôn là người dẫn nhịp 💛
        </Txt>
      </ScrollView>
    </View>
  );
}
