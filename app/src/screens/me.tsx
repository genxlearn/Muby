/* ============================================================
   SCREEN 9A Notifications · 9B Profile/Me · Premium Paywall
   · Market tab (Coming Soon)
   Ported from project/screens/me.jsx (Muby App Final).
   ============================================================ */
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  AppBar,
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  Card,
  EmptyState,
  Ic,
  Input,
  NAV_CLEARANCE,
  Sheet,
  Toggle,
} from '../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import * as D from '../data/sampleData';
import { formatDobDisplay, parseDobInput } from '../data/leapEngine';
import { Bong, BongFace } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

/* ============================================================
   9A — NOTIFICATIONS
   ============================================================ */
function NotifGroup({ title, items }: { title: string; items: D.Notif[] }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Txt style={{ fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginTop: 4, marginBottom: 8, marginHorizontal: 2 }}>
        {title}
      </Txt>
      <Card pad={6}>
        {items.map((nt, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              gap: 12,
              alignItems: 'flex-start',
              paddingVertical: 13,
              paddingHorizontal: 8,
              borderTopWidth: i ? 1 : 0,
              borderTopColor: colors.borderSubtle,
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.bgSunken, alignItems: 'center', justifyContent: 'center' }}>
              <Txt style={{ fontSize: 19 }}>{nt.icon}</Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontSize: 14, lineHeight: 20, color: colors.textPrimary }}>{nt.text}</Txt>
              <Txt style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{nt.time}</Txt>
            </View>
            {nt.unread ? (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentPrimary, marginTop: 6 }} />
            ) : null}
          </View>
        ))}
      </Card>
    </View>
  );
}

export function NotificationsScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  const { NOTIFS } = D;
  const empty = NOTIFS.today.length === 0 && NOTIFS.earlier.length === 0;
  return (
    <View style={{ flex: 1 }}>
      <AppBar title="Thông báo" onBack={ctx.back} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 }}>
        {empty ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <EmptyState emotion="happy" onesie="orange" heading="Hết rồi" helper="Dành chút thời gian cho mama nhé ☕" />
          </View>
        ) : (
          <>
            {NOTIFS.today.length > 0 ? <NotifGroup title="Hôm nay" items={NOTIFS.today} /> : null}
            {NOTIFS.earlier.length > 0 ? <NotifGroup title="Trước đó" items={NOTIFS.earlier} /> : null}
            <Txt style={{ textAlign: 'center', paddingVertical: 16, color: colors.textMuted, fontSize: 13 }}>
              Hết rồi. Dành chút thời gian cho mama nhé ☕
            </Txt>
          </>
        )}
      </ScrollView>
    </View>
  );
}

/* ============================================================
   Settings row helpers
   ============================================================ */
function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 24 }}>
      <Txt style={{ fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginTop: 4, marginBottom: 8, marginHorizontal: 2, letterSpacing: 0.3 }}>
        {title}
      </Txt>
      <Card pad={6}>{children}</Card>
    </View>
  );
}

function SettingRow({
  icon,
  label,
  sub,
  right,
  first = false,
  onPress,
}: {
  icon: string;
  label: string;
  sub?: string;
  right?: React.ReactNode;
  first?: boolean;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const rowStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 48,
    borderTopWidth: first ? 0 : 1,
    borderTopColor: colors.borderSubtle,
  };
  const content = (
    <>
      <Txt style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{icon}</Txt>
      <View style={{ flex: 1 }}>
        <Txt style={{ fontSize: 15, fontWeight: '500', color: colors.textPrimary }}>{label}</Txt>
        {sub ? <Txt style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 1 }}>{sub}</Txt> : null}
      </View>
      {right}
    </>
  );
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}>
        {content}
      </Pressable>
    );
  }
  return <View style={rowStyle}>{content}</View>;
}

/* ============================================================
   9B — PROFILE / ME
   ============================================================ */
