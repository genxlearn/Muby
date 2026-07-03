/* ============================================================
   AUTH FLOW (A1–A6) + ONBOARDING (10A–10C)
   ============================================================ */

function AuthScaffold({ children, bg = 'var(--bg-canvas)', flowers = true }) {
  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>
      {flowers && <FlowerField items={[
        { x: 28, y: 70, s: 46, c: 'var(--warning)', o: 0.5, r: 10 },
        { x: 320, y: 120, s: 34, c: 'var(--success)', o: 0.45, r: -8 },
        { x: 300, y: 300, s: 52, c: 'var(--accent-soft-bg)', o: 0.6, r: 18 },
        { x: 16, y: 360, s: 30, c: 'var(--onesie-lavender)', o: 0.4 },
      ]} />}
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

/* phone strength bars */
function pwStrength(p) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) || /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}

/* ---- A1 Welcome ---- */
function A1({ go, ctx }) {
  return (
    <AuthScaffold>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', textAlign: 'center' }}>
        <Bong emotion="happy" onesie="orange" size={184} float />
        <div className="serif" style={{ fontSize: 38, fontWeight: 600, lineHeight: 1.05, marginTop: 18, color: 'var(--text-primary)' }}>Baby<br />Wonder Weeks</div>
        <div style={{ fontSize: 15.5, color: 'var(--text-secondary)', marginTop: 14, maxWidth: 280, lineHeight: 1.5 }}>Người chị thân thiết đồng hành cùng mama qua từng tuần của bé 💛</div>
      </div>
      <div style={{ padding: '0 24px 30px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ButtonPrimary onClick={() => go('A2')}>Đăng ký</ButtonPrimary>
        <ButtonSecondary onClick={() => go('A3')}>Đã có tài khoản? Đăng nhập</ButtonSecondary>
      </div>
    </AuthScaffold>
  );
}

/* ---- A2 Register ---- */
function A2({ go }) {
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
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <Bong emotion="happy" onesie="sage" size={78} />
          <div className="serif" style={{ fontSize: 20, fontWeight: 600 }}>Chỉ mất 1 phút thôi.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={setPhone} placeholder="912 345 678"
            error={phone && !phoneOk ? 'Số điện thoại chưa đúng định dạng nhé' : ''} />
          <div>
            <Input label="Mật khẩu" type="password" value={pw} onChange={setPw} placeholder="Ít nhất 8 ký tự" />
            <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < st ? (st <= 2 ? 'var(--warning)' : 'var(--success)') : 'var(--border-default)', transition: 'background .2s' }} />
              ))}
            </div>
          </div>
          <Input label="Xác nhận mật khẩu" type="password" value={pw2} onChange={setPw2} placeholder="Nhập lại mật khẩu"
            error={pw2 && !matchOk ? 'Mật khẩu chưa khớp 🤍' : ''} />
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '20px 0 16px' }}>
          <ButtonPrimary disabled={!valid} onClick={() => go('A4')}>Tạo tài khoản</ButtonPrimary>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            Khi tiếp tục, bạn đồng ý với <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Điều khoản</span> & <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Quyền riêng tư</span>.
          </div>
        </div>
      </div>
    </AuthScaffold>
  );
}

/* ---- A3 Login ---- */
function A3({ go, ctx }) {
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = () => {
    if (!phone || !pw) { setErr('SĐT hoặc mật khẩu chưa đúng. Thử lại nhé?'); return; }
    ctx.goFlow('app'); ctx.setTab('today');
  };
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Đăng nhập" onBack={() => go('A1')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="serif" style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>Chào mừng trở lại 💛</div>
        <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginBottom: 24 }}>Bé vẫn đang chờ mama đó.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={(v) => { setPhone(v); setErr(''); }} placeholder="912 345 678" />
          <Input label="Mật khẩu" type="password" value={pw} onChange={(v) => { setPw(v); setErr(''); }} placeholder="Mật khẩu" error={err} />
        </div>
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <ButtonText onClick={() => go('A5')} style={{ padding: 0 }}>Khôi phục mật khẩu?</ButtonText>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '12px 0 16px' }}>
          <ButtonPrimary onClick={submit}>Đăng nhập</ButtonPrimary>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>hoặc</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: 14.5, color: 'var(--text-secondary)' }}>
            Chưa có tài khoản? <span onClick={() => go('A2')} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Đăng ký ngay</span>
          </div>
        </div>
      </div>
    </AuthScaffold>
  );
}

