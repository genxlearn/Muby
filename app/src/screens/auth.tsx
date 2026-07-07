/* ============================================================
   AUTH FLOW (A1–A6) + ONBOARDING (OB1–OB3)
   Wired to the real auth service (src/auth) and baby profile store.
   In demo mode the OTP code is shown inside the app (no SMS is sent).
   ============================================================ */
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { AuthApi, useAuth } from '../auth/AuthContext';
import {
  AppBar,
  Banner,
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
  Chip,
  FlowerField,
  Ic,
  Input,
} from '../components';
import { parseDobInput } from '../data/leapEngine';
import { Bong } from '../mascot/Bong';
import { AppCtx, useApp } from '../navigation/AppContext';
import { hasBabyFor, useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { fontFamily } from '../theme/tokens';
import { Txt } from '../theme/Txt';

/* Shared state across auth steps (phone/password travel A2 → A4, A5 → A6). */
interface AuthDraft {
  phone: string;
  password: string;
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
      {flowers ? (
        <FlowerField
          items={[
            { x: 28, y: 70, s: 46, c: colors.warning, o: 0.5, r: 10 },
            { x: 320, y: 120, s: 34, c: colors.success, o: 0.45, r: -8 },
            { x: 300, y: 300, s: 52, c: colors.accentSoftBg, o: 0.6, r: 18 },
            { x: 16, y: 360, s: 30, c: colors.onesieLavender, o: 0.4 },
          ]}
        />
      ) : null}
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

/* password strength (0..4) */
function pwStrength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) || /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

function StrengthBars({ st }: { st: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 5, marginTop: 8 }}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: i < st ? (st <= 2 ? colors.warning : colors.success) : colors.borderDefault,
          }}
        />
      ))}
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
        <Txt serif style={{ fontSize: 38, fontWeight: '600', lineHeight: 40, marginTop: 18, color: colors.textPrimary, textAlign: 'center' }}>
          Baby{'\n'}Wonder Weeks
        </Txt>
        <Txt style={{ fontSize: 15.5, color: colors.textSecondary, marginTop: 14, maxWidth: 280, lineHeight: 23, textAlign: 'center' }}>
          Người chị thân thiết đồng hành cùng mama qua từng tuần của bé 💛
        </Txt>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 48, gap: 12 }}>
        <ButtonPrimary onPress={() => go('A2')}>Đăng ký</ButtonPrimary>
        <ButtonSecondary onPress={() => go('A3')}>Đã có tài khoản? Đăng nhập</ButtonSecondary>
      </View>
    </AuthScaffold>
  );
}

