/* ============================================================
   SCREEN 2 — Quick Log Sheet · 2B — Soothing Sheet — Muby UI v2.0
   Figma: B3 (Ghi nhanh) · B4 (chọn chi tiết) · B5 (Hộp dỗ bé).
   Two taps: pick a category tile → pick a detail. No forms.
   ============================================================ */
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ButtonText, ButtonTonal, Chip, Ic, IconTile, Sheet, tileColors, Toggle } from '../components';
import type { IconName, TileTone } from '../components';
import * as D from '../data/sampleData';
import { BongFace, Emotion } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

type TileId = 'feed' | 'sleep' | 'diaper' | 'more';
const TILES: { id: TileId; tone: TileTone; icon: IconName; label: string; sub: string }[] = [
  { id: 'feed', tone: 'feed', icon: 'bottle', label: 'Cữ ăn', sub: 'Bú mẹ, bình sữa' },
  { id: 'sleep', tone: 'sleep', icon: 'moon', label: 'Giấc ngủ', sub: 'Ngủ trưa, ngủ đêm' },
  { id: 'diaper', tone: 'diaper', icon: 'diaper', label: 'Tã', sub: 'Ướt hay bẩn' },
  { id: 'more', tone: 'neutral', icon: 'more', label: 'Khác', sub: 'Cảm xúc, dỗ bé' },
];

/* second-tap detail options per category */
const LOG_OPTS: Record<'feed' | 'sleep' | 'diaper', { title: string; q: string; opts: string[] }> = {
  feed: { title: 'Cữ ăn', q: 'Bé ăn bao nhiêu?', opts: ['60 ml', '80 ml', '100 ml', '120 ml', 'Bú mẹ'] },
  sleep: { title: 'Giấc ngủ', q: 'Bé ngủ từ khi nào?', opts: ['Bắt đầu bây giờ', '15 phút trước', '30 phút trước', '1 giờ trước', 'Vừa thức dậy'] },
  diaper: { title: 'Tã', q: 'Tã của bé thế nào?', opts: ['Ướt', 'Bẩn', 'Cả hai'] },
};
const MOODS: [Emotion, string][] = [
  ['blissful', 'Vui lắm'],
  ['happy', 'Thoải mái'],
  ['uncertain', 'Hơi khó'],
  ['fussy', 'Cáu kỉnh'],
  ['crying', 'Khóc nhiều'],
];
const REPEAT: { tone: TileTone; icon: IconName; title: string; sub: string; label: string; val: string }[] = [
  { tone: 'feed', icon: 'bottle', title: 'Bình sữa · 120 ml', sub: 'Lần trước 08:15', label: 'cữ ăn', val: '120 ml' },
  { tone: 'diaper', icon: 'diaper', title: 'Tã · Ướt', sub: 'Lần trước 06:10', label: 'tã', val: 'ướt' },
];

export function QuickLogSheet({ open }: { open: boolean }) {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [detail, setDetail] = useState<TileId | null>(null);
  useEffect(() => {
    if (!open) setDetail(null);
  }, [open]);

  const save = (label: string, val: string) => {
    ctx.closeSheet();
    ctx.toast(`Đã ghi ${label} · ${val}. Bạn đang làm rất tốt ❤️`);
  };
  const OD = detail && detail !== 'more' ? LOG_OPTS[detail] : undefined;

  return (
    <Sheet
      open={open}
      onClose={ctx.closeSheet}
      height="74%"
      title={detail ? (OD ? OD.q : 'Ghi thêm') : 'Ghi cho bé'}
      sub={detail ? 'Chọn một ô là xong — không cần điền gì thêm.' : 'Chọn một mục, rồi chọn chi tiết. Hai chạm là xong.'}
    >
      {!detail ? (
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {TILES.map((t) => {
              const [bg, fg] = tileColors(colors, t.tone);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setDetail(t.id)}
                  accessibilityLabel={t.label}
                  style={({ pressed }) => ({
                    flexBasis: '46%',
                    flexGrow: 1,
                    height: 146,
                    padding: 20,
                    borderRadius: radii.xl,
                    backgroundColor: t.tone === 'neutral' ? colors.bgSunken : bg,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
                    <Ic name={t.icon} size={24} color={fg} />
                  </View>
                  <View style={{ flex: 1 }} />
                  <Txt style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>{t.label}</Txt>
                  <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{t.sub}</Txt>
                </Pressable>
              );
            })}
          </View>
          <Txt style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginTop: 4 }}>Ghi lại lần trước</Txt>
          {REPEAT.map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconTile tone={r.tone} icon={r.icon} />
              <View style={{ flex: 1 }}>
                <Txt style={{ fontSize: 15, fontWeight: '600' }}>{r.title}</Txt>
                <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{r.sub}</Txt>
              </View>
              <ButtonTonal onPress={() => save(r.label, r.val)}>Ghi</ButtonTonal>
            </View>
          ))}
        </View>
      ) : null}

      {OD ? (
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {OD.opts.map((o) => (
              <Pressable
                key={o}
                onPress={() => save(OD.title.toLowerCase(), o)}
                style={({ pressed }) => ({
                  flexBasis: '46%',
                  flexGrow: 1,
                  minHeight: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: radii.lg,
                  backgroundColor: pressed ? colors.accentSoftBg : colors.bgSunken,
                  borderWidth: pressed ? 1.5 : 0,
                  borderColor: colors.accentPrimary,
                })}
              >
                <Txt style={{ fontSize: 17, fontWeight: '600', color: colors.textPrimary }}>{o}</Txt>
              </Pressable>
            ))}
          </View>
          <ButtonText onPress={() => setDetail(null)} style={{ alignSelf: 'center', marginTop: 4 }}>← Quay lại</ButtonText>
        </View>
      ) : null}

      {detail === 'more' ? (
        <View style={{ gap: 16 }}>
          <Txt style={{ fontSize: 15, fontWeight: '600' }}>Hôm nay bé thế nào?</Txt>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'space-between' }}>
            {MOODS.map(([emo, label]) => (
              <Pressable
                key={emo}
                onPress={() => save('cảm xúc', label.toLowerCase())}
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: 'center',
                  gap: 6,
                  paddingVertical: 12,
                  paddingHorizontal: 2,
                  minHeight: 88,
                  borderRadius: radii.lg,
                  backgroundColor: pressed ? colors.accentSoftBg : colors.bgSunken,
                })}
              >
                <BongFace emotion={emo} size={40} />
                <Txt numberOfLines={1} style={{ fontSize: 11, fontWeight: '600', color: colors.textPrimary }}>{label}</Txt>
              </Pressable>
            ))}
          </View>
          {[
            { tone: 'sleep' as TileTone, icon: 'music' as IconName, title: 'Dỗ bé', sub: 'Tiếng ồn trắng, mưa, nhịp tim', go: () => ctx.openSheet('soothing') },
            { tone: 'diaper' as TileTone, icon: 'sun' as IconName, title: 'Sunny Play', sub: 'Trò chơi đúng kỹ năng bé đang học', go: () => { ctx.closeSheet(); ctx.setTab('leap'); } },
          ].map((r) => (
            <Pressable key={r.title} onPress={r.go} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <IconTile tone={r.tone} icon={r.icon} />
              <View style={{ flex: 1 }}>
                <Txt style={{ fontSize: 15, fontWeight: '600' }}>{r.title}</Txt>
                <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{r.sub}</Txt>
              </View>
              <Ic name="chevron" size={20} color={colors.textSecondary} />
            </Pressable>
          ))}
          <ButtonText onPress={() => setDetail(null)} style={{ alignSelf: 'center' }}>← Quay lại</ButtonText>
        </View>
      ) : null}
    </Sheet>
  );
}

