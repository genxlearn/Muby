/* ============================================================
   MUBY AUTH (A1 Welcome · A2 Phone · A3 OTP - passwordless)
   + ONBOARDING (OB1 Mừng mama · OB2 Thêm bé + ngày dự sinh)
   Wired to the real auth service (src/auth) and baby profile store.
   In demo mode the OTP code is shown inside the app (no SMS is sent).
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TextInputInstance,
  TextInputKeyPressEvent,
  View,
} from 'react-native';
import { AuthApi, useAuth } from '../auth/AuthContext';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonText,
  Chip,
  DateField,
  Ic,
  Input,
  ScreenGlow,
  Sheet,
} from '../components';
import { parseDobInput, parseDueDateInput } from '../data/leapEngine';
import { Bong } from '../mascot/Bong';
import { AppCtx, useApp } from '../navigation/AppContext';
import { hasBabyFor, useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { fontFamily } from '../theme/tokens';
import { Txt } from '../theme/Txt';

/* Shared state across auth steps (phone travels A2 → A3). */
interface AuthDraft {
  phone: string;
  demoCode: string | null;
}
type StepProps = {
  go: (s: string) => void;
  ctx: AppCtx;
  auth: AuthApi;
  draft: AuthDraft;
  setDraft: React.Dispatch<React.SetStateAction<AuthDraft>>;
};

/* ---- Scaffold: bg canvas + optional flowers + keyboard-aware scroll ---- */
function AuthScaffold({
  children,
  flowers = true,
}: {
  children: React.ReactNode;
  flowers?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bgCanvas }}>
      <ScreenGlow height={flowers ? 520 : 280} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const phoneOkRe = /^\d{9,10}$/;

/* ---- A1 Welcome ---- */
function A1({ go }: StepProps) {
  const { colors } = useTheme();
  return (
    <AuthScaffold>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 20 }}>
        <Bong emotion="happy" onesie="orange" size={184} float />
        <Txt serif style={{ fontSize: 48, lineHeight: 56, marginTop: 18, color: colors.textPrimary, textAlign: 'center' }}>
          Muby
        </Txt>
        <Txt serif italic style={{ fontSize: 20, color: colors.textBrand, marginTop: 4 }}>
          Mẹ hiểu bé
        </Txt>
        <Txt style={{ fontSize: 15.5, color: colors.textSecondary, marginTop: 16, maxWidth: 280, lineHeight: 23, textAlign: 'center' }}>
          Người chị thân thiết đồng hành cùng mama qua từng tuần của bé 💛
        </Txt>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
        <ButtonPrimary onPress={() => go('A2')}>Bắt đầu với số điện thoại</ButtonPrimary>
        <Txt style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 14 }}>Không cần mật khẩu · Dữ liệu của bé là của bạn</Txt>
      </View>
    </AuthScaffold>
  );
}

/* Terms & privacy content - same copy as the sheet in Mama. */
function TermsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { colors } = useTheme();
  const P = ({ b, t }: { b: string; t: string }) => (
    <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 22 }}>
      <Txt style={{ fontWeight: '600', color: colors.textPrimary }}>{b}</Txt> {t}
    </Txt>
  );
  return (
    <Sheet open={open} onClose={onClose} height="62%" title="Điều khoản & Quyền riêng tư">
      <View style={{ gap: 12, paddingTop: 4 }}>
        <P b="Dữ liệu của bé là của bạn." t="Mọi ghi chép (cữ ăn, giấc ngủ, đo lường, kỹ năng của bé) thuộc về bạn mãi mãi - kể cả khi không dùng Premium." />
        <P b="Không bán dữ liệu." t="Chúng mình không chia sẻ thông tin của bạn và bé cho bên thứ ba." />
        <P b="Nội dung tham khảo." t="Dự báo leap và gợi ý EASY mang tính tham khảo, không thay thế tư vấn y khoa. Khi lo lắng về sức khoẻ của bé, hãy hỏi bác sĩ nhi." />
        <P b="Muby Premium." t="7 ngày đầu sau đăng ký, mọi tính năng đều mở - không cần thẻ, không trừ tiền. Sau đó về gói Miễn phí. Premium là khoản mua một lần 199.000đ, trọn đời, không gia hạn." />
      </View>
    </Sheet>
  );
}