/* ---- A2 Register ---- */
function A2({ go, ctx, auth, setDraft }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [busy, setBusy] = useState(false);
  const phoneOk = phoneOkRe.test(phone.replace(/\s/g, ''));
  const pwOk = pw.length >= 8;
  const matchOk = pw2.length > 0 && pw === pw2;
  const valid = phoneOk && pwOk && matchOk && !busy;
  const st = pwStrength(pw);

  const submit = async () => {
    setBusy(true);
    try {
      const { demoCode } = await auth.sendOtp(phone, 'register');
      setDraft({ phone, password: pw, demoCode: demoCode ?? null });
      go('A4');
    } catch (e: any) {
      ctx.toast(e?.message || 'Mạng lag chút xíu. Mình thử lại nhé.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Tạo tài khoản" onBack={() => go('A1')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Bong emotion="happy" onesie="sage" size={78} />
          <Txt serif style={{ flex: 1, fontSize: 20, fontWeight: '600', color: colors.textPrimary }}>Chỉ mất 1 phút thôi.</Txt>
        </View>
        <View style={{ gap: 16 }}>
          <Input
            label="Số điện thoại"
            prefix="+84"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="912 345 678"
            error={phone && !phoneOk ? 'Số điện thoại chưa đúng định dạng nhé' : ''}
          />
          <View>
            <Input label="Mật khẩu" type="password" value={pw} onChange={setPw} placeholder="Ít nhất 8 ký tự" />
            <StrengthBars st={st} />
          </View>
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            value={pw2}
            onChange={setPw2}
            placeholder="Nhập lại mật khẩu"
            error={pw2 && !matchOk ? 'Mật khẩu chưa khớp 🤍' : ''}
          />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 20, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!valid} onPress={submit}>{busy ? 'Đang gửi mã…' : 'Tạo tài khoản'}</ButtonPrimary>
          <Txt style={{ fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 14, lineHeight: 18 }}>
            Khi tiếp tục, bạn đồng ý với <Txt style={{ color: colors.accentPrimary, fontWeight: '600' }}>Điều khoản</Txt> &{' '}
            <Txt style={{ color: colors.accentPrimary, fontWeight: '600' }}>Quyền riêng tư</Txt>.
          </Txt>
        </View>
      </View>
    </AuthScaffold>
  );
}

/* ---- A3 Login ---- */
function A3({ go, ctx, auth }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!phone || !pw) {
      setErr('SĐT hoặc mật khẩu chưa đúng. Thử lại nhé?');
      return;
    }
    setBusy(true);
    try {
      await auth.signIn(phone, pw);
      const normalized = '+84' + phone.replace(/\D/g, '').replace(/^84/, '').replace(/^0/, '');
      const onboarded = await hasBabyFor(normalized);
      if (onboarded) {
        ctx.goFlow('app');
        ctx.setTab('today');
      } else {
        ctx.goFlow('onboard', { obStep: 'ob1' });
      }
    } catch (e: any) {
      setErr(e?.message || 'SĐT hoặc mật khẩu chưa đúng. Thử lại nhé?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Đăng nhập" onBack={() => go('A1')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <Txt serif style={{ fontSize: 26, fontWeight: '600', marginBottom: 4, color: colors.textPrimary }}>Chào mừng trở lại 💛</Txt>
        <Txt style={{ fontSize: 14.5, color: colors.textSecondary, marginBottom: 24 }}>Bé vẫn đang chờ mama đó.</Txt>
        <View style={{ gap: 16 }}>
          <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={(v) => { setPhone(v); setErr(''); }} placeholder="912 345 678" />
          <Input label="Mật khẩu" type="password" value={pw} onChange={(v) => { setPw(v); setErr(''); }} placeholder="Mật khẩu" error={err} />
        </View>
        <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
          <ButtonText onPress={() => go('A5')} style={{ padding: 0 }}>Khôi phục mật khẩu?</ButtonText>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={busy} onPress={submit}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</ButtonPrimary>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.borderSubtle }} />
            <Txt style={{ fontSize: 13, color: colors.textMuted }}>hoặc</Txt>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.borderSubtle }} />
          </View>
          <Txt style={{ textAlign: 'center', fontSize: 14.5, color: colors.textSecondary }}>
            Chưa có tài khoản?{' '}
            <Txt onPress={() => go('A2')} style={{ color: colors.accentPrimary, fontWeight: '700' }}>Đăng ký ngay</Txt>
          </Txt>
        </View>
      </View>
    </AuthScaffold>
  );
}

/* ---- OTP boxes ---- */
function OtpBoxes({ value, onChange, success }: { value: string; onChange: (v: string) => void; success?: boolean }) {
  const { colors, radii } = useTheme();
  const refs = useRef<Array<TextInput | null>>([]);
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
  const onKey = (i: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
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
              width: 46,
              height: 58,
              textAlign: 'center',
              fontSize: 24,
              fontFamily: fontFamily(700),
              borderRadius: radii.md,
              borderWidth: 2,
              borderColor: success ? colors.success : filled ? colors.accentPrimary : colors.borderSubtle,
              backgroundColor: success ? colors.successSoft : colors.bgSunken,
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
    <Banner icon="✨" tone="soft" style={{ marginTop: 18, alignSelf: 'stretch' }}>
      <Txt style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>
        Chế độ demo (chưa nối SMS): mã của bạn là{' '}
        <Txt style={{ fontWeight: '700', color: colors.textPrimary, fontSize: 14 }}>{code}</Txt>
      </Txt>
    </Banner>
  );
}