/** Static volume track (visual only — no slider dependency). */
function VolumeTrack({ disabled, on }: { disabled?: boolean; on?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.bgElevated, overflow: 'hidden' }}>
      <View style={{ width: on && !disabled ? '60%' : '0%', height: 4, borderRadius: 2, backgroundColor: colors.accentPrimary }} />
    </View>
  );
}

export function SoothingSheet({ open }: { open: boolean }) {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [playing, setPlaying] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [bg, setBg] = useState(true);
  const TINT: Record<string, [string, IconName]> = {
    shh: [colors.activity.sleep.bg, 'cloud'],
    rain: [colors.activity.diaper.bg, 'music'],
    stream: [colors.bgAccentSoft, 'heart'],
  };
  return (
    <Sheet open={open} onClose={ctx.closeSheet} height="78%" title="Hộp công cụ dỗ bé" sub="Không cần mạng 💤">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 6 }}>
        {D.SOOTHING.map((s) => {
          const locked = s.premium && !ctx.premium && ctx.intensity < 4;
          const isOn = playing === s.id;
          const [tint, icon] = TINT[s.id] || [colors.bgSunken, 'music'];
          return (
            <View key={s.id} style={{ width: 156, padding: 14, gap: 12, borderRadius: radii.xl - 4, backgroundColor: tint }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgElevated, alignItems: 'center', justifyContent: 'center' }}>
                  <Ic name={icon} size={20} color={colors.textPrimary} />
                </View>
                {locked ? (
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.sm, backgroundColor: colors.aiTonal }}>
                    <Txt style={{ fontSize: 12, fontWeight: '500', color: colors.aiText }}>Premium</Txt>
                  </View>
                ) : null}
              </View>
              <Txt style={{ fontSize: 17, fontWeight: '600' }}>{s.name}</Txt>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable
                  onPress={() => (locked ? ctx.openPaywall('Mở khóa âm thanh dỗ bé') : setPlaying(isOn ? null : s.id))}
                  accessibilityLabel={locked ? 'Mở khóa' : isOn ? 'Tạm dừng' : 'Phát'}
                  style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: locked ? colors.borderDefault : colors.accentPrimary, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Ic name={locked ? 'lock' : isOn ? 'pause' : 'play'} size={18} sw={2} color={locked ? colors.textSecondary : colors.textOnAccent} />
                </Pressable>
                <VolumeTrack disabled={locked} on={isOn} />
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Txt style={{ marginTop: 22, fontSize: 17, fontWeight: '600', color: colors.textPrimary, marginBottom: 10 }}>Hẹn giờ tắt</Txt>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[15, 30, 45, 60].map((t) => (
          <Chip key={t} active={timer === t} onPress={() => setTimer(t)} style={{ flex: 1 }}>{`${t} phút`}</Chip>
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 }}>
        <IconTile tone="sleep" icon="moon" />
        <View style={{ flex: 1 }}>
          <Txt style={{ fontSize: 15, fontWeight: '600' }}>Chạy nền khi tắt màn hình</Txt>
          <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>Phát tiếp khi khoá máy</Txt>
        </View>
        <Toggle on={bg} onPress={() => setBg((b) => !b)} />
      </View>
    </Sheet>
  );
}
