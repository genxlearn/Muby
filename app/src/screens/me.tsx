/* ============================================================
   SCREEN 9A Notifications · 9B Profile/Me · Muby Premium Paywall
   Ported from project/screens/me.jsx (Muby v3).
   Premium is a reverse trial: 7 days open automatically at signup
   (no card, no auto-charge), then Free; unlock is a one-time
   199.000đ purchase via ctx.buyPremium().
   ============================================================ */
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonText,
  Card,
  DateField,
  EmptyState,
  Ic,
  Input,
  Sheet,
  Toggle,
} from '../components';
import { useAuth } from '../auth/AuthContext';
import * as D from '../data/sampleData';
import { formatDobDisplay, parseDobInput, parseDueDateInput } from '../data/leapEngine';
import { Bong, BongFace } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { DueDateField, DUE_WINDOW_DAYS } from './auth';

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
  const [sheet, setSheet] = useState<null | 'baby' | 'units' | 'terms'>(null);
  const [units, setUnits] = useState('kg · cm');
  const [babyName, setBabyName] = useState(displayName);
  const [babyDob, setBabyDob] = useState(baby ? formatDobDisplay(baby.dob) : '');
  const [babyDue, setBabyDue] = useState(baby?.dueDate ? formatDobDisplay(baby.dueDate) : '');
  const dark = ctx.theme === 'dark';
  const dobOk = parseDobInput(babyDob);
  const dueIso = parseDueDateInput(babyDue);
  const dueFar =
    !!dobOk && !!dueIso &&
    Math.abs(new Date(dueIso).getTime() - new Date(dobOk).getTime()) > DUE_WINDOW_DAYS * 86400000;
  const dueErr =
    babyDue.length >= 8 && !dueIso
      ? 'Ngày dự sinh chưa đúng — nhập dạng DD/MM/YYYY nhé'
      : dueFar
        ? 'Ngày dự sinh thường chỉ cách ngày sinh vài tuần — mama kiểm tra lại nhé'
        : '';

  const openBabySheet = () => {
    setBabyName(baby?.name || displayName);
    setBabyDob(baby ? formatDobDisplay(baby.dob) : '');
    setBabyDue(baby?.dueDate ? formatDobDisplay(baby.dueDate) : '');
    setSheet('baby');
  };

  const saveBabySheet = async () => {
    const dobIso = parseDobInput(babyDob);
    if (!dobIso) return;
    await saveBaby({
      name: babyName.trim(),
      dob: dobIso,
      gender: baby?.gender ?? '',
      dueDate: dueIso ?? undefined,
    });
    setSheet(null);
    ctx.toast('Đã lưu. Mọi dự báo đã tính lại theo bé 💚');
  };

  const toggleFaceId = async () => {
    const next = !auth.faceIdEnabled;
    const ok = await auth.setFaceIdEnabled(next);
    if (!ok) {
      ctx.toast('Chưa bật được Face ID — thử lại nhé.');
      return;
    }
    ctx.toast(next ? 'Đã bật Face ID 💚' : 'Đã tắt Face ID. Lần sau đăng nhập bằng mã SMS nhé.');
  };

  const logout = async () => {
    await auth.signOut();
    ctx.goFlow('auth', { authStep: 'A1' });
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 6, paddingHorizontal: 20, paddingBottom: 44 }}>
      <Txt serif style={{ fontSize: 24, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 }}>Mama & {displayName}</Txt>

      {/* Premium / trial state */}
      {ctx.purchased ? (
        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 11, paddingHorizontal: 16, minHeight: 44, borderRadius: 999, backgroundColor: colors.accentSoftBg, marginBottom: 24 }}>
          <Ic name="check" size={17} sw={2.6} color={colors.accentPrimary} />
          <Txt style={{ fontWeight: '700', fontSize: 14, color: colors.textPrimary }}>Muby Premium ✓</Txt>
        </View>
      ) : (
        <>
          {ctx.trial ? (
            <Banner icon="✨" style={{ marginBottom: 12 }}>
              <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
                7 ngày đầu: mọi thứ đang mở · còn <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>{ctx.trial.daysLeft} ngày</Txt> · sau đó về gói Miễn phí — không trừ tiền 💛
              </Txt>
            </Banner>
          ) : null}
          <View style={{ borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.textPrimary, padding: 20, marginBottom: 24 }}>
            <View style={{ position: 'absolute', right: 12, bottom: 0 }}>
              <Bong emotion="excited" onesie="orange" size={92} />
            </View>
            <Txt serif style={{ fontSize: 22, fontWeight: '600', color: colors.bgCanvas }}>Muby Premium</Txt>
            <Txt style={{ fontSize: 13.5, color: colors.bgCanvas, opacity: 0.7, marginTop: 4, fontWeight: '600' }}>199.000đ · Một lần · Trọn đời</Txt>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {['10 leaps đầy đủ', 'Sunny Play từng bước', '3 âm thanh dỗ bé', 'Đồng bộ gia đình (sắp có)'].map((p) => (
                <View key={p} style={{ backgroundColor: colors.bgCanvas + '33', borderWidth: 1, borderColor: colors.bgCanvas + '4D', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999 }}>
                  <Txt style={{ fontSize: 11.5, fontWeight: '600', color: colors.bgCanvas }}>{p}</Txt>
                </View>
              ))}
            </View>
            <Pressable
              onPress={() => ctx.openPaywall('Mở khóa Muby Premium')}
              style={{ alignSelf: 'flex-start', marginTop: 16, paddingVertical: 13, paddingHorizontal: 22, minHeight: 48, justifyContent: 'center', borderRadius: 999, backgroundColor: colors.accentPrimary }}
            >
              <Txt style={{ fontWeight: '700', fontSize: 15, color: '#fff' }}>Mở khóa trọn đời — 199.000đ</Txt>
            </Pressable>
            <Txt style={{ fontSize: 11.5, color: colors.bgCanvas, opacity: 0.55, marginTop: 12, maxWidth: 235 }}>
              Trả một lần. Không gia hạn. Không trừ tiền tự động.
            </Txt>
          </View>
        </>
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
        <SettingRow
          icon="➕"
          label="Mời bố vào cùng"
          sub="Đồng bộ gia đình — sắp có"
          onPress={() => ctx.toast('Sắp có rồi — mình sẽ báo mama ngay khi mở nhé 💛')}
          right={<Ic name="chevron" size={18} color={colors.textMuted} />}
        />
      </SettingsGroup>

      {/* Display */}
      <SettingsGroup title="Hiển thị">
        <SettingRow first icon="🌙" label="Chế độ tối" sub="Luôn miễn phí" right={<Toggle on={dark} onPress={() => ctx.setTheme(dark ? 'light' : 'dark')} />} />
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup title="Bảo mật">
        {auth.faceIdSupported ? (
          <SettingRow
            first
            icon="🙂"
            label="Đăng nhập bằng Face ID"
            sub="Vào nhanh, không cần chờ SMS"
            right={<Toggle on={auth.faceIdEnabled} onPress={toggleFaceId} />}
          />
        ) : (
          <SettingRow
            first
            icon="🙂"
            label="Đăng nhập bằng Face ID"
            sub="Thiết bị này chưa hỗ trợ Face ID / vân tay"
          />
        )}
      </SettingsGroup>

      {/* Info & reminders */}
      <SettingsGroup title="Thông tin & Nhắc">
        <SettingRow first icon="🔔" label="Nhắc nhẹ nhàng" sub="Từ chính ghi chép của bạn · báo trước leap" right={<Toggle on={reminders} onPress={() => setReminders((r) => !r)} />} />
        <SettingRow icon="📏" label="Đơn vị đo" sub={units} onPress={() => setSheet('units')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
      </SettingsGroup>

      {/* About */}
      <SettingsGroup title="Về Muby">
        <SettingRow first icon="💛" label="Đánh giá ứng dụng" onPress={() => ctx.toast('Cảm ơn mama! Chờ chút để mở App Store nhé 💛')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
        <SettingRow icon="📄" label="Điều khoản & Quyền riêng tư" onPress={() => setSheet('terms')} right={<Ic name="chevron" size={18} color={colors.textMuted} />} />
      </SettingsGroup>

      <View style={{ alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
        <Pressable onPress={logout} style={{ padding: 10 }}>
          <Txt style={{ color: colors.danger, fontWeight: '600', fontSize: 14.5 }}>Đăng xuất</Txt>
        </Pressable>
      </View>
      <Pressable onPress={() => ctx.go('designsystem')} style={{ alignSelf: 'center', padding: 6 }}>
        <Txt style={{ textAlign: 'center', color: colors.textMuted, fontSize: 12 }}>Muby · 1.0.0</Txt>
      </Pressable>
    </ScrollView>

    {/* --- Sheets --- */}
    <Sheet open={sheet === 'baby'} onClose={() => setSheet(null)} height="72%" title={displayName} sub="Thông tin bé">
      <View style={{ gap: 14, paddingTop: 6 }}>
        <View style={{ alignItems: 'center' }}>
          <BongFace emotion="happy" size={72} ring />
        </View>
        <Input label="Tên bé" value={babyName} onChange={setBabyName} placeholder="VD: Bống" />
        <DateField
          label="Ngày sinh"
          value={babyDob}
          onChange={setBabyDob}
          error={babyDob.length >= 8 && !dobOk ? 'Ngày sinh chưa hợp lệ — bé cần đã chào đời và dưới 5 tuổi nhé' : ''}
          minDate={new Date(Date.now() - 5 * 365 * 86400000)}
          maxDate={new Date()}
        />
        <DueDateField value={babyDue} onChange={setBabyDue} error={dueErr} anchorDob={dobOk} />
        <ButtonPrimary disabled={!dobOk || (babyDue.trim().length > 0 && !dueIso) || dueFar} onPress={saveBabySheet}>Lưu thay đổi</ButtonPrimary>
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
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Dữ liệu của bé là của bạn.</Txt> Mọi ghi chép (cữ ăn, giấc ngủ, đo lường, khoảnh khắc, ảnh) thuộc về bạn mãi mãi — kể cả khi không dùng Premium.
        </Txt>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Không bán dữ liệu.</Txt> Chúng mình không chia sẻ thông tin của bạn và bé cho bên thứ ba.
        </Txt>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Nội dung tham khảo.</Txt> Dự báo leap và gợi ý EASY mang tính tham khảo, không thay thế tư vấn y khoa. Khi lo lắng về sức khoẻ của bé, hãy hỏi bác sĩ nhi.
        </Txt>
        <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
          <Txt style={{ fontWeight: '700', color: colors.textPrimary }}>Muby Premium.</Txt> 7 ngày đầu sau đăng ký, mọi tính năng đều mở — không cần thẻ, không trừ tiền. Sau đó về gói Miễn phí. Premium là khoản mua một lần 199.000đ, trọn đời, không gia hạn.
        </Txt>
      </View>
    </Sheet>
    </View>
  );
}

/* ============================================================
   MUBY PREMIUM PAYWALL (one-time 199k)
   ============================================================ */
const PAYWALL_BENEFITS: [string, string, string][] = [
  ['📖', '10 leaps đầy đủ', 'Dấu hiệu, mẹo & cách đồng hành cho từng leap'],
  ['🌼', 'Sunny Play từng bước', 'Hướng dẫn chi tiết cho mỗi hoạt động'],
  ['🌧️', '3 âm thanh dỗ bé', 'Mưa, suối & shh-shh, phát không cần mạng'],
  ['👨‍👩‍👧', 'Đồng bộ gia đình', 'Sắp có — cả nhà cùng chăm bé'],
];

export function Paywall() {
  const { colors, radii } = useTheme();
  const ctx = useApp();

  // audit: never gate comfort when baby is crying (intensity >= 4).
  // Close in an effect (not during render) to avoid a setState-in-render warning.
  useEffect(() => {
    if (ctx.paywall && ctx.intensity >= 4) ctx.closePaywall();
  }, [ctx.paywall, ctx.intensity]);
  const open = !!ctx.paywall && ctx.intensity < 4;

  const buy = () => {
    ctx.buyPremium();
    ctx.closePaywall();
    ctx.toast('Muby Premium là của bạn mãi mãi 💛');
  };

  return (
    <Sheet open={open} onClose={ctx.closePaywall} height="76%" title="Muby Premium" sub="199.000đ · Một lần · Trọn đời">
      <View style={{ alignItems: 'center', paddingTop: 4 }}>
        <Bong emotion="excited" onesie="orange" size={124} float />
        <Txt style={{ fontSize: 13.5, color: colors.textMuted, marginTop: 8 }}>{ctx.paywall?.title || ''}</Txt>
      </View>

      <View style={{ gap: 10, marginTop: 18 }}>
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
        <ButtonPrimary onPress={buy}>Mở khóa trọn đời — 199.000đ</ButtonPrimary>
        <ButtonText onPress={ctx.closePaywall} style={{ alignSelf: 'center' }} textStyle={{ textAlign: 'center' }}>
          Để sau
        </ButtonText>
      </View>

      <Txt style={{ textAlign: 'center', fontSize: 11.5, color: colors.textMuted, marginTop: 8, paddingBottom: 8, lineHeight: 17 }}>
        Trả một lần. Không gia hạn. Không trừ tiền tự động. Kỷ niệm của bé luôn miễn phí.
      </Txt>
    </Sheet>
  );
}