/* ---- OTP boxes ---- */
function OtpBoxes({ value, onChange, success }) {
  const refs = useRef([]);
  const set = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const arr = value.split('');
    arr[i] = v;
    const next = arr.join('').slice(0, 6);
    onChange(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const key = (i, e) => { if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus(); };
  const paste = (e) => {
    const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (t) { e.preventDefault(); onChange(t); refs.current[Math.min(t.length, 5)]?.focus(); }
  };
  return (
    <div style={{ display: 'flex', gap: 9, justifyContent: 'space-between' }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <input key={i} ref={el => refs.current[i] = el} value={value[i] || ''} onChange={e => set(i, e.target.value.slice(-1))}
          onKeyDown={e => key(i, e)} onPaste={paste} inputMode="numeric" maxLength="1"
          style={{
            width: 46, height: 58, textAlign: 'center', fontSize: 24, fontWeight: 700, borderRadius: 'var(--r-md)',
            border: `2px solid ${success ? 'var(--success)' : (value[i] ? 'var(--accent-primary)' : 'var(--border-subtle)')}`,
            background: success ? 'color-mix(in srgb, var(--success) 18%, var(--bg-elevated))' : 'var(--bg-sunken)',
            color: 'var(--text-primary)', outline: 'none', transition: 'all .15s',
          }} />
      ))}
    </div>
  );
}

/* ---- A4 OTP verify ---- */
function A4({ go, ctx }) {
  const [otp, setOtp] = useState('');
  const [secs, setSecs] = useState(299);
  const [success, setSuccess] = useState(false);
  useEffect(() => { const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (otp.length === 6) { setSuccess(true); setTimeout(() => { ctx.goFlow('onboard', { obStep: 'ob1' }); }, 1100); }
  }, [otp]);
  const mm = String(Math.floor(secs / 60)).padStart(1, '0'), ss = String(secs % 60).padStart(2, '0');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Xác thực số điện thoại" onBack={() => go('A2')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Bong emotion={success ? 'excited' : 'curious'} onesie="cream" size={104} float={!success} className={success ? 'hop' : ''} />
        <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 10 }}>Mình gửi mã xác nhận rồi 📱</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, marginBottom: 28 }}>Nhập 6 số vừa gửi tới <b style={{ color: 'var(--text-primary)' }}>+84 912 345 678</b></div>
        <div style={{ width: '100%' }}>
          <OtpBoxes value={otp} onChange={setOtp} success={success} />
        </div>
        <div style={{ marginTop: 22, fontSize: 13.5, color: 'var(--text-muted)' }}>
          {success ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>Xác thực thành công 💚</span>
            : secs > 0 ? <>Mã hết hạn sau <b style={{ color: 'var(--text-primary)' }}>{mm}:{ss}</b></>
              : <span onClick={() => setSecs(299)} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Gửi lại mã</span>}
        </div>
        {secs < 240 && !success && <ButtonText onClick={() => setSecs(299)} style={{ marginTop: 6 }}>Gửi lại mã</ButtonText>}
      </div>
    </AuthScaffold>
  );
}

/* ---- A5 Forgot step 1 ---- */
function A5({ go }) {
  const [phone, setPhone] = useState('');
  const [err, setErr] = useState(false);
  const ok = /^\d{9,10}$/.test(phone.replace(/\s/g, ''));
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Khôi phục mật khẩu" onBack={() => go('A3')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <Bong emotion="snug" onesie="lavender" size={76} />
          <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Nhập số điện thoại, mình gửi mã để bạn đặt lại nhé.</div>
        </div>
        <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={(v) => { setPhone(v); setErr(false); }} placeholder="912 345 678" />
        {err && <Banner icon="🤍" style={{ marginTop: 14 }}>SĐT chưa đăng ký. <span onClick={() => go('A2')} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Bạn muốn tạo tài khoản mới?</span></Banner>}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '12px 0 16px' }}>
          <ButtonPrimary disabled={!ok} onClick={() => phone.includes('000') ? setErr(true) : go('A6')}>Gửi mã xác nhận</ButtonPrimary>
        </div>
      </div>
    </AuthScaffold>
  );
}

/* ---- A6 Forgot step 2 (progressive disclosure) ---- */
function A6({ go, ctx }) {
  const [otp, setOtp] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [done, setDone] = useState(false);
  const otpOk = otp.length === 6;
  const valid = otpOk && pw.length >= 8 && pw === pw2;
  if (done) {
    return (
      <AuthScaffold>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center' }}>
          <Bong emotion="excited" onesie="orange" size={170} className="hop" />
          <div className="serif" style={{ fontSize: 26, fontWeight: 600, marginTop: 16 }}>Mật khẩu đã cập nhật 💚</div>
          <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginTop: 8 }}>Giờ mình đăng nhập lại nhé mama.</div>
          <div style={{ width: '100%', marginTop: 28 }}><ButtonPrimary onClick={() => go('A3')}>Về đăng nhập</ButtonPrimary></div>
        </div>
      </AuthScaffold>
    );
  }
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Đặt lại mật khẩu" onBack={() => go('A5')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginBottom: 18 }}>Nhập mã xác nhận vừa gửi tới máy bạn.</div>
        <OtpBoxes value={otp} onChange={setOtp} success={otpOk} />
        <div style={{
          maxHeight: otpOk ? 320 : 0, opacity: otpOk ? 1 : 0, overflow: 'hidden',
          transition: 'max-height .4s ease, opacity .3s', marginTop: otpOk ? 22 : 0,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Mật khẩu mới" type="password" value={pw} onChange={setPw} placeholder="Ít nhất 8 ký tự" />
            <Input label="Xác nhận mật khẩu" type="password" value={pw2} onChange={setPw2} placeholder="Nhập lại"
              error={pw2 && pw !== pw2 ? 'Mật khẩu chưa khớp 🤍' : ''} />
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '12px 0 16px' }}>
          <ButtonPrimary disabled={!valid} onClick={() => setDone(true)}>Lưu mật khẩu mới</ButtonPrimary>
        </div>
      </div>
    </AuthScaffold>
  );
}

