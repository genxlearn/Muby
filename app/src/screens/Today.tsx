/* ============================================================
   SCREEN 1 — TODAY (Home) v4
   Leap-specific hero, Symptoms Strip, Action Cards, EASY card.
   ============================================================ */
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  Banner,
  ButtonPrimary,
  ButtonText,
  Card,
  EmptyState,
  HeroCard,
  Ic,
  IntensityBadge,
  SkeletonCard,
} from '../components';
import * as D from '../data/sampleData';
import { BongIntensity } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { ActionCard, BabyAvatar, EasyEducationCard, ForecastStrip, SunnyPlaySection, SymptomPills, SymptomSheet } from './shared';

let _todayLoaded = false;

function GreetRow() {
  const { colors } = useTheme();
  const ctx = useApp();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View>
        <Txt style={{ fontSize: 13.5, color: colors.textMuted, fontWeight: '600' }}>Chào buổi sáng, mama 💛</Txt>
        <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, lineHeight: 26, marginTop: 2 }}>{D.BABY.ageLabel}</Txt>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          onPress={() => ctx.go('notifications')}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderSubtle, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ic name="bell" size={21} color={colors.textSecondary} />
          <View style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentPrimary, borderWidth: 2, borderColor: colors.bgElevated }} />
        </Pressable>
        <BabyAvatar size={42} />
      </View>
    </View>
  );
}

export function TodayScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { intensity, empty } = ctx;
  const { CURRENT_LEAP, LEAP_DAY, LEAP_TOTAL } = D;
  const [loading, setLoading] = useState(!_todayLoaded);
  const [symptomPick, setSymptomPick] = useState<string | null>(null);

  useEffect(() => {
    if (_todayLoaded) return;
    const t = setTimeout(() => { _todayLoaded = true; setLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, paddingTop: 4, paddingHorizontal: 20, gap: 24 }}>
        <GreetRow />
        <SkeletonCard h={185} />
        <SkeletonCard h={50} />
        <SkeletonCard h={130} />
        <SkeletonCard h={92} />
      </View>
    );
  }

  if (empty) {
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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

  const sunny = intensity <= 2;

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
      <View style={{ paddingTop: 4, paddingHorizontal: 20, gap: 24 }}>
        <GreetRow />

        {/* HERO */}
        <HeroCard intensity={intensity} pad={0}>
          <View style={{ flexDirection: 'row', paddingTop: 16, paddingBottom: 18, paddingLeft: 18, paddingRight: 14, gap: 6 }}>
            <View style={{ flex: 1, minWidth: 0 }}>
              <IntensityBadge level={intensity} size="lg" />
              <Txt serif style={{ fontSize: 20, fontWeight: '600', lineHeight: 24, marginTop: 12, color: colors.textOnHero }}>
                Leap {CURRENT_LEAP.n} · {CURRENT_LEAP.world}
              </Txt>
              <Txt style={{ fontSize: 14, color: colors.textOnHero, opacity: 0.8, lineHeight: 20, marginTop: 6 }}>
                Bé đang học: <Txt style={{ fontWeight: '700', color: colors.textOnHero }}>{CURRENT_LEAP.skill}</Txt>
              </Txt>
              <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', marginTop: 10 }}>
                <Txt style={{ fontSize: 12, fontWeight: '600', color: colors.textOnHero, opacity: 0.9 }}>Ngày {LEAP_DAY}/{LEAP_TOTAL}</Txt>
              </View>
              {intensity >= 4 ? (
                <Pressable
                  onPress={() => ctx.openSheet('soothing')}
                  style={{ marginTop: 12, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 999, backgroundColor: colors.accentPrimary }}
                >
                  <Txt style={{ fontSize: 13.5, fontWeight: '700', color: '#fff' }}>🎵 Bật tiếng ồn trắng</Txt>
                </Pressable>
              ) : null}
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <BongIntensity level={intensity} size={118} float />
            </View>
          </View>
        </HeroCard>

        {/* SYMPTOMS STRIP */}
        {CURRENT_LEAP.symptoms.length > 0 ? (
          <View>
            <Txt style={{ fontSize: 13, color: colors.textMuted, fontWeight: '600', marginBottom: 8, paddingHorizontal: 2 }}>📌 Biểu hiện thường thấy ở leap này:</Txt>
            <SymptomPills symptoms={CURRENT_LEAP.symptoms} onPick={setSymptomPick} />
            <Pressable onPress={() => ctx.go('leapdetail')} style={{ paddingVertical: 10, paddingHorizontal: 2, minHeight: 44, justifyContent: 'center' }}>
              <Txt style={{ fontSize: 13, color: colors.accentPrimary, fontWeight: '600' }}>Đúng con mình! Xem cách giúp bé →</Txt>
            </Pressable>
          </View>
        ) : null}

        {/* ACTION CARDS */}
        {CURRENT_LEAP.actions.length > 0 ? (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 2 }}>
              <Txt style={{ fontSize: 15.5, fontWeight: '700', color: colors.textPrimary }}>Giúp bé hợp tác ở Leap {CURRENT_LEAP.n}</Txt>
              <ButtonText onPress={() => ctx.go('leapdetail')} style={{ padding: 0 }}>Xem tất cả →</ButtonText>
            </View>
            <View style={{ gap: 10 }}>
              {CURRENT_LEAP.actions.slice(0, 3).map((a, i) => (
                <ActionCard key={i} action={a} intensity={intensity} defaultOpen={i === 0} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
              ))}
            </View>
          </View>
        ) : null}

        {/* EASY EDUCATIONAL CARD */}
        <EasyEducationCard />

        {/* SUNNY PLAY */}
        {sunny ? <SunnyPlaySection leap={CURRENT_LEAP} /> : null}

        {/* FORECAST */}
        <Card pad={14}>
          <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.textSecondary, marginBottom: 10 }}>7 ngày tới</Txt>
          <ForecastStrip data={D.FORECAST} onPick={() => ctx.setTab('leap')} />
        </Card>

        {/* RECENT LOGS */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingHorizontal: 2 }}>
            <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.textSecondary }}>Vừa ghi</Txt>
            <ButtonText onPress={() => ctx.go('history')} style={{ padding: 0 }}>Xem tất cả</ButtonText>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 9, paddingBottom: 2 }}>
            {D.RECENT_LOGS.map((l, i) => (
              <View key={i} style={[{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: colors.bgElevated, borderRadius: 999, borderWidth: 1, borderColor: colors.borderSubtle }]}>
                <Txt style={{ fontSize: 18 }}>{l.icon}</Txt>
                <View>
                  <Txt style={{ fontSize: 13.5, fontWeight: '600' }}>{l.detail}</Txt>
                  <Txt style={{ fontSize: 11, color: colors.textMuted }}>{l.ago}</Txt>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* SMART REMINDER */}
        <Banner icon="🍼" tone="sunken">
          <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
            Khoảng <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>11:30</Txt> bé có thể đói. Mình sẽ nhắc nhẹ nhé.
          </Txt>
        </Banner>
      </View>

      <SymptomSheet symptom={symptomPick} leap={CURRENT_LEAP} open={!!symptomPick} onClose={() => setSymptomPick(null)} />
    </ScrollView>
  );
}
