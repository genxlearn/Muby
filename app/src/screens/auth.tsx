/* ============================================================
   AUTH FLOW (A1–A6) + ONBOARDING (OB1–OB3)
   Ported from project/screens/auth.jsx to React Native.
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
import { Bong } from '../mascot/Bong';
import { AppCtx, useApp } from '../navigation/AppContext';
import { useTheme } from '../theme/ThemeContext';
import { fontFamily } from '../theme/tokens';
import { Txt } from '../theme/Txt';

type StepProps = { go: (s: string) => void; ctx: AppCtx };

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
function A2({ go }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const phoneOk = /^\d{9,10}$/.test(phone.replace(/\s/g, ''));
  const pwOk = pw.length >= 8;
  const matchOk = pw2.length > 0 && pw === pw2;
  const valid = phoneOk && pwOk && matchOk;
  const st = pwStrength(pw);
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
          <ButtonPrimary disabled={!valid} onPress={() => go('A4')}>Tạo tài khoản</ButtonPrimary>
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
function A3({ go, ctx }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = () => {
    if (!phone || !pw) {
      setErr('SĐT hoặc mật khẩu chưa đúng. Thử lại nhé?');
      return;
    }
    ctx.goFlow('app');
    ctx.setTab('today');
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
          <ButtonPrimary onPress={submit}>Đăng nhập</ButtonPrimary>
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
      // paste / multi-char: distribute starting at this box
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

/* ---- A4 OTP verify ---- */
function A4({ go, ctx }: StepProps) {
  const { colors } = useTheme();
  const [otp, setOtp] = useState('');
  const [secs, setSecs] = useState(299);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (otp.length === 6) {
      setSuccess(true);
      const t = setTimeout(() => ctx.goFlow('onboard', { obStep: 'ob1' }), 1100);
      return () => clearTimeout(t);
    }
  }, [otp]);
  const mm = String(Math.floor(secs / 60)).padStart(1, '0');
  const ss = String(secs % 60).padStart(2, '0');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Xác thực số điện thoại" onBack={() => go('A2')} />
      <View style={{ paddingHorizontal: 24, flex: 1, alignItems: 'center' }}>
        <Bong emotion={success ? 'excited' : 'curious'} onesie="cream" size={104} float={!success} hop={success} />
        <Txt serif style={{ fontSize: 22, fontWeight: '600', marginTop: 10, color: colors.textPrimary, textAlign: 'center' }}>Mình gửi mã xác nhận rồi 📱</Txt>
        <Txt style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6, marginBottom: 28, textAlign: 'center' }}>
          Nhập 6 số vừa gửi tới <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>+84 912 345 678</Txt>
        </Txt>
        <View style={{ width: '100%' }}>
          <OtpBoxes value={otp} onChange={setOtp} success={success} />
        </View>
        <View style={{ marginTop: 22 }}>
          {success ? (
            <Txt style={{ fontSize: 13.5, color: colors.success, fontWeight: '700' }}>Xác thực thành công 💚</Txt>
          ) : secs > 0 ? (
            <Txt style={{ fontSize: 13.5, color: colors.textMuted }}>
              Mã hết hạn sau <Txt style={{ color: colors.textPrimary, fontWeight: '700' }}>{mm}:{ss}</Txt>
            </Txt>
          ) : (
            <Txt onPress={() => setSecs(299)} style={{ fontSize: 13.5, color: colors.accentPrimary, fontWeight: '700' }}>Gửi lại mã</Txt>
          )}
        </View>
        {secs < 240 && !success ? (
          <ButtonText onPress={() => setSecs(299)} style={{ marginTop: 6 }}>Gửi lại mã</ButtonText>
        ) : null}
      </View>
    </AuthScaffold>
  );
}

/* ---- A5 Forgot step 1 ---- */
function A5({ go }: StepProps) {
  const { colors } = useTheme();
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState(false);
  const ok = /^\d{9,10}$/.test(phone.replace(/\s/g, ''));
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
        <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={(v) => { setPhone(v); setErr(false); }} placeholder="912 345 678" />
        {err ? (
          <Banner icon="🤍" style={{ marginTop: 14 }}>
            <Txt style={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 20 }}>
              SĐT chưa đăng ký.{' '}
              <Txt onPress={() => go('A2')} style={{ color: colors.accentPrimary, fontWeight: '700' }}>Bạn muốn tạo tài khoản mới?</Txt>
            </Txt>
          </Banner>
        ) : null}
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!ok} onPress={() => (phone.includes('000') ? setErr(true) : go('A6'))}>Gửi mã xác nhận</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