function AuthFlow({ ctx }) {
  const [step, setStep] = useState(ctx.route.authStep || 'A1');
  useEffect(() => { if (ctx.route.authStep) setStep(ctx.route.authStep); }, [ctx.route.authStep]);
  const go = (s) => setStep(s);
  const M = { A1, A2, A3, A4, A5, A6 };
  const S = M[step] || A1;
  return <S go={go} ctx={ctx} />;
}

/* ============================================================
   ONBOARDING 10A / 10B / 10C
   ============================================================ */
function OB1({ go }) {
  return (
    <AuthScaffold>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', textAlign: 'center' }}>
        <Bong emotion="excited" onesie="orange" size={250} float />
        <div className="serif" style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.08, marginTop: 16 }}>Mừng mama<br />đã đến!</div>
        <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 290, lineHeight: 1.5 }}>Cùng nhau, mình sẽ hiểu bé hơn mỗi ngày — nhẹ nhàng và không vội vã.</div>
      </div>
      <div style={{ padding: '0 24px 30px' }}><ButtonPrimary onClick={() => go('ob2')}>Bắt đầu</ButtonPrimary></div>
    </AuthScaffold>
  );
}
function OB2({ go }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Chào bé yêu!" onBack={() => go('ob1')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><Bong emotion="curious" onesie="sage" size={104} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Tên bé (không bắt buộc)" value={name} onChange={setName} placeholder="VD: Bống" />
          <Input label="Ngày sinh" value={dob} onChange={setDob} placeholder="DD / MM / YYYY" type="tel" rightSlot={<Ic name="cal" size={20} stroke="var(--text-muted)" />} />
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Giới tính (không bắt buộc)</label>
            <div style={{ display: 'flex', gap: 9 }}>
              {['Bé gái', 'Bé trai', 'Chưa rõ'].map(g => <Chip key={g} active={gender === g} onClick={() => setGender(g)} style={{ flex: 1 }}>{g}</Chip>)}
            </div>
          </div>
        </div>
        <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Chỉ ngày sinh là cần thiết — còn lại để sau cũng được.</Banner>
        <div style={{ flex: 1 }} />
        <div style={{ padding: '12px 0 16px' }}><ButtonPrimary disabled={!dob} onClick={() => go('ob3')}>Tiếp tục</ButtonPrimary></div>
      </div>
    </AuthScaffold>
  );
}
function OB3({ go, ctx }) {
  const [email, setEmail] = useState('');
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Mời bố vào cùng" onBack={() => go('ob2')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 12 }}>
          <Bong emotion="happy" onesie="orange" size={110} style={{ marginRight: -18 }} />
          <Bong emotion="blissful" onesie="lavender" size={110} />
        </div>
        <div className="serif" style={{ fontSize: 21, fontWeight: 600, textAlign: 'center', marginBottom: 6 }}>Chăm bé nhẹ nhàng hơn khi có hai người</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 22, lineHeight: 1.5 }}>Mọi ghi chép sẽ được đồng bộ cho cả nhà.</div>
        <Input label="Email của bố" type="email" value={email} onChange={setEmail} placeholder="bo@email.com" />
        <div style={{ flex: 1 }} />
        <div style={{ padding: '12px 0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ButtonPrimary onClick={() => { ctx.goFlow('app'); ctx.setTab('today'); }}>Gửi lời mời</ButtonPrimary>
          <ButtonText onClick={() => { ctx.goFlow('app'); ctx.setTab('today'); }} style={{ textAlign: 'center' }}>Để sau cũng được</ButtonText>
        </div>
      </div>
    </AuthScaffold>
  );
}

function OnboardFlow({ ctx }) {
  const [step, setStep] = useState(ctx.route.obStep || 'ob1');
  useEffect(() => { if (ctx.route.obStep) setStep(ctx.route.obStep); }, [ctx.route.obStep]);
  const go = (s) => setStep(s);
  const M = { ob1: OB1, ob2: OB2, ob3: OB3 };
  const S = M[step] || OB1;
  return <S go={go} ctx={ctx} />;
}

Object.assign(window, { AuthFlow, OnboardFlow });
