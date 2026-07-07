/* ============================================================
   SCREEN 3 — LEAP TAB (3A Hôm nay · 3B Hành trình · 3C Lịch)
   SCREEN 4 — LEAP DETAIL
   Ported from project/screens/leap.jsx.
   ============================================================ */
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonSecondary,
  Card,
  EmptyState,
  Ic,
  IntensityBadge,
  ListRow,
  MiniIntensityCurve,
  NAV_CLEARANCE,
  Sheet,
  SubTabs,
} from '../components';
import * as D from '../data/sampleData';
import { LeapAction } from '../data/sampleData';
import { BongFace, BongIntensity } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { ActionCard, ForecastStrip, SunnyPlaySection, SymptomPills } from './shared';

const clampLv = (n: number) => (Math.min(5, Math.max(1, n)) as 1 | 2 | 3 | 4 | 5);

type Sub = 'today' | 'journey' | 'cal';
type DetailTab = 'now' | 'actions' | 'hist';

/* Fallback soothing action cards used when the current leap has no actions. */
const FALLBACK_SOOTHE: LeapAction[] = [
  { emoji: '🎵', title: 'Tiếng ồn trắng', why: '', what: 'Mô phỏng âm thanh trong bụng mẹ, giúp bé dịu lại.', hasSound: true },
  { emoji: '🤱', title: 'Da kề da', why: '', what: 'Đặt bé lên ngực mẹ, hơi ấm làm bé bình tĩnh.' },
];

/* ---- 3A Hôm nay ---- */
function LeapToday() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { intensity } = ctx;
  const { CURRENT_LEAP, LEAP_DAY, LEAP_TOTAL } = D;
  const PHASE = D.leapPhase(LEAP_DAY, LEAP_TOTAL);
  const sunny = intensity <= 2;
  const actions = CURRENT_LEAP.actions;

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
      <View style={{ paddingTop: 4, paddingHorizontal: 20, gap: 24 }}>
        {/* HERO — phase-based framing (Muby App Final) */}
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <View style={{ height: 5, backgroundColor: colors.intensity[clampLv(intensity)] }} />
          <View style={{ flexDirection: 'row', gap: 6, paddingVertical: 18, paddingHorizontal: 16 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <IntensityBadge level={intensity} size="md" />
              <Txt serif style={{ fontSize: 21, fontWeight: '600', lineHeight: 26, marginTop: 12, color: colors.textPrimary }}>
                Bé đang ở {PHASE.name} của Leap {CURRENT_LEAP.n}
              </Txt>
              <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20, marginTop: 6 }}>
                {PHASE.desc}
              </Txt>
              <Txt style={{ fontSize: 12, color: colors.textMuted, fontWeight: '600', marginTop: 8 }}>
                Ngày {LEAP_DAY}/{LEAP_TOTAL} · còn ~{LEAP_TOTAL - LEAP_DAY} ngày
              </Txt>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <BongIntensity level={intensity} size={128} float />
            </View>
          </View>
        </Card>

        {/* FORECAST — swipeable strip */}
        <Card pad={14}>
          <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.textSecondary, marginBottom: 12 }}>7 ngày tới</Txt>
          <ForecastStrip data={D.FORECAST} />
        </Card>

        {/* "ĐANG XẢY RA GÌ?" — tap to open detail */}
        <Card onPress={() => ctx.go('leapdetail')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Txt style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 1, color: colors.accentPrimary }}>ĐANG XẢY RA GÌ?</Txt>
            <Ic name="chevron" size={18} color={colors.textMuted} />
          </View>
          <Txt serif style={{ fontSize: 19, fontWeight: '600', marginTop: 8, lineHeight: 25, color: colors.textPrimary }}>{CURRENT_LEAP.fullName}</Txt>
          <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6, lineHeight: 22 }}>
            {CURRENT_LEAP.desc.split('\n')[0]}
          </Txt>
        </Card>

        {/* CONTEXT-AWARE SECTION */}
        {sunny ? (
          <SunnyPlaySection leap={CURRENT_LEAP} />
        ) : actions.length > 0 ? (
          <View>
            <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, paddingHorizontal: 2 }}>Giúp bé hợp tác ở Leap {CURRENT_LEAP.n}</Txt>
            <View style={{ gap: 10 }}>
              {actions.map((a, i) => (
                <ActionCard key={i} action={a} intensity={intensity} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
              ))}
            </View>
          </View>
        ) : (
          <View>
            <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, paddingHorizontal: 2 }}>Cách dỗ bé hôm nay 🤍</Txt>
            <View style={{ gap: 10 }}>
              {FALLBACK_SOOTHE.map((a, i) => (
                <ActionCard key={i} action={a} intensity={intensity} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
              ))}
            </View>
          </View>
        )}

        {/* Symptoms pills — non-tappable */}
        {CURRENT_LEAP.symptoms.length > 0 ? (
          <View>
            <Txt style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 8, paddingHorizontal: 2 }}>📌 Biểu hiện thường thấy:</Txt>
            <SymptomPills symptoms={CURRENT_LEAP.symptoms} />
          </View>
        ) : null}

        <Banner icon="💛" tone="soft">
          <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
            Bé hôm nay thế nào rồi mama?{' '}
            <Txt onPress={() => ctx.openSheet('quicklog')} style={{ color: colors.accentPrimary, fontWeight: '700' }}>Ghi lại cảm xúc</Txt>
          </Txt>
        </Banner>
      </View>
    </ScrollView>
  );
}

