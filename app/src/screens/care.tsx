/* ============================================================
   CARE - MVP v2.1 (Figma: Status Strip, Active Timer, B9, B10)
   Live status at the top of Hôm nay, the running-timer pill,
   and the breastfeeding / sleep timer screens.
   ============================================================ */
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { AppBar, ButtonPrimary, ButtonText, Chip, Ic } from '../components';
import { BongFace } from '../mascot/Bong';
import { Side, useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { breastTotals, clock, duration, lastBreastSide, sideName, statusSummary, stopwatch, useNow } from '../state/care';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

/* ---------- Status Strip ---------- */
export function StatusStrip() {
  const { colors, radii, shadows } = useTheme();
  const ctx = useApp();
  const { displayName } = useBaby();
  const now = useNow(30000);
  const s = statusSummary(ctx.logs, ctx.timer, now, displayName);
  const onPress = () => {
    if (ctx.timer?.kind === 'sleep') ctx.go('sleeptimer');
    else if (ctx.timer?.kind === 'breast') ctx.go('feedtimer');
    else ctx.openSheet('quicklog');
  };
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${s.status}. ${s.detail}`}
      style={({ pressed }) => [
        { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: radii.lg, backgroundColor: colors.bgElevated, opacity: pressed ? 0.85 : 1 },
        shadows[2],
      ]}
    >
      <View style={{ width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.activity.sleep.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Ic name={s.asleep ? 'moon' : 'sun'} size={20} color={colors.activity.sleep.fg} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt numberOfLines={1} style={{ fontSize: 15, fontWeight: '600' }}>{s.status}</Txt>
        <Txt numberOfLines={2} style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2, lineHeight: 18 }}>{s.detail}</Txt>
      </View>
      <Ic name="chevron" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

/* ---------- Active Timer pill ---------- */
export function ActiveTimerPill() {
  const { colors } = useTheme();
  const ctx = useApp();
  const t = ctx.timer;
  const now = useNow(1000, !!t);
  if (!t) return null;
  const sleep = t.kind === 'sleep';
  const label = sleep ? 'Đang ngủ' : t.segStart && t.side ? `Đang bú · bên ${sideName(t.side)}` : 'Bú mẹ · tạm dừng';
  const time = sleep ? stopwatch(now - t.startAt) : stopwatch(breastTotals(t, now).total);
  const bg = sleep ? colors.activity.sleep.bg : colors.activity.feed.bg;
  const fg = sleep ? colors.activity.sleep.fg : colors.activity.feed.fg;
  return (
    <Pressable
      onPress={() => ctx.go(sleep ? 'sleeptimer' : 'feedtimer')}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${time}. Mở đồng hồ`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 14, paddingRight: 10, borderRadius: 999, backgroundColor: bg }}
    >
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: fg }} />
      <Txt numberOfLines={1} style={{ flex: 1, fontSize: 15, fontWeight: '600' }}>{label}</Txt>
      <Txt style={{ fontSize: 17, fontWeight: '600', color: fg, fontVariant: ['tabular-nums'] }}>{time}</Txt>
      <View style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: colors.bgElevated }}>
        <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand }}>Mở</Txt>
      </View>
    </Pressable>
  );
}

