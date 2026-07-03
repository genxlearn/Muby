/* ============================================================
   SCREEN 2 — Quick Log Sheet · 2B — Soothing Sheet
   ============================================================ */
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Chip, Ic, Sheet } from '../components';
import * as D from '../data/sampleData';
import { BongFace, Emotion, Onesie } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

const TILES: { id: string; emo: Emotion; onesie: Onesie; label: string; sub: string; icon: string }[] = [
  { id: 'feed', emo: 'eating', onesie: 'orange', label: 'Cữ ăn', sub: '80ml', icon: '🍼' },
  { id: 'sleep', emo: 'sleeping', onesie: 'lavender', label: 'Giấc ngủ', sub: 'bây giờ', icon: '🌙' },
  { id: 'diaper', emo: 'happy', onesie: 'sage', label: 'Tã', sub: 'Ướt', icon: '💧' },
  { id: 'mood', emo: 'blissful', onesie: 'cream', label: 'Cảm xúc', sub: '', icon: '💛' },
  { id: 'soothe', emo: 'snug', onesie: 'lavender', label: 'Dỗ bé', sub: '', icon: '🎵' },
  { id: 'play', emo: 'curious', onesie: 'orange', label: 'Sunny Play', sub: '', icon: '🌼' },
];

export function QuickLogSheet({ open }: { open: boolean }) {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const tap = (t: (typeof TILES)[number]) => {
    if (t.id === 'soothe') { ctx.openSheet('soothing'); return; }
    if (t.id === 'play') { ctx.closeSheet(); ctx.setTab('leap'); return; }
    ctx.closeSheet();
    ctx.toast(`Đã ghi ${t.label.toLowerCase()} rồi. Bạn đang làm rất tốt ❤️`);
  };
  return (
    <Sheet open={open} onClose={ctx.closeSheet} height="66%" title="Ghi nhanh" sub="Một chạm là xong. Không cần điền gì thêm.">
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11, marginTop: 8 }}>
        {TILES.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => tap(t)}
            style={({ pressed }) => ({
              flexBasis: '31%',
              flexGrow: 1,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              backgroundColor: colors.bgSunken,
              borderRadius: radii.lg,
              borderWidth: 1.5,
              borderColor: colors.borderSubtle,
              transform: [{ scale: pressed ? 0.94 : 1 }],
            })}
          >
            <BongFace emotion={t.emo} size={48} />
            <Txt style={{ fontSize: 13.5, fontWeight: '700', color: colors.textPrimary, marginTop: 4 }}>{t.label}</Txt>
            {t.sub ? <Txt style={{ fontSize: 11.5, color: colors.textMuted, fontWeight: '600' }}>{t.sub}</Txt> : null}
          </Pressable>
        ))}
      </View>
    </Sheet>
  );
}

/** Static volume track (visual only — no slider dependency). */
function VolumeTrack({ disabled }: { disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, height: 20, justifyContent: 'center' }}>
      <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.borderDefault }}>
        <View style={{ width: '60%', height: 4, borderRadius: 2, backgroundColor: disabled ? colors.borderDefault : colors.accentPrimary }} />
      </View>
      <View style={{ position: 'absolute', left: '58%', width: 14, height: 14, borderRadius: 7, backgroundColor: disabled ? colors.borderDefault : colors.accentPrimary }} />
    </View>
  );
}

export function SoothingSheet({ open }: { open: boolean }) {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const [playing, setPlaying] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [bg, setBg] = useState(true);
  const tintColor = (key: string) =>
    key === 'intensity4' ? colors.intensity[4] : key === 'intensity1' ? colors.intensity[1] : colors.accentSoftBg;
  return (
    <Sheet open={open} onClose={ctx.closeSheet} height="82%" title="Hộp công cụ dỗ bé" sub="Không cần mạng 💤">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 13, paddingBottom: 6, marginTop: 4 }}>
        {D.SOOTHING.map((s) => {
          const locked = s.premium && !ctx.premium && ctx.intensity < 4;
          const isOn = playing === s.id;
          return (
            <View key={s.id} style={{ width: 150, borderRadius: radii.lg, overflow: 'hidden', backgroundColor: colors.bgSunken, borderWidth: 1, borderColor: colors.borderSubtle }}>
              <View style={{ height: 86, backgroundColor: tintColor(s.tintKey), alignItems: 'center', justifyContent: 'center' }}>
                <Txt style={{ fontSize: 38 }}>{s.emoji}</Txt>
                {locked ? (
                  <View style={{ position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: 'rgba(42,26,20,0.55)', borderRadius: 999, paddingVertical: 3, paddingHorizontal: 9 }}>
                    <Ic name="lock" size={11} sw={2.4} color="#fff" />
                    <Txt style={{ color: '#fff', fontSize: 10.5, fontWeight: '700' }}>Premium</Txt>
                  </View>
                ) : null}
              </View>
              <View style={{ paddingTop: 12, paddingHorizontal: 13, paddingBottom: 14 }}>
                <Txt style={{ fontSize: 14.5, fontWeight: '700' }}>{s.name}</Txt>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <Pressable
                    onPress={() => (locked ? ctx.openPaywall('Mở khóa âm thanh dỗ bé') : setPlaying(isOn ? null : s.id))}
                    style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: locked ? colors.borderDefault : colors.accentPrimary, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Ic name={locked ? 'lock' : isOn ? 'pause' : 'play'} size={20} color={locked ? colors.textMuted : colors.textOnAccent} />
                  </Pressable>
                  <VolumeTrack disabled={locked} />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Txt style={{ marginTop: 22, fontSize: 13.5, fontWeight: '700', color: colors.textSecondary, marginBottom: 10 }}>Hẹn giờ tắt</Txt>
      <View style={{ flexDirection: 'row', gap: 9 }}>
        {[15, 30, 45, 60].map((t) => (
          <Chip key={t} active={timer === t} onPress={() => setTimer(t)} style={{ flex: 1 }}>{`${t}p`}</Chip>
        ))}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: colors.bgSunken, borderRadius: radii.md }}>
        <Txt style={{ fontSize: 14.5, fontWeight: '600' }}>Chạy nền khi tắt màn hình</Txt>
        <Pressable onPress={() => setBg((b) => !b)} style={{ width: 50, height: 30, borderRadius: 999, backgroundColor: bg ? colors.accentPrimary : colors.borderDefault, justifyContent: 'center' }}>
          <View style={{ position: 'absolute', top: 3, left: bg ? 23 : 3, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' }} />
        </Pressable>
      </View>
    </Sheet>
  );
}