/* ---- A2 Phone entry (passwordless) ---- */
function A2({ go, ctx, auth, setDraft }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const phoneOk = phoneOkRe.test(phone.replace(/\s/g, ''));

  const submit = async () => {
    setBusy(true);
    try {
      const { demoCode } = await auth.sendOtp(phone);
      setDraft({ phone, demoCode: demoCode ?? null });
      go('A3');
    } catch (e: any) {
      ctx.toast(e?.message || 'Mạng lag chút xíu. Mình thử lại nhé.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScaffold flowers={false}>
      <AppBar title="" onBack={() => go('A1')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ marginTop: 8, marginBottom: 28 }}>
          <Txt serif style={{ fontSize: 34, lineHeight: 41, color: colors.textPrimary }}>Số điện thoại{'\n'}của mama</Txt>
          <Txt style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginTop: 8 }}>
            Mình gửi mã xác nhận qua SMS - không cần mật khẩu 💛
          </Txt>
        </View>
        <Input
          label="Số điện thoại"
          prefix="+84"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="912 345 678"
          error={phone && !phoneOk ? 'Số điện thoại chưa đúng định dạng nhé' : ''}
        />
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 20, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!phoneOk || busy} onPress={submit}>{busy ? 'Đang gửi mã…' : 'Gửi mã'}</ButtonPrimary>
          <Txt style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 18 }}>
            Khi tiếp tục, bạn đồng ý với{' '}
            <Txt onPress={() => setShowTerms(true)} style={{ color: colors.textBrand, fontWeight: '600' }}>Điều khoản</Txt> &{' '}
            <Txt onPress={() => setShowTerms(true)} style={{ color: colors.textBrand, fontWeight: '600' }}>Quyền riêng tư</Txt>.
          </Txt>
        </View>
      </View>
      <TermsSheet open={showTerms} onClose={() => setShowTerms(false)} />
    </AuthScaffold>
  );
}

/* ---- OTP boxes ---- */
function OtpBoxes({ value, onChange, success }: { value: string; onChange: (v: string) => void; success?: boolean }) {
  const { colors, radii } = useTheme();
  const refs = useRef<Array<TextInputInstance | null>>([]);
  const set = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 0) {
      const arr = value.split('');
      arr[i] = '';
      onChange(arr.join('').slice(0, 6));
      return;
    }
    if (digits.length > 1) {
      const arr = value.split('');
      for (let k = 0; k < digits.length && i + k < 6; k++) arr[i + k] = digits[k];
      const next = arr.join('').slice(0, 6);
      onChange(next);
      refs.current[Math.min(i + digits.length, 5)]?.focus();
      return;
    }
    const v = digits.slice(-1);
    const arr = value.split('');
    arr[i] = v;
    onChange(arr.join('').slice(0, 6));
    if (i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: TextInputKeyPressEvent) => {
    if (e.nativeEvent.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <View style={{ flexDirection: 'row', gap: 9, justifyContent: 'space-between' }}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const filled = !!value[i];
        return (
          <TextInput
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={value[i] || ''}
            onChangeText={(t) => set(i, t)}
            onKeyPress={(e) => onKey(i, e)}
            keyboardType="number-pad"
            maxLength={6}
            selectTextOnFocus
            style={{
              width: 48,
              height: 60,
              textAlign: 'center',
              fontSize: 24,
              fontFamily: fontFamily(600),
              borderRadius: radii.lg,
              borderWidth: filled || success ? 1.5 : 1,
              borderColor: success ? colors.success : filled ? colors.accentPrimary : colors.borderDefault,
              backgroundColor: success ? colors.successSoft : colors.bgElevated,
              color: colors.textPrimary,
            }}
          />
        );
      })}
    </View>
  );
}

/* Demo-mode helper: shows the OTP inside the app since no SMS is sent. */
function DemoCodeBanner({ code }: { code: string | null }) {
  const { colors } = useTheme();
  if (!code) return null;
  return (
    <Banner icon="✨" tone="ai" style={{ marginTop: 18, alignSelf: 'stretch' }}>
      <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>
        Chế độ demo (chưa nối SMS): mã của bạn là{' '}
        <Txt style={{ fontWeight: '600', color: colors.textPrimary, fontSize: 14 }}>{code}</Txt>
      </Txt>
    </Banner>
  );
}