/* ---------- B9 · Breastfeeding timer ---------- */
function SideButton({ side, state, ms, onPress }: { side: Side; state: 'idle' | 'last' | 'running'; ms: number; onPress: () => void }) {
  const { colors, shadows } = useTheme();
  const running = state === 'running';
  const last = state === 'last';
  const fg = running ? colors.textOnAccent : last ? colors.textBrand : colors.textPrimary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Bên ${sideName(side)}${running ? ', đang đếm. Chạm để tạm dừng' : ''}`}
      style={({ pressed }) => [
        {
          width: 132,
          height: 132,
          borderRadius: 66,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          backgroundColor: running ? colors.accentPrimary : last ? colors.accentSoftBg : colors.bgElevated,
          borderWidth: running ? 0 : last ? 2 : 1.5,
          borderColor: last ? colors.accentPrimary : colors.borderDefault,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        running ? shadows.fab : null,
      ]}
    >
      <Ic name={running ? 'pause' : 'play'} size={26} sw={2} color={running ? colors.textOnAccent : last ? colors.textBrand : colors.textSecondary} />
      <Txt style={{ fontSize: 15, fontWeight: '600', color: fg }}>Bên {sideName(side)}</Txt>
      <Txt style={{ fontSize: running ? 17 : 12, fontWeight: running ? '600' : '400', color: fg, fontVariant: ['tabular-nums'] }}>
        {last && ms === 0 ? 'Lần trước' : stopwatch(ms)}
      </Txt>
    </Pressable>
  );
}

export function FeedTimerScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const t = ctx.timer && ctx.timer.kind === 'breast' ? ctx.timer : null;
  const now = useNow(1000, !!t?.segStart);
  const totals = breastTotals(t, now);
  const last = lastBreastSide(ctx.logs);
  const [manual, setManual] = useState(false);
  const [manualSide, setManualSide] = useState<Side>(last?.side === 'L' ? 'R' : 'L');

  const tap = (s: Side) => {
    if (ctx.timer?.kind === 'sleep') {
      ctx.toast('Bé đang ngủ. Bấm "Bé dậy rồi" trước khi bắt đầu cữ bú nhé.');
      return;
    }
    const n = Date.now();
    if (!t) {
      ctx.setTimer({ kind: 'breast', startAt: n, side: s, segStart: n, acc: { L: 0, R: 0 } });
      return;
    }
    const acc = { ...t.acc };
    if (t.side && t.segStart) acc[t.side] += n - t.segStart;
    if (t.side === s && t.segStart) ctx.setTimer({ ...t, acc, segStart: null }); // pause
    else ctx.setTimer({ ...t, acc, side: s, segStart: n }); // start / switch side
  };

  const mins = (ms: number) => Math.max(1, Math.round(ms / 60000));
  const save = () => {
    if (!t || totals.total < 1000) return;
    const parts = (['L', 'R'] as Side[]).filter((s) => totals[s] >= 1000).map((s) => `${sideName(s)} ${mins(totals[s])} phút`);
    const side: Side = t.side ?? (totals.L >= totals.R ? 'L' : 'R');
    ctx.addLog({ type: 'feed', label: 'Bú mẹ', detail: parts.join(', '), at: t.startAt, side });
    ctx.setTimer(null);
    ctx.back();
    ctx.toast(`Đã ghi cữ bú ${duration(totals.total)}. Bạn đang làm rất tốt ❤️`);
  };
  const saveManual = (m: number) => {
    ctx.addLog({ type: 'feed', label: 'Bú mẹ', detail: `${sideName(manualSide)} ${m} phút`, at: Date.now() - m * 60000, side: manualSide });
    ctx.back();
    ctx.toast(`Đã ghi bú mẹ bên ${sideName(manualSide)} ${m} phút`);
  };
  const otherType = () => {
    ctx.back();
    ctx.openSheet('quicklog');
  };

  const stateOf = (s: Side): 'idle' | 'last' | 'running' =>
    t?.side === s && t.segStart ? 'running' : !t && last?.side === s ? 'last' : 'idle';
  const hint = t
    ? t.segStart
      ? 'Chạm bên kia để đổi bên. Chạm lại để tạm dừng.'
      : 'Đang tạm dừng. Chạm một bên để bú tiếp.'
    : last
      ? `Lần trước bú bên ${sideName(last.side)} lúc ${clock(last.at)} · bắt đầu bên ${sideName(last.side === 'L' ? 'R' : 'L')} nhé`
      : 'Chạm một bên để bắt đầu đếm giờ';

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Cữ ăn" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center', gap: 18 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Chip active>Bú mẹ</Chip>
          <Chip onPress={otherType}>Bú bình</Chip>
          <Chip onPress={otherType}>Ăn dặm</Chip>
        </View>
        <BongFace emotion="eating" size={112} />
        <Txt style={{ fontSize: 56, lineHeight: 62, fontWeight: '600', letterSpacing: -1, fontVariant: ['tabular-nums'] }}>{stopwatch(totals.total)}</Txt>
        <View style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.accentSoftBg }}>
          <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textBrand, textAlign: 'center' }}>{hint}</Txt>
        </View>
        <View style={{ flexDirection: 'row', gap: 24 }}>
          <SideButton side="L" state={stateOf('L')} ms={totals.L} onPress={() => tap('L')} />
          <SideButton side="R" state={stateOf('R')} ms={totals.R} onPress={() => tap('R')} />
        </View>

        <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 8 }}>
          <ButtonPrimary disabled={!t || totals.total < 1000} onPress={save}>Lưu cữ bú</ButtonPrimary>
          {t ? (
            <ButtonText onPress={() => { ctx.setTimer(null); ctx.toast('Đã huỷ cữ bú này'); }} style={{ alignSelf: 'center' }}>Huỷ cữ này</ButtonText>
          ) : (
            <ButtonText onPress={() => setManual((m) => !m)} style={{ alignSelf: 'center' }}>{manual ? 'Ẩn nhập tay' : 'Nhập tay số phút'}</ButtonText>
          )}
        </View>

        {manual && !t ? (
          <View style={{ alignSelf: 'stretch', gap: 10, padding: 16, borderRadius: radii.lg, backgroundColor: colors.bgElevated }}>
            <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Bên nào?</Txt>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Chip active={manualSide === 'L'} onPress={() => setManualSide('L')}>Bên trái</Chip>
              <Chip active={manualSide === 'R'} onPress={() => setManualSide('R')}>Bên phải</Chip>
            </View>
            <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginTop: 4 }}>Bú bao lâu? Chạm là lưu.</Txt>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {[5, 10, 15, 20, 30].map((m) => (
                <Chip key={m} onPress={() => saveManual(m)}>{`${m} phút`}</Chip>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

/* ---------- B10 · Sleep timer ---------- */
export function SleepTimerScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const { displayName } = useBaby();
  const t = ctx.timer && ctx.timer.kind === 'sleep' ? ctx.timer : null;
  const now = useNow(1000, !!t);
  const [startOffset, setStartOffset] = useState(0);

  const start = () => {
    if (ctx.timer?.kind === 'breast') {
      ctx.toast('Đang đếm giờ bú. Lưu cữ bú trước nhé.');
      return;
    }
    ctx.setTimer({ kind: 'sleep', startAt: Date.now() - startOffset * 60000 });
  };
  const shift = (min: number) => {
    if (!t) return;
    const next = Math.min(Date.now(), t.startAt + min * 60000);
    ctx.setTimer({ kind: 'sleep', startAt: next });
  };
  const wake = () => {
    if (!t) return;
    const end = Date.now();
    ctx.addLog({ type: 'sleep', label: 'Giấc ngủ', detail: duration(end - t.startAt), at: t.startAt, endAt: end });
    ctx.setTimer(null);
    ctx.back();
    ctx.toast(`${displayName} đã ngủ ${duration(end - t.startAt)} 💤`);
  };

  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Giấc ngủ" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, alignItems: 'center', gap: 18 }}>
        <View style={{ width: 200, height: 200, borderRadius: 100, backgroundColor: colors.activity.sleep.bg, alignItems: 'center', justifyContent: 'center' }}>
          <BongFace emotion="sleeping" size={130} />
        </View>
        <Txt style={{ fontSize: 15, fontWeight: '600', color: colors.activity.sleep.fg }}>{t ? `${displayName} đang ngủ` : `${displayName} chuẩn bị ngủ`}</Txt>
        <Txt style={{ fontSize: 56, lineHeight: 62, fontWeight: '600', letterSpacing: -1, fontVariant: ['tabular-nums'] }}>
          {t ? stopwatch(now - t.startAt) : '00:00'}
        </Txt>

        {t ? (
          <View style={{ flexDirection: 'row', gap: 12, alignSelf: 'stretch' }}>
            <View style={{ flex: 1, padding: 14, borderRadius: radii.lg, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderDefault, gap: 6 }}>
              <Txt style={{ fontSize: 13, color: colors.textSecondary }}>Bắt đầu</Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Txt style={{ flex: 1, fontSize: 17, fontWeight: '600', fontVariant: ['tabular-nums'] }}>{clock(t.startAt)}</Txt>
                <Pressable onPress={() => shift(-5)} hitSlop={6} accessibilityLabel="Sớm hơn 5 phút" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: colors.bgSunken }}>
                  <Txt style={{ fontSize: 13, fontWeight: '600' }}>-5'</Txt>
                </Pressable>
                <Pressable onPress={() => shift(5)} hitSlop={6} accessibilityLabel="Muộn hơn 5 phút" style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, backgroundColor: colors.bgSunken }}>
                  <Txt style={{ fontSize: 13, fontWeight: '600' }}>+5'</Txt>
                </Pressable>
              </View>
            </View>
            <View style={{ flex: 1, padding: 14, borderRadius: radii.lg, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.borderDefault, gap: 6 }}>
              <Txt style={{ fontSize: 13, color: colors.textSecondary }}>Thức dậy</Txt>
              <Txt style={{ fontSize: 17, fontWeight: '600', color: colors.textMuted }}>-</Txt>
            </View>
          </View>
        ) : (
          <View style={{ alignSelf: 'stretch', gap: 8, alignItems: 'center' }}>
            <Txt style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary }}>Bé ngủ từ lúc nào?</Txt>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[[0, 'Vừa xong'], [10, '10 phút trước'], [20, '20 phút trước'], [30, '30 phút trước']].map(([m, l]) => (
                <Chip key={m as number} active={startOffset === m} onPress={() => setStartOffset(m as number)}>{l as string}</Chip>
              ))}
            </View>
          </View>
        )}

        <Txt style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 18, maxWidth: 320 }}>
          Muby tính tổng giờ ngủ trong ngày và dùng nó cho dự báo leap.
        </Txt>
        <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 8 }}>
          {t ? (
            <>
              <ButtonPrimary onPress={wake}>Bé dậy rồi</ButtonPrimary>
              <ButtonText onPress={() => { ctx.setTimer(null); ctx.back(); ctx.toast('Đã huỷ giấc này'); }} style={{ alignSelf: 'center' }}>Huỷ giấc này</ButtonText>
            </>
          ) : (
            <ButtonPrimary onPress={start}>Bắt đầu đếm giờ ngủ</ButtonPrimary>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