export function MeScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const auth = useAuth();
  const { baby, displayName, state: st, saveBaby } = useBaby();
  const [reminders, setReminders] = useState(true);
  const [sheet, setSheet] = useState<null | 'baby' | 'invite' | 'units' | 'terms'>(null);
  const [units, setUnits] = useState('kg · cm');
  const [inviteMail, setInviteMail] = useState('');
  const [babyName, setBabyName] = useState(displayName);
  const [babyDob, setBabyDob] = useState(baby ? formatDobDisplay(baby.dob) : '');
  const dark = ctx.theme === 'dark';
  const dobOk = parseDobInput(babyDob);

  const openBabySheet = () => {
    setBabyName(baby?.name || displayName);
    setBabyDob(baby ? formatDobDisplay(baby.dob) : '');
    setSheet('baby');
  };

  const saveBabySheet = async () => {
    const dobIso = parseDobInput(babyDob);
    if (!dobIso) return;
    await saveBaby({ name: babyName.trim(), dob: dobIso, gender: baby?.gender ?? '' });
    setSheet(null);
    ctx.toast('Đã lưu thông tin bé 💚');
  };

  const logout = async () => {
    await auth.signOut();
    ctx.goFlow('auth', { authStep: 'A1' });
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 20, paddingBottom: 44 }}>
      <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>Mama & Bống</Txt>

      {/* Premium / trial state */}
      {ctx.purchased ? (
        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 11, paddingHorizontal: 16, minHeight: 44, borderRadius: 999, backgroundColor: colors.accentSoftBg, marginBottom: 24 }}>
          <Ic name="check" size={17} sw={2.6} color={colors.accentPrimary} />
          <Txt style={{ fontWeight: '700', fontSize: 14, color: colors.textPrimary }}>Wonder Premium ✓</Txt>
        </View>
      ) : ctx.trial ? (
        <Card pad={16} style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Txt style={{ fontSize: 20 }}>✨</Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>Đang dùng thử Premium</Txt>
              <Txt style={{ fontSize: 12.5, color: colors.textMuted, marginTop: 2 }}>Còn {ctx.trial.daysLeft} ngày · sau đó trừ 199.000đ nếu không hủy</Txt>
            </View>
            <Pressable
              onPress={() => { ctx.cancelTrial(); ctx.toast('Đã hủy dùng thử. Bạn vẫn dùng bản Free thoải mái 💛'); }}
              style={{ paddingVertical: 11, paddingHorizontal: 15, minHeight: 44, justifyContent: 'center', borderRadius: 999, backgroundColor: colors.bgSunken, borderWidth: 1, borderColor: colors.borderDefault }}
            >
              <Txt style={{ fontWeight: '700', fontSize: 13, color: colors.textSecondary }}>Hủy dùng thử</Txt>
            </Pressable>
          </View>
        </Card>
      ) : (
        <View style={{ borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.textPrimary, padding: 20, marginBottom: 24 }}>
          <View style={{ position: 'absolute', right: 12, bottom: 0 }}>
            <Bong emotion="excited" onesie="orange" size={92} />
          </View>
          <Txt serif style={{ fontSize: 22, fontWeight: '600', color: colors.bgCanvas }}>Wonder Premium</Txt>
          <Txt style={{ fontSize: 13.5, color: colors.bgCanvas, opacity: 0.7, marginTop: 4, fontWeight: '600' }}>199.000đ · Một lần · Trọn đời</Txt>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {['10 leaps đầy đủ', 'Sunny Play', '3 tiếng ồn trắng', 'Đồng bộ gia đình'].map((p) => (
              <View key={p} style={{ backgroundColor: colors.bgCanvas + '33', borderWidth: 1, borderColor: colors.bgCanvas + '4D', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 }}>
                <Txt style={{ fontSize: 11.5, fontWeight: '600', color: colors.bgCanvas }}>{p}</Txt>
              </View>
            ))}
          </View>
          <Pressable
            onPress={() => ctx.openPaywall('Mở khóa Wonder Premium')}
            style={{ alignSelf: 'flex-start', marginTop: 16, paddingVertical: 13, paddingHorizontal: 22, minHeight: 48, justifyContent: 'center', borderRadius: 999, backgroundColor: colors.accentPrimary }}
          >
            <Txt style={{ fontWeight: '700', fontSize: 15, color: '#fff' }}>Dùng thử miễn phí 1 tháng</Txt>
          </Pressable>
          <Txt style={{ fontSize: 11.5, color: colors.bgCanvas, opacity: 0.55, marginTop: 12 }}>
            Miễn phí 1 tháng đầu — hủy lúc nào cũng được. Không hủy: 199.000đ một lần, trọn đời.
          </Txt>
        </View>
      )}

      {/* Baby card */}
      <Card pad={16} style={{ marginBottom: 24 }}>
        <Pressable onPress={openBabySheet} style={({ pressed }) => [{ flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.7 : 1 }]}>
          <BongFace emotion="happy" size={54} ring />
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: 17, fontWeight: '700', color: colors.textPrimary }}>{displayName}</Txt>
            <Txt style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>{(baby?.gender || 'Chưa rõ')} · {st.ageLabel}</Txt>
          </View>
          <Ic name="chevron" size={18} color={colors.textMuted} />
        </Pressable>
      </Card>

      {/* Caregivers */}
      <SettingsGroup title="Người chăm bé">
        <SettingRow first icon="👩" label="Mama (bạn)" sub="Chủ tài khoản" />
        <SettingRow icon="➕" label="Mời bố vào cùng" sub="Đồng bộ mọi ghi chép" onPress={() => setSheet('invite')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
      </SettingsGroup>

      {/* Display */}
      <SettingsGroup title="Hiển thị">
        <SettingRow first icon="🌙" label="Chế độ tối" sub="Luôn miễn phí" right={<Toggle on={dark} onPress={() => ctx.setTheme(dark ? 'light' : 'dark')} />} />
      </SettingsGroup>

      {/* Info & reminders */}
      <SettingsGroup title="Thông tin & Nhắc">
        <SettingRow first icon="🔔" label="Nhắc nhẹ nhàng" sub="Cữ ăn, giấc ngủ" right={<Toggle on={reminders} onPress={() => setReminders((r) => !r)} />} />
        <SettingRow icon="📏" label="Đơn vị đo" sub={units} onPress={() => setSheet('units')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
      </SettingsGroup>

      {/* About */}
      <SettingsGroup title="Về Baby Wonder Weeks">
        <SettingRow first icon="💛" label="Đánh giá ứng dụng" onPress={() => ctx.toast('Cảm ơn mama! Chờ chút để mở App Store nhé 💛')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
        <SettingRow icon="📄" label="Điều khoản & Quyền riêng tư" onPress={() => setSheet('terms')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
      </SettingsGroup>

      <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
        <Pressable onPress={logout} style={{ padding: 10 }}>
          <Txt style={{ color: colors.danger, fontWeight: '600', fontSize: 14.5 }}>Đăng xuất</Txt>
        </Pressable>
      </View>
      <Pressable onPress={() => ctx.go('designsystem')} style={{ alignSelf: 'center', padding: 6 }}>
        <Txt style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12 }}>Baby Wonder Weeks v3 · 1.0.0</Txt>
      </Pressable>
    </ScrollView>

    {/* --- Sheets --- */}
    <Sheet open={sheet === 'baby'} onClose={() => setSheet(null)} height="52%" title={displayName} sub="Thông tin bé">
      <View style={{ gap: 14, paddingTop: 6 }}>
        <View style={{ alignItems: 'center' }}>
          <BongFace emotion="happy" size={72} ring />
        </View>
        <Input label="Tên bé" value={babyName} onChange={setBabyName} placeholder="VD: Bống" />
        <Input
          label="Ngày sinh"
          value={babyDob}
          onChange={setBabyDob}
          type="tel"
          placeholder="DD/MM/YYYY"
          error={babyDob.length >= 8 && !dobOk ? 'Ngày sinh chưa đúng — nhập dạng DD/MM/YYYY nhé' : ''}
        />
        <ButtonPrimary disabled={!dobOk} onPress={saveBabySheet}>Lưu thay đổi</ButtonPrimary>
      </View>
    </Sheet>

    <Sheet open={sheet === 'invite'} onClose={() => setSheet(null)} height="46%" title="Mời bố vào cùng" sub="Bố cũng thấy mọi ghi chép, dự báo của bé">
      <View style={{ gap: 14, paddingTop: 6 }}>
        <Input label="Email của bố" type="email" placeholder="bo@email.com" value={inviteMail} onChange={setInviteMail} />
        <ButtonPrimary
          disabled={!inviteMail.includes('@')}
          onPress={() => { setSheet(null); setInviteMail(''); ctx.toast('Đã gửi lời mời tới bố 💛'); }}
        >
          Gửi lời mời
        </ButtonPrimary>
        <ButtonText onPress={() => setSheet(null)} style={{ alignSelf: 'center' }} textStyle={{ textAlign: 'center' }}>
          Để sau cũng được
        </ButtonText>
      </View>
    </Sheet>

    <Sheet open={sheet === 'units'} onClose={() => setSheet(null)} height="38%" title="Đơn vị đo">
      <View style={{ gap: 10, paddingTop: 6 }}>
        {['kg · cm', 'lb · in'].map((u) => (
          <Pressable
            key={u}
            onPress={() => { setUnits(u); setSheet(null); ctx.toast('Đã đổi đơn vị đo'); }}
            style={({ pressed }) => [
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 15,
                paddingHorizontal: 16,
                minHeight: 52,
                borderRadius: radii.md,
                backgroundColor: units === u ? colors.bgAccentSoft : colors.bgSunken,
                borderWidth: 1.5,
                borderColor: units === u ? colors.accentPrimary : 'transparent',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Txt style={{ fontSize: 15, fontWeight: '600', color: colors.textPrimary }}>{u}</Txt>
            {units === u ? <Ic name="check" size={19} sw={2.4} color={colors.accentPrimary} /> : null}
          </Pressable>
        ))}
      </View>
    </Sheet>

    <Sheet open={sheet === 'terms'} onClose={() => setSheet(null)} height="62%" title="Điều khoản & Quyền riêng tư">
      <View style={{ gap: 12, paddingTop: 4 }}>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Dữ liệu của bé là của bạn.</Txt> Mọi ghi chép (cữ ăn, giấc ngủ, đo lường, ảnh) thuộc về bạn mãi mãi — kể cả khi không dùng Premium.
        </Txt>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Không bán dữ liệu.</Txt> Chúng mình không chia sẻ thông tin của bạn và bé cho bên thứ ba.
        </Txt>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Nội dung tham khảo.</Txt> Dự báo leap và gợi ý EASY mang tính tham khảo, không thay thế tư vấn y khoa. Khi lo lắng về sức khoẻ của bé, hãy hỏi bác sĩ nhi.
        </Txt>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Premium một lần.</Txt> 199.000đ trọn đời. Không tự gia hạn, không phí ẩn.
        </Txt>
      </View>
    </Sheet>
    </View>
  );
}

/* ============================================================
   PREMIUM PAYWALL (soft gate)
   ============================================================ */
const PAYWALL_BENEFITS: [string, string, string][] = [
  ['📖', '10 leaps đầy đủ', 'Dấu hiệu, mẹo & hoạt động cho từng leap'],
  ['🌼', 'Sunny Play từng bước', 'Hướng dẫn chi tiết cho mỗi hoạt động'],
  ['🌧️', '3 âm thanh dỗ bé', 'Mưa, suối & shh-shh, phát không cần mạng'],
  ['👨‍👩‍👧', 'Đồng bộ gia đình', 'Cả nhà cùng chăm bé trên một tài khoản'],
];

/** One "Continue with …" button for the store-account linking step. */
function LinkButton({
  label,
  icon,
  dark,
  onPress,
  busy,
}: {
  label: string;
  icon: 'apple' | 'google';
  dark?: boolean;
  onPress: () => void;
  busy?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={busy ? undefined : onPress}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          minHeight: 56,
          borderRadius: 999,
          backgroundColor: dark ? '#000000' : colors.bgElevated,
          borderWidth: dark ? 0 : 1.5,
          borderColor: colors.borderDefault,
          opacity: pressed || busy ? 0.7 : 1,
        },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={22} color={dark ? '#fff' : colors.textPrimary} />
      <Txt style={{ fontSize: 16, fontWeight: '700', color: dark ? '#fff' : colors.textPrimary }}>{label}</Txt>
    </Pressable>
  );
}

export function Paywall() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  // 'intro' → benefits + trial CTA · 'link' → connect Apple/Google before the trial starts
  const [step, setStep] = useState<'intro' | 'link'>('intro');
  const [linking, setLinking] = useState<null | 'apple' | 'google'>(null);

  // audit #16: never gate comfort when baby is crying (intensity >= 4).
  // Close in an effect (not during render) to avoid a setState-in-render warning.
  useEffect(() => {
    if (ctx.paywall && ctx.intensity >= 4) ctx.closePaywall();
  }, [ctx.paywall, ctx.intensity]);
  const open = !!ctx.paywall && ctx.intensity < 4;

  // reset to the first step whenever the sheet reopens
  useEffect(() => {
    if (open) {
      setStep('intro');
      setLinking(null);
    }
  }, [open]);

  const link = (provider: 'apple' | 'google') => {
    setLinking(provider);
    // Prototype: simulates the App Store / Play Store linking handshake.
    // Real IAP (StoreKit / Play Billing) needs a dev build — not Expo Go.
    setTimeout(() => {
      setLinking(null);
      ctx.startTrial();
      ctx.closePaywall();
      ctx.toast(`Đã liên kết ${provider === 'apple' ? 'Apple' : 'Google'} — dùng thử 1 tháng bắt đầu 💛`);
    }, 900);
  };

  return (
    <Sheet
      open={open}
      onClose={ctx.closePaywall}
      height="72%"
      title="Wonder Premium"
      sub={step === 'intro' ? 'Miễn phí 1 tháng đầu · 199.000đ trọn đời' : 'Liên kết để bắt đầu dùng thử'}
    >
      {step === 'intro' ? (
        <>
          <View style={{ alignItems: 'center', paddingTop: 4 }}>
            <Bong emotion="excited" onesie="orange" size={130} float />
            <Txt serif style={{ fontSize: 30, fontWeight: '600', color: colors.textPrimary, marginTop: 8 }}>199.000đ</Txt>
            <Txt style={{ fontSize: 13.5, color: colors.textMuted, marginTop: 2 }}>{ctx.paywall?.title || ''}</Txt>
          </View>

          <View style={{ gap: 10, marginTop: 20 }}>
            {PAYWALL_BENEFITS.map(([e, t, d], i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 4, paddingHorizontal: 2 }}>
                <View style={{ width: 42, height: 42, borderRadius: radii.md, backgroundColor: colors.bgSunken, alignItems: 'center', justifyContent: 'center' }}>
                  <Txt style={{ fontSize: 19 }}>{e}</Txt>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt style={{ fontSize: 14.5, fontWeight: '700', color: colors.textPrimary }}>{t}</Txt>
                  <Txt style={{ fontSize: 12.5, color: colors.textSecondary }}>{d}</Txt>
                </View>
              </View>
            ))}
          </View>

          <View style={{ gap: 10, marginTop: 22 }}>
            <ButtonPrimary onPress={() => setStep('link')}>Dùng thử miễn phí 1 tháng</ButtonPrimary>
            <ButtonText onPress={ctx.closePaywall} style={{ alignSelf: 'center' }} textStyle={{ textAlign: 'center' }}>
              Để sau
            </ButtonText>
          </View>

          <Txt style={{ textAlign: 'center', fontSize: 11.5, color: colors.textMuted, marginTop: 6, paddingBottom: 8, lineHeight: 17 }}>
            Không trừ tiền trong 1 tháng đầu. Nếu không hủy, sau 1 tháng sẽ trừ 199.000đ — một lần, trọn đời.
            Dữ liệu bé đã ghi luôn thuộc về bạn — mãi mãi.
          </Txt>
        </>
      ) : (
        <>
          <View style={{ alignItems: 'center', paddingTop: 4 }}>
            <Bong emotion="curious" onesie="cream" size={120} float />
            <Txt serif style={{ fontSize: 21, fontWeight: '600', color: colors.textPrimary, marginTop: 10, textAlign: 'center' }}>
              Liên kết tài khoản để bắt đầu
            </Txt>
            <Txt style={{ fontSize: 13.5, color: colors.textSecondary, marginTop: 6, textAlign: 'center', lineHeight: 20, maxWidth: 300 }}>
              Chọn tài khoản thanh toán của bạn. <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Không trừ tiền trong 1 tháng đầu</Txt> — hủy lúc nào cũng được trong màn Mama.
            </Txt>
          </View>

          <View style={{ gap: 12, marginTop: 24 }}>
            <LinkButton icon="apple" dark label={linking === 'apple' ? 'Đang liên kết…' : 'Tiếp tục với Apple'} busy={!!linking} onPress={() => link('apple')} />
            <LinkButton icon="google" label={linking === 'google' ? 'Đang liên kết…' : 'Tiếp tục với Google'} busy={!!linking} onPress={() => link('google')} />
          </View>

          <View style={{ marginTop: 18, padding: 14, borderRadius: radii.md, backgroundColor: colors.bgSunken, gap: 6 }}>
            {[
              ['🗓️', 'Hôm nay: bắt đầu 1 tháng miễn phí'],
              ['🔔', 'Trước khi hết hạn: mình sẽ nhắc bạn'],
              ['💛', 'Sau 1 tháng: trừ 199.000đ nếu bạn không hủy — trọn đời, không phí nào khác'],
            ].map(([e, t], i) => (
              <View key={i} style={{ flexDirection: 'row', gap: 9, alignItems: 'flex-start' }}>
                <Txt style={{ fontSize: 13 }}>{e}</Txt>
                <Txt style={{ flex: 1, fontSize: 12.5, color: colors.textSecondary, lineHeight: 18 }}>{t}</Txt>
              </View>
            ))}
          </View>

          <ButtonText onPress={() => setStep('intro')} style={{ alignSelf: 'center', marginTop: 10 }} textStyle={{ textAlign: 'center' }}>
            ← Quay lại
          </ButtonText>
        </>
      )}
    </Sheet>
  );
}