/* ---- A3 OTP verify (+ Face ID prompt after first verify) ---- */
function A3({ go, ctx, auth, draft, setDraft }: StepProps) {
  const { colors } = useTheme();
  const [otp, setOtp] = useState('');
  const [secs, setSecs] = useState(299);
  const [success, setSuccess] = useState(false);
  const [askFace, setAskFace] = useState(false);
  const [err, setErr] = useState('');
  const busyRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  /* After the OTP proves it's you: existing baby → app, else onboarding. */
  const enterApp = async () => {
    const onboarded = await hasBabyFor(normalized(draft.phone));
    if (onboarded) {
      ctx.goFlow('app');
      ctx.setTab('today');
    } else {
      ctx.goFlow('onboard', { obStep: 'ob1' });
    }
  };

  useEffect(() => {
    if (otp.length !== 6 || busyRef.current) return;
    busyRef.current = true;
    (async () => {
      let ok = false;
      try {
        ok = await auth.verifyOtp(draft.phone, otp);
      } catch (e: any) {
        ctx.toast(e?.message || 'Mạng lag chút xíu. Mình thử lại nhé.');
        busyRef.current = false;
        return;
      }
      if (!ok) {
        setErr('Mã chưa đúng. Thử lại nhé?');
        setOtp('');
        busyRef.current = false;
        return;
      }
      setErr('');
      setSuccess(true);
      setTimeout(() => {
        if (auth.faceIdSupported && !auth.faceIdEnabled) setAskFace(true);
        else enterApp();
      }, 900);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const finish = async (useFace: boolean) => {
    if (useFace) {
      const on = await auth.setFaceIdEnabled(true);
      if (!on) ctx.toast('Chưa bật được Face ID - thử lại trong Mama nhé.');
    }
    await enterApp();
  };

  const resend = async () => {
    try {
      const { demoCode } = await auth.sendOtp(draft.phone);
      setDraft((d) => ({ ...d, demoCode: demoCode ?? null }));
      setSecs(299);
      ctx.toast('Đã gửi lại mã 💛');
    } catch (e: any) {
      ctx.toast(e?.message || 'Mạng lag chút xíu. Mình thử lại nhé.');
    }
  };

  if (askFace) {
    return (
      <AuthScaffold>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <Bong emotion="excited" onesie="orange" size={160} hop />
          <Txt serif style={{ fontSize: 28, lineHeight: 34, marginTop: 16, color: colors.textPrimary, textAlign: 'center' }}>
            Dùng Face ID cho lần sau?
          </Txt>
          <Txt style={{ fontSize: 14.5, color: colors.textSecondary, marginTop: 8, maxWidth: 280, lineHeight: 22, textAlign: 'center' }}>
            Lần sau chỉ cần nhìn máy là vào - không cần chờ SMS. Bật/tắt được trong Mama.
          </Txt>
        </View>
        <View style={{ paddingHorizontal: 24, paddingBottom: 48, gap: 10 }}>
          <ButtonPrimary onPress={() => finish(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <Ic name="faceid" size={22} color="#FFFFFF" sw={2.2} />
              <Txt style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>Bật Face ID</Txt>
            </View>
          </ButtonPrimary>
          <ButtonText onPress={() => finish(false)} style={{ alignSelf: 'center' }}>Để sau cũng được</ButtonText>
        </View>
      </AuthScaffold>
    );
  }

  const mm = String(Math.floor(secs / 60));
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="" onBack={() => go('A2')} />
      <View style={{ paddingHorizontal: 24, flex: 1, alignItems: 'center' }}>
        <Bong emotion={success ? 'excited' : 'curious'} onesie="cream" size={104} float={!success} hop={success} />
        <Txt serif style={{ fontSize: 28, lineHeight: 34, marginTop: 10, color: colors.textPrimary, textAlign: 'center' }}>Nhập mã xác nhận</Txt>
        <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: 28, textAlign: 'center' }}>
          Nhập 6 số vừa gửi tới <Txt style={{ color: colors.textPrimary, fontWeight: '600' }}>+84 {draft.phone}</Txt>
        </Txt>
        <View style={{ width: '100%' }}>
          <OtpBoxes value={otp} onChange={setOtp} success={success} />
        </View>
        {err ? <Txt style={{ marginTop: 14, fontSize: 13.5, color: colors.danger, fontWeight: '600' }}>{err}</Txt> : null}
        <View style={{ marginTop: 22 }}>
          {success ? (
            <Txt style={{ fontSize: 13.5, color: colors.success, fontWeight: '600' }}>Xác thực thành công 💚</Txt>
          ) : secs > 0 ? (
            <Txt style={{ fontSize: 13.5, color: colors.textMuted }}>
              Mã hết hạn sau <Txt style={{ color: colors.textPrimary, fontWeight: '600' }}>{mm}:{ss}</Txt>
            </Txt>
          ) : (
            <Txt onPress={resend} style={{ fontSize: 13.5, color: colors.textBrand, fontWeight: '600' }}>Gửi lại mã</Txt>
          )}
        </View>
        {secs < 240 && !success ? (
          <ButtonText onPress={resend} style={{ marginTop: 6 }}>Gửi lại mã</ButtonText>
        ) : null}
        <DemoCodeBanner code={draft.demoCode} />
      </View>
    </AuthScaffold>
  );
}

function normalized(phone: string): string {
  return '+84' + phone.replace(/\D/g, '').replace(/^84/, '').replace(/^0/, '');
}

export function AuthFlow() {
  const ctx = useApp();
  const auth = useAuth();
  const [step, setStep] = useState(ctx.route.authStep || 'A1');
  const [draft, setDraft] = useState<AuthDraft>({ phone: '', demoCode: null });
  useEffect(() => {
    if (ctx.route.authStep) setStep(ctx.route.authStep);
  }, [ctx.route.authStep]);
  const go = (s: string) => setStep(s);
  const M: Record<string, React.ComponentType<StepProps>> = { A1, A2, A3 };
  const S = M[step] || A1;
  return <S go={go} ctx={ctx} auth={auth} draft={draft} setDraft={setDraft} />;
}

/* ============================================================
   ONBOARDING OB1 / OB2 - saves the real baby profile (+ due date)
   ============================================================ */
interface ObDraft {
  name: string;
  dobInput: string;
  dueInput: string;
  gender: string;
}
type ObProps = {
  go: (s: string) => void;
  ctx: AppCtx;
  draft: ObDraft;
  setDraft: React.Dispatch<React.SetStateAction<ObDraft>>;
  finish: () => Promise<void>;
};

function OB1({ go }: ObProps) {
  const { colors } = useTheme();
  return (
    <AuthScaffold>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 20 }}>
        <Bong emotion="excited" onesie="orange" size={250} float />
        <Txt serif style={{ fontSize: 34, lineHeight: 41, marginTop: 16, color: colors.textPrimary, textAlign: 'center' }}>
          Mừng mama{'\n'}đã đến!
        </Txt>
        <Txt style={{ fontSize: 15, color: colors.textSecondary, marginTop: 12, maxWidth: 290, lineHeight: 23, textAlign: 'center' }}>
          Mỗi ngày mình sẽ hiểu bé thêm một chút.
        </Txt>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
        <ButtonPrimary onPress={() => go('ob2')}>Bắt đầu</ButtonPrimary>
      </View>
    </AuthScaffold>
  );
}

/** Due dates realistically sit within a few weeks of the birth date. */
export const DUE_WINDOW_DAYS = 120;

/** Ngày dự sinh - leaps count from the due date, so this matters for
 *  bé sinh sớm/muộn. Optional, with a gentle explainer underneath.
 *  Pass `anchorDob` (ISO) to center the calendar around the birth date. */
export function DueDateField({
  value,
  onChange,
  error,
  anchorDob,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  anchorDob?: string | null;
}) {
  const { colors } = useTheme();
  const dob = anchorDob ? new Date(anchorDob) : null;
  const win = DUE_WINDOW_DAYS * 86400000;
  return (
    <View>
      <DateField
        label="Ngày dự sinh (không bắt buộc)"
        value={value}
        onChange={onChange}
        error={error}
        minDate={dob ? new Date(dob.getTime() - win) : undefined}
        maxDate={dob ? new Date(dob.getTime() + win) : undefined}
        initialMonth={dob ?? undefined}
      />
      <Txt style={{ fontSize: 12.5, color: colors.textSecondary, lineHeight: 19, marginTop: 8 }}>
        Leap tính theo ngày dự sinh vì não bé bắt đầu phát triển từ trong bụng mẹ. Với bé sinh sớm/muộn 2 tuần trở lên, điền ngày dự sinh giúp dự báo đúng hơn nhiều 💛
      </Txt>
    </View>
  );
}

function OB2({ go, draft, setDraft, finish }: ObProps) {
  const { colors } = useTheme();
  const [busy, setBusy] = useState(false);
  const dobIso = parseDobInput(draft.dobInput);
  const dobErr =
    draft.dobInput.length >= 8 && !dobIso
      ? 'Ngày sinh chưa hợp lệ - bé cần đã chào đời và dưới 5 tuổi nhé'
      : '';
  const dueIso = parseDueDateInput(draft.dueInput);
  const dueFar =
    !!dobIso && !!dueIso &&
    Math.abs(new Date(dueIso).getTime() - new Date(dobIso).getTime()) > DUE_WINDOW_DAYS * 86400000;
  const dueErr =
    draft.dueInput.length >= 8 && !dueIso
      ? 'Ngày dự sinh chưa đúng - nhập dạng DD/MM/YYYY nhé'
      : dueFar
        ? 'Ngày dự sinh thường chỉ cách ngày sinh vài tuần - mama kiểm tra lại nhé'
        : '';
  const submit = async () => {
    setBusy(true);
    try {
      await finish();
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="" onBack={() => go('ob1')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24, gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Txt serif style={{ fontSize: 34, lineHeight: 41, color: colors.textPrimary }}>Chào bé yêu!</Txt>
            <Txt style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginTop: 6 }}>Kể mình nghe về bé nhé - chỉ ngày sinh là cần thiết.</Txt>
          </View>
          <Bong emotion="curious" onesie="sage" size={88} />
        </View>
        <View style={{ gap: 16 }}>
          <Input label="Tên bé (không bắt buộc)" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="VD: Bống" />
          <DateField
            label="Ngày sinh"
            value={draft.dobInput}
            onChange={(v) => setDraft((d) => ({ ...d, dobInput: v }))}
            error={dobErr}
            minDate={new Date(Date.now() - 5 * 365 * 86400000)}
            maxDate={new Date()}
          />
          <DueDateField
            value={draft.dueInput}
            onChange={(v) => setDraft((d) => ({ ...d, dueInput: v }))}
            error={dueErr}
            anchorDob={dobIso}
          />
          <View>
            <Txt style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 8 }}>Giới tính (không bắt buộc)</Txt>
            <View style={{ flexDirection: 'row', gap: 9 }}>
              {['Bé gái', 'Bé trai', 'Chưa rõ'].map((g) => (
                <Chip key={g} active={draft.gender === g} onPress={() => setDraft((d) => ({ ...d, gender: g }))} style={{ flex: 1 }}>{g}</Chip>
              ))}
            </View>
          </View>
        </View>
        <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Chỉ ngày sinh là cần thiết - còn lại để sau cũng được.</Banner>
        <View style={{ paddingTop: 24, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!dobIso || (!!draft.dueInput && !dueIso) || dueFar || busy} onPress={submit}>Tiếp tục</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

export function OnboardFlow() {
  const ctx = useApp();
  const babyApi = useBaby();
  const [step, setStep] = useState(ctx.route.obStep || 'ob1');
  const [draft, setDraft] = useState<ObDraft>({ name: '', dobInput: '', dueInput: '', gender: '' });
  useEffect(() => {
    if (ctx.route.obStep) setStep(ctx.route.obStep);
  }, [ctx.route.obStep]);
  const go = (s: string) => setStep(s);

  const finish = async () => {
    const dobIso = parseDobInput(draft.dobInput);
    if (dobIso) {
      const dueIso = parseDueDateInput(draft.dueInput);
      await babyApi.saveBaby({
        name: draft.name.trim(),
        dob: dobIso,
        gender: draft.gender,
        ...(dueIso ? { dueDate: dueIso } : {}),
      });
    }
    ctx.goFlow('app');
    ctx.setTab('today');
    ctx.toast('Chào mừng hai mẹ con 💛');
  };

  const M: Record<string, React.ComponentType<ObProps>> = { ob1: OB1, ob2: OB2, ob3: OB2 };
  const S = M[step] || OB1;
  return <S go={go} ctx={ctx} draft={draft} setDraft={setDraft} finish={finish} />;
}