/* ---- A4 OTP verify (register) ---- */
function A4({ go, ctx, auth, draft, setDraft }: StepProps) {
  const { colors } = useTheme();
  const [otp, setOtp] = useState('');
  const [secs, setSecs] = useState(299);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState('');
  const busyRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (otp.length !== 6 || busyRef.current) return;
    busyRef.current = true;
    (async () => {
      const ok = await auth.verifyOtp(draft.phone, otp);
      if (!ok) {
        setErr('Mã chưa đúng. Thử lại nhé?');
        setOtp('');
        busyRef.current = false;
        return;
      }
      setErr('');
      setSuccess(true);
      try {
        await auth.signUp(draft.phone, draft.password);
        setTimeout(() => ctx.goFlow('onboard', { obStep: 'ob1' }), 1100);
      } catch (e: any) {
        ctx.toast(e?.message || 'Có lỗi xảy ra. Thử lại nhé.');
        setSuccess(false);
        busyRef.current = false;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const resend = async () => {
    try {
      const { demoCode } = await auth.sendOtp(draft.phone, 'register');
      setDraft((d) => ({ ...d, demoCode: demoCode ?? null }));
      setSecs(299);
      ctx.toast('Đã gửi lại mã 💛');
    } catch (e: any) {
      ctx.toast(e?.message || 'Mạng lag chút xíu. Mình thử lại nhé.');
    }
  };

  const mm = String(Math.floor(secs / 60));
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Xác thực số điện thoại" onBack={() => go('A2')} />
      <View style={{ paddingHorizontal: 24, flex: 1, alignItems: 'center' }}>
        <Bong emotion={success ? 'excited' : 'curious'} onesie="cream" size={104} float={!success} hop={success} />
        <Txt serif style={{ fontSize: 22, fontWeight: '600', marginTop: 10, color: colors.textPrimary, textAlign: 'center' }}>Mình gửi mã xác nhận rồi 📱</Txt>
        <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: 28, textAlign: 'center' }}>
          Nhập 6 số vừa gửi tới <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>+84 {draft.phone}</Txt>
        </Txt>
        <View style={{ width: '100%' }}>
          <OtpBoxes value={otp} onChange={setOtp} success={success} />
        </View>
        {err ? <Txt style={{ marginTop: 14, fontSize: 13.5, color: colors.danger, fontWeight: '600' }}>{err}</Txt> : null}
        <View style={{ marginTop: 22 }}>
          {success ? (
            <Txt style={{ fontSize: 13.5, color: colors.success, fontWeight: '700' }}>Xác thực thành công 💚</Txt>
          ) : secs > 0 ? (
            <Txt style={{ fontSize: 13.5, color: colors.textMuted }}>
              Mã hết hạn sau <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>{mm}:{ss}</Txt>
            </Txt>
          ) : (
            <Txt onPress={resend} style={{ fontSize: 13.5, color: colors.accentPrimary, fontWeight: '700' }}>Gửi lại mã</Txt>
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

/* ---- A5 Forgot step 1 ---- */
function A5({ go, ctx, auth, setDraft }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const ok = phoneOkRe.test(phone.replace(/\s/g, ''));

  const submit = async () => {
    setBusy(true);
    try {
      const { demoCode } = await auth.sendOtp(phone, 'reset');
      setDraft({ phone, password: '', demoCode: demoCode ?? null });
      go('A6');
    } catch (e: any) {
      ctx.toast(e?.message || 'Mạng lag chút xíu. Mình thử lại nhé.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Khôi phục mật khẩu" onBack={() => go('A3')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Bong emotion="snug" onesie="lavender" size={76} />
          <Txt style={{ flex: 1, fontSize: 14.5, color: colors.textSecondary, lineHeight: 22 }}>
            Nhập số điện thoại, mình gửi mã để bạn đặt lại nhé.
          </Txt>
        </View>
        <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={setPhone} placeholder="912 345 678" />
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!ok || busy} onPress={submit}>{busy ? 'Đang gửi…' : 'Gửi mã xác nhận'}</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

/* ---- A6 Forgot step 2 (progressive disclosure) ---- */
function A6({ go, ctx, auth, draft }: StepProps) {
  const { colors } = useTheme();
  const [otp, setOtp] = useState('');
  const [otpOk, setOtpOk] = useState(false);
  const [otpErr, setOtpErr] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [done, setDone] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const checking = useRef(false);
  const valid = otpOk && pw.length >= 8 && pw === pw2 && !busy;

  useEffect(() => {
    if (otp.length !== 6 || otpOk || checking.current) return;
    checking.current = true;
    (async () => {
      const ok = await auth.verifyOtp(draft.phone, otp);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (ok) {
        setOtpOk(true);
        setOtpErr('');
      } else {
        setOtpErr('Mã chưa đúng. Thử lại nhé?');
        setOtp('');
      }
      checking.current = false;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const save = async () => {
    setBusy(true);
    try {
      await auth.resetPassword(draft.phone, pw);
      setDone(true);
    } catch (e: any) {
      if (e?.code === 'not-found') setNotFound(true);
      else ctx.toast(e?.message || 'Có lỗi xảy ra. Thử lại nhé.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <AuthScaffold>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 }}>
          <Bong emotion="excited" onesie="orange" size={170} hop />
          <Txt serif style={{ fontSize: 26, fontWeight: '600', marginTop: 16, color: colors.textPrimary, textAlign: 'center' }}>Mật khẩu đã cập nhật 💚</Txt>
          <Txt style={{ fontSize: 14.5, color: colors.textSecondary, marginTop: 8, textAlign: 'center' }}>Giờ mình đăng nhập lại nhé mama.</Txt>
          <View style={{ width: '100%', marginTop: 28 }}>
            <ButtonPrimary onPress={() => go('A3')}>Về đăng nhập</ButtonPrimary>
          </View>
        </View>
      </AuthScaffold>
    );
  }
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Đặt lại mật khẩu" onBack={() => go('A5')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <Txt style={{ fontSize: 14.5, color: colors.textSecondary, marginBottom: 18 }}>Nhập mã xác nhận vừa gửi tới máy bạn.</Txt>
        <OtpBoxes value={otp} onChange={setOtp} success={otpOk} />
        {otpErr ? <Txt style={{ marginTop: 12, fontSize: 13, color: colors.danger, fontWeight: '600' }}>{otpErr}</Txt> : null}
        {notFound ? (
          <Banner icon="🤍" style={{ marginTop: 14 }}>
            <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
              SĐT chưa đăng ký.{' '}
              <Txt onPress={() => go('A2')} style={{ color: colors.accentPrimary, fontWeight: '700' }}>Bạn muốn tạo tài khoản mới?</Txt>
            </Txt>
          </Banner>
        ) : null}
        {otpOk ? (
          <View style={{ gap: 16, marginTop: 22 }}>
            <Input label="Mật khẩu mới" type="password" value={pw} onChange={setPw} placeholder="Ít nhất 8 ký tự" />
            <Input
              label="Xác nhận mật khẩu"
              type="password"
              value={pw2}
              onChange={setPw2}
              placeholder="Nhập lại"
              error={pw2 && pw !== pw2 ? 'Mật khẩu chưa khớp 🤍' : ''}
            />
          </View>
        ) : (
          <DemoCodeBanner code={draft.demoCode} />
        )}
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!valid} onPress={save}>{busy ? 'Đang lưu…' : 'Lưu mật khẩu mới'}</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

export function AuthFlow() {
  const ctx = useApp();
  const auth = useAuth();
  const [step, setStep] = useState(ctx.route.authStep || 'A1');
  const [draft, setDraft] = useState<AuthDraft>({ phone: '', password: '', demoCode: null });
  useEffect(() => {
    if (ctx.route.authStep) setStep(ctx.route.authStep);
  }, [ctx.route.authStep]);
  const go = (s: string) => setStep(s);
  const M: Record<string, React.ComponentType<StepProps>> = { A1, A2, A3, A4, A5, A6 };
  const S = M[step] || A1;
  return <S go={go} ctx={ctx} auth={auth} draft={draft} setDraft={setDraft} />;
}

/* ============================================================
   ONBOARDING OB1 / OB2 / OB3 — saves the real baby profile
   ============================================================ */
interface ObDraft {
  name: string;
  dobInput: string;
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
        <Txt serif style={{ fontSize: 34, fontWeight: '600', lineHeight: 37, marginTop: 16, color: colors.textPrimary, textAlign: 'center' }}>
          Mừng mama{'\n'}đã đến!
        </Txt>
        <Txt style={{ fontSize: 15, color: colors.textSecondary, marginTop: 12, maxWidth: 290, lineHeight: 23, textAlign: 'center' }}>
          Cùng nhau, mình sẽ hiểu bé hơn mỗi ngày — nhẹ nhàng và không vội vã.
        </Txt>
      </View>
      <View style={{ paddingHorizontal: 24, paddingBottom: 48 }}>
        <ButtonPrimary onPress={() => go('ob2')}>Bắt đầu</ButtonPrimary>
      </View>
    </AuthScaffold>
  );
}

function OB2({ go, draft, setDraft }: ObProps) {
  const { colors } = useTheme();
  const dobIso = parseDobInput(draft.dobInput);
  const dobErr = draft.dobInput.length >= 8 && !dobIso ? 'Ngày sinh chưa đúng — nhập dạng DD/MM/YYYY nhé' : '';
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Chào bé yêu!" onBack={() => go('ob1')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Bong emotion="curious" onesie="sage" size={104} />
        </View>
        <View style={{ gap: 16 }}>
          <Input label="Tên bé (không bắt buộc)" value={draft.name} onChange={(v) => setDraft((d) => ({ ...d, name: v }))} placeholder="VD: Bống" />
          <Input
            label="Ngày sinh"
            value={draft.dobInput}
            onChange={(v) => setDraft((d) => ({ ...d, dobInput: v }))}
            placeholder="DD/MM/YYYY"
            type="tel"
            error={dobErr}
            rightSlot={<Ic name="cal" size={20} color={colors.textMuted} />}
          />
          <View>
            <Txt style={{ fontSize: 13.5, fontWeight: '600', color: colors.textSecondary, marginBottom: 7 }}>Giới tính (không bắt buộc)</Txt>
            <View style={{ flexDirection: 'row', gap: 9 }}>
              {['Bé gái', 'Bé trai', 'Chưa rõ'].map((g) => (
                <Chip key={g} active={draft.gender === g} onPress={() => setDraft((d) => ({ ...d, gender: g }))} style={{ flex: 1 }}>{g}</Chip>
              ))}
            </View>
          </View>
        </View>
        <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Chỉ ngày sinh là cần thiết — còn lại để sau cũng được.</Banner>
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!dobIso} onPress={() => go('ob3')}>Tiếp tục</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

function OB3({ go, ctx, finish }: ObProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const complete = async (invited: boolean) => {
    setBusy(true);
    try {
      await finish();
      if (invited) ctx.toast('Đã gửi lời mời tới bố 💛');
    } finally {
      setBusy(false);
    }
  };
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Mời bố vào cùng" onBack={() => go('ob2')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
          <Bong emotion="happy" onesie="orange" size={110} style={{ marginRight: -18 }} />
          <Bong emotion="blissful" onesie="lavender" size={110} />
        </View>
        <Txt serif style={{ fontSize: 21, fontWeight: '600', textAlign: 'center', marginBottom: 6, color: colors.textPrimary }}>
          Chăm bé nhẹ nhàng hơn khi có hai người
        </Txt>
        <Txt style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 22, lineHeight: 21 }}>
          Mọi ghi chép sẽ được đồng bộ cho cả nhà.
        </Txt>
        <Input label="Email của bố" type="email" value={email} onChange={setEmail} placeholder="bo@email.com" />
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44, gap: 10 }}>
          <ButtonPrimary disabled={busy} onPress={() => complete(email.includes('@'))}>Gửi lời mời</ButtonPrimary>
          <ButtonText onPress={() => complete(false)} style={{ alignSelf: 'center' }}>Để sau cũng được</ButtonText>
        </View>
      </View>
    </AuthScaffold>
  );
}

export function OnboardFlow() {
  const ctx = useApp();
  const babyApi = useBaby();
  const [step, setStep] = useState(ctx.route.obStep || 'ob1');
  const [draft, setDraft] = useState<ObDraft>({ name: '', dobInput: '', gender: '' });
  useEffect(() => {
    if (ctx.route.obStep) setStep(ctx.route.obStep);
  }, [ctx.route.obStep]);
  const go = (s: string) => setStep(s);

  const finish = async () => {
    const dobIso = parseDobInput(draft.dobInput);
    if (dobIso) {
      await babyApi.saveBaby({ name: draft.name.trim(), dob: dobIso, gender: draft.gender });
    }
    ctx.goFlow('app');
    ctx.setTab('today');
  };

  const M: Record<string, React.ComponentType<ObProps>> = { ob1: OB1, ob2: OB2, ob3: OB3 };
  const S = M[step] || OB1;
  return <S go={go} ctx={ctx} draft={draft} setDraft={setDraft} finish={finish} />;
}