/* ============================================================
   MARKET TAB — Coming Soon (sau MVP)
   ============================================================ */
export function MarketScreen() {
  const { colors } = useTheme();
  const ctx = useApp();
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 20, paddingBottom: NAV_CLEARANCE }}>
      <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, marginBottom: 24 }}>Market</Txt>
      <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24, gap: 6 }}>
        <Bong emotion="curious" onesie="sage" size={160} float />
        <View style={{ marginTop: 16, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.bgAccentSoft }}>
          <Txt style={{ fontSize: 12.5, fontWeight: '700', letterSpacing: 0.5, color: colors.accentPrimary }}>SẮP RA MẮT</Txt>
        </View>
        <Txt serif style={{ fontSize: 22, fontWeight: '600', color: colors.textPrimary, marginTop: 10 }}>Đồ tốt cho mẹ & bé</Txt>
        <Txt style={{ fontSize: 14.5, color: colors.textSecondary, maxWidth: 260, textAlign: 'center', lineHeight: 22 }}>
          Mình đang chuẩn bị góc mua sắm nhỏ — chỉ những món thật sự hữu ích theo từng leap của bé.
        </Txt>
        <ButtonSecondary style={{ marginTop: 20 }} onPress={() => ctx.toast('Đã ghi nhớ. Mình sẽ báo bạn ngay khi mở nhé 💛')}>
          Báo mình khi mở nhé
        </ButtonSecondary>
      </View>
    </ScrollView>
  );
}