/* ---- 3B Hành trình (timeline) ---- */
function LeapJourney() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { LEAPS, CURRENT_LEAP, BABY } = D;
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
      <View style={{ paddingTop: 16, paddingHorizontal: 20, position: 'relative' }}>
        {/* vertical line behind nodes */}
        <View style={{ position: 'absolute', left: 43, top: 24, bottom: 24, width: 2.5, backgroundColor: colors.borderSubtle }} />
        {LEAPS.map((lp) => {
          const past = lp.range[1] < BABY.ageWeeks;
          const current = lp.n === CURRENT_LEAP.n;
          return (
            <View key={lp.n} style={{ flexDirection: 'row', gap: 16, marginBottom: current ? 8 : 18 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: past ? colors.success : current ? colors.accentPrimary : colors.bgSunken,
                  borderWidth: 3,
                  borderColor: colors.bgCanvas,
                }}
              >
                {past ? (
                  <Ic name="check" size={22} sw={2.6} color="#fff" />
                ) : (
                  <Txt style={{ fontSize: 16, fontWeight: '700', color: current ? '#fff' : colors.textMuted }}>{lp.n}</Txt>
                )}
              </View>
              {current ? (
                <Card pad={15} style={{ flex: 1, borderWidth: 1.5, borderColor: colors.accentPrimary }} onPress={() => ctx.go('leapdetail')}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Txt style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 0.5, color: colors.accentPrimary }}>ĐANG DIỄN RA</Txt>
                      <Txt serif style={{ fontSize: 19, fontWeight: '600', marginTop: 3, color: colors.textPrimary }}>Leap {lp.n} · {lp.world}</Txt>
                      <Txt style={{ fontSize: 12.5, color: colors.textSecondary, marginTop: 4, lineHeight: 18 }}>Bé đang học: {lp.skill}</Txt>
                    </View>
                    <BongIntensity level={ctx.intensity} size={56} />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <IntensityBadge level={ctx.intensity} size="sm" />
                    <View style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
                      <MiniIntensityCurve w={92} h={28} />
                      <Txt style={{ fontSize: 10.5, color: colors.accentPrimary, fontWeight: '700' }}>▼ Hôm nay</Txt>
                    </View>
                  </View>
                </Card>
              ) : (
                <View style={{ flex: 1, paddingTop: 4 }}>
                  <Txt style={{ fontSize: 15.5, fontWeight: '700', color: past ? colors.textSecondary : colors.textPrimary }}>Leap {lp.n} · {lp.world}</Txt>
                  <Txt style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 2 }}>Khoảng tuần {lp.wk} · {past ? 'Đã qua' : 'Sắp tới'}</Txt>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

/* ---- 3C Lịch (calendar) ---- */
function LeapCalendar() {
  const { colors } = useTheme();
  const weeks = D.buildCalendar();
  const [pick, setPick] = useState<D.CalendarWeek | null>(null);
  const [legend, setLegend] = useState(true);
  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
      <View style={{ paddingTop: 16, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <Txt style={{ fontSize: 14.5, fontWeight: '700', color: colors.textPrimary }}>77 tuần kỳ diệu</Txt>
          <Pressable onPress={() => setLegend((l) => !l)} hitSlop={8} style={{ paddingVertical: 6 }}>
            <Txt style={{ fontSize: 12.5, color: colors.accentPrimary, fontWeight: '600' }}>{legend ? 'Ẩn chú thích' : 'Chú thích'}</Txt>
          </Pressable>
        </View>

        {legend ? (
          <View style={{ flexDirection: 'row', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
            {([[1, 'Nắng'], [3, 'Hơi ấm'], [5, 'Cần mama']] as [number, string][]).map(([l, t]) => (
              <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: colors.intensity[clampLv(l)] }} />
                <Txt style={{ fontSize: 12, color: colors.textSecondary }}>{t}</Txt>
              </View>
            ))}
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
          {weeks.map((w) => (
            <Pressable
              key={w.w}
              onPress={() => setPick(w)}
              style={{
                flexBasis: '14%',
                flexGrow: 1,
                aspectRatio: 0.9,
                borderRadius: 9,
                backgroundColor: colors.intensity[clampLv(w.n)],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2.5,
                borderColor: w.current ? colors.accentPrimary : 'transparent',
              }}
            >
              <Txt style={{ fontSize: 12, fontWeight: '700', color: colors.intensityInk[clampLv(w.n)] }}>{w.w}</Txt>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>

      <Sheet
        open={!!pick}
        onClose={() => setPick(null)}
        height="46%"
        title={pick ? `Tuần ${pick.w}` : ''}
        sub={pick ? 'Mức cảm xúc dự kiến' : ''}
      >
        {pick ? (
          <View style={{ alignItems: 'center', gap: 12, paddingTop: 8 }}>
            <BongIntensity level={pick.n} size={120} />
            <IntensityBadge level={pick.n} size="lg" />
            <Txt style={{ fontSize: 14.5, color: colors.textSecondary, textAlign: 'center', maxWidth: 260, lineHeight: 22 }}>
              {D.INTENSITY_COPY[pick.n].copy}
            </Txt>
          </View>
        ) : null}
      </Sheet>
    </View>
  );
}

export function LeapScreen({ initialSub }: { initialSub?: Sub }) {
  const { colors } = useTheme();
  const [sub, setSub] = useState<Sub>(initialSub || 'today');
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: 6, paddingBottom: 12 }}>
        <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, paddingHorizontal: 20, paddingBottom: 12 }}>Hành trình của bé</Txt>
        <SubTabs<Sub>
          value={sub}
          onChange={setSub}
          style={{ marginHorizontal: 20 }}
          tabs={[
            { id: 'today', label: 'Hôm nay' },
            { id: 'journey', label: 'Hành trình' },
            { id: 'cal', label: 'Lịch' },
          ]}
        />
      </View>
      {sub === 'today' ? <LeapToday /> : sub === 'journey' ? <LeapJourney /> : <LeapCalendar />}
    </View>
  );
}

/* ============================================================
   SCREEN 4 — Leap Detail
   ============================================================ */
export function LeapDetailScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const [tab, setTab] = useState<DetailTab>('now');
  const { CURRENT_LEAP } = D;
  const locked = CURRENT_LEAP.n >= 4 && !ctx.premium;
  const pastLeaps = D.LEAPS.filter((lp) => lp.range[1] < D.BABY.ageWeeks);

  return (
    <View style={{ flex: 1 }}>
      <AppBar
        title=""
        onBack={ctx.back}
        right={
          <Pressable onPress={() => ctx.go('library')} hitSlop={8} style={{ padding: 8 }}>
            <Txt style={{ fontSize: 13, color: colors.accentPrimary, fontWeight: '600' }}>Thư viện</Txt>
          </Pressable>
        }
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 20 }}>
          {/* HERO */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <BongIntensity level={ctx.intensity} size={120} float />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt style={{ fontSize: 12.5, fontWeight: '700', letterSpacing: 1.5, color: colors.accentPrimary }}>LEAP {CURRENT_LEAP.n}</Txt>
              <Txt serif style={{ fontSize: 26, fontWeight: '600', lineHeight: 28, marginTop: 4, marginBottom: 6, color: colors.textPrimary }}>{CURRENT_LEAP.fullName}</Txt>
              <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18, marginBottom: 8 }}>Bé đang học: {CURRENT_LEAP.skill}</Txt>
              <IntensityBadge level={ctx.intensity} size="sm" />
            </View>
          </View>

          {/* Intensity curve */}
          <Card pad={14} style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Txt style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary }}>Bạn đang ở đây</Txt>
              <Txt style={{ fontSize: 12, color: colors.textMuted }}>Ngày {D.LEAP_DAY}/{D.LEAP_TOTAL}</Txt>
            </View>
            <MiniIntensityCurve w={300} h={56} />
          </Card>

          {/* TABS */}
          <SubTabs<DetailTab>
            value={tab}
            onChange={setTab}
            style={{ marginBottom: 20 }}
            tabs={[
              { id: 'now', label: 'Đang xảy ra' },
              { id: 'actions', label: 'Giúp bé' },
              { id: 'hist', label: 'Lịch sử' },
            ]}
          />

          {/* TAB: Đang xảy ra */}
          {tab === 'now' ? (
            <View style={{ gap: 12 }}>
              <Txt style={{ fontSize: 15, lineHeight: 25, color: colors.textPrimary }}>{CURRENT_LEAP.desc}</Txt>

              {CURRENT_LEAP.symptoms.length > 0 ? (
                <View>
                  <Txt style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 8 }}>📌 Biểu hiện thường thấy:</Txt>
                  <SymptomPills symptoms={CURRENT_LEAP.symptoms} />
                </View>
              ) : null}

              {locked ? (
                <Card pad={16} style={{ backgroundColor: colors.bgAccentSoft, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.accentPrimary }}>
                  <Txt style={{ fontSize: 14.5, fontWeight: '700', color: colors.textPrimary, lineHeight: 22, marginBottom: 8 }}>
                    Dùng thử miễn phí 1 tháng — sau đó 199.000đ trọn đời 💛
                  </Txt>
                  <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20, marginBottom: 14 }}>
                    Đọc đầy đủ dấu hiệu & cách đồng hành cùng bé qua Leap {CURRENT_LEAP.n}…
                  </Txt>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <ButtonPrimary full={false} onPress={() => ctx.openPaywall('Mở khóa Leap đầy đủ')} style={{ flex: 1, minHeight: 48 }}>Dùng thử 1 tháng</ButtonPrimary>
                    <ButtonSecondary full={false} onPress={ctx.back} style={{ flex: 1, minHeight: 48 }}>Để sau</ButtonSecondary>
                  </View>
                </Card>
              ) : null}
            </View>
          ) : null}

          {/* TAB: Giúp bé */}
          {tab === 'actions' ? (
            <View style={{ gap: 10 }}>
              {CURRENT_LEAP.actions.length > 0 ? (
                CURRENT_LEAP.actions.map((a, i) => (
                  <ActionCard key={i} action={a} intensity={ctx.intensity} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
                ))
              ) : (
                [
                  'Giữ nhịp sinh hoạt đều đặn — bé cần dự đoán được điều gì xảy ra tiếp.',
                  'Cho bé nhiều cơ hội được ôm — đây là nhu cầu thật, không phải thói quen.',
                  'Chơi trốn tìm để bé luyện khái niệm "biến mất rồi quay lại."',
                ].map((t, i) => (
                  <Card key={i} pad={14}>
                    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                      <Ic name="check" size={20} sw={2.4} color={colors.success} />
                      <Txt style={{ flex: 1, fontSize: 14.5, lineHeight: 22, color: colors.textPrimary }}>{t}</Txt>
                    </View>
                  </Card>
                ))
              )}
            </View>
          ) : null}

          {/* TAB: Lịch sử */}
          {tab === 'hist' ? (
            <View style={{ gap: 8 }}>
              {pastLeaps.length > 0 ? (
                [...pastLeaps].reverse().map((lp, i) => (
                  <ListRow
                    key={i}
                    icon={<Ic name="check" size={18} sw={2.4} color={colors.success} />}
                    iconBg={colors.successSoft}
                    title={`Leap ${lp.n} · ${lp.world}`}
                    sub={`Tuần ${lp.wk} · đã vượt qua`}
                  />
                ))
              ) : (
                <EmptyState emotion="curious" onesie="sage" heading="Đây là leap đầu tiên!" helper="Bé đang bắt đầu hành trình kỳ diệu." />
              )}
            </View>
          ) : null}

          <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Mỗi leap rồi sẽ qua. Bé đang lớn lên ngay trong vòng tay mama.</Banner>
        </View>
      </ScrollView>
    </View>
  );
}