/* ---- A6 Forgot step 2 (progressive disclosure) ---- */
function A6({ go }: StepProps) {
  const { colors } = useTheme();
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [done, setDone] = useState(false);
  const otpOk = otp.length === 6;
  const valid = otpOk && pw.length >= 8 && pw === pw2;

  const setOtpAnimated = (v: string) => {
    const was = otp.length === 6;
    const now = v.length === 6;
    if (was !== now) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOtp(v);
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
        <OtpBoxes value={otp} onChange={setOtpAnimated} success={otpOk} />
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
        ) : null}
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!valid} onPress={() => setDone(true)}>Lưu mật khẩu mới</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

export function AuthFlow() {
  const ctx = useApp();
  const [step, setStep] = useState(ctx.route.authStep || 'A1');
  useEffect(() => {
    if (ctx.route.authStep) setStep(ctx.route.authStep);
  }, [ctx.route.authStep]);
  const go = (s: string) => setStep(s);
  const M: Record<string, React.ComponentType<StepProps>> = { A1, A2, A3, A4, A5, A6 };
  const S = M[step] || A1;
  return <S go={go} ctx={ctx} />;
}

/* ============================================================
   ONBOARDING OB1 / OB2 / OB3
   ============================================================ */
function OB1({ go }: StepProps) {
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

function OB2({ go }: StepProps) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Chào bé yêu!" onBack={() => go('ob1')} />
      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Bong emotion="curious" onesie="sage" size={104} />
        </View>
        <View style={{ gap: 16 }}>
          <Input label="Tên bé (không bắt buộc)" value={name} onChange={setName} placeholder="VD: Bống" />
          <Input
            label="Ngày sinh"
            value={dob}
            onChange={setDob}
            placeholder="DD / MM / YYYY"
            type="tel"
            rightSlot={<Ic name="cal" size={20} color={colors.textMuted} />}
          />
          <View>
            <Txt style={{ fontSize: 13.5, fontWeight: '600', color: colors.textSecondary, marginBottom: 7 }}>Giới tính (không bắt buộc)</Txt>
            <View style={{ flexDirection: 'row', gap: 9 }}>
              {['Bé gái', 'Bé trai', 'Chưa rõ'].map((g) => (
                <Chip key={g} active={gender === g} onPress={() => setGender(g)} style={{ flex: 1 }}>{g}</Chip>
              ))}
            </View>
          </View>
        </View>
        <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Chỉ ngày sinh là cần thiết — còn lại để sau cũng được.</Banner>
        <View style={{ flex: 1 }} />
        <View style={{ paddingTop: 12, paddingBottom: 44 }}>
          <ButtonPrimary disabled={!dob} onPress={() => go('ob3')}>Tiếp tục</ButtonPrimary>
        </View>
      </View>
    </AuthScaffold>
  );
}

function OB3({ go, ctx }: StepProps) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const finish = () => {
    ctx.goFlow('app');
    ctx.setTab('today');
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
          <ButtonPrimary onPress={finish}>Gửi lời mời</ButtonPrimary>
          <ButtonText onPress={finish} style={{ alignSelf: 'center' }}>Để sau cũng được</ButtonText>
        </View>
      </View>
    </AuthScaffold>
  );
}

export function OnboardFlow() {
  const ctx = useApp();
  const [step, setStep] = useState(ctx.route.obStep || 'ob1');
  useEffect(() => {
    if (ctx.route.obStep) setStep(ctx.route.obStep);
  }, [ctx.route.obStep]);
  const go = (s: string) => setStep(s);
  const M: Record<string, React.ComponentType<StepProps>> = { ob1: OB1, ob2: OB2, ob3: OB3 };
  const S = M[step] || OB1;
  return <S go={go} ctx={ctx} />;
}
