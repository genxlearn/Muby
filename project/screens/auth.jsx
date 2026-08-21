/* ============================================================
   MUBY AUTH (A1 Welcome · A2 Phone · A3 OTP — passwordless)
   + ONBOARDING (10A Mừng mama · 10B Thêm bé + due date)
   ============================================================ */

function AuthScaffold({ children, bg = 'var(--bg-canvas)', flowers = true }) {
  return (
    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: bg, overflow: 'hidden' }}>
      {flowers && <FlowerField items={[
      { x: 28, y: 70, s: 46, c: 'var(--warning)', o: 0.5, r: 10 },
      { x: 320, y: 120, s: 34, c: 'var(--success)', o: 0.45, r: -8 },
      { x: 300, y: 300, s: 52, c: 'var(--accent-soft-bg)', o: 0.6, r: 18 },
      { x: 16, y: 360, s: 30, c: 'var(--onesie-lavender)', o: 0.4 }]
      } />}
      <div className="screen-scroll auth-scroll" style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <style>{`.auth-scroll{padding-bottom:0 !important}`}</style>
    </div>);

}

/* ---- A1 Welcome ---- */
function A1({ go }) {
  return (
    <AuthScaffold>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', textAlign: 'center' }}>
        <Bong emotion="happy" onesie="orange" size={184} float />
        <div className="serif" style={{ fontSize: 46, fontWeight: 600, lineHeight: 1.05, marginTop: 18, color: 'var(--text-primary)' }}>Muby</div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--accent-primary)', marginTop: 8 }}>Mẹ hiểu Bé</div>
        <div style={{ fontSize: 15.5, color: 'var(--text-secondary)', marginTop: 16, maxWidth: 280, lineHeight: 1.5 }}>Người chị thân thiết đồng hành cùng mama qua từng tuần của bé 💛</div>
      </div>
      <div style={{ padding: '0 24px 48px' }}>
        <ButtonPrimary onClick={() => go('A2')}>Bắt đầu với số điện thoại</ButtonPrimary>
      </div>
    </AuthScaffold>);

}

/* ---- A2 Phone entry (passwordless) ---- */
function A2({ go }) {
  const [phone, setPhone] = useState('');
  const phoneOk = /^\d{9,10}$/.test(phone.replace(/\s/g, ''));
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Nhập số điện thoại" onBack={() => go('A1')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Bong emotion="happy" onesie="sage" size={78} />
          <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Mình gửi mã xác nhận qua SMS — không cần mật khẩu 💛</div>
        </div>
        <Input label="Số điện thoại" prefix="+84" type="tel" value={phone} onChange={setPhone} placeholder="912 345 678"
        error={phone && !phoneOk ? 'Số điện thoại chưa đúng định dạng nhé' : ''} />
        <div style={{ flex: 1 }} />
        <div style={{ padding: '20px 0 44px' }}>
          <ButtonPrimary disabled={!phoneOk} onClick={() => go('A3')}>Gửi mã</ButtonPrimary>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
            Khi tiếp tục, bạn đồng ý với <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Điều khoản</span> & <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Quyền riêng tư</span>.
          </div>
        </div>
      </div>
    </AuthScaffold>);

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
  const key = (i, e) => {if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();};
  const paste = (e) => {
    const t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (t) {e.preventDefault();onChange(t);refs.current[Math.min(t.length, 5)]?.focus();}
  };
  return (
    <div style={{ display: 'flex', gap: 9, justifyContent: 'space-between' }}>
      {[0, 1, 2, 3, 4, 5].map((i) =>
      <input key={i} ref={(el) => refs.current[i] = el} value={value[i] || ''} onChange={(e) => set(i, e.target.value.slice(-1))}
      onKeyDown={(e) => key(i, e)} onPaste={paste} inputMode="numeric" maxLength="1"
      style={{
        width: 46, height: 58, textAlign: 'center', fontSize: 24, fontWeight: 700, borderRadius: 'var(--r-md)',
        border: `2px solid ${success ? 'var(--success)' : value[i] ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        background: success ? 'color-mix(in srgb, var(--success) 18%, var(--bg-elevated))' : 'var(--bg-sunken)',
        color: 'var(--text-primary)', outline: 'none', transition: 'all .15s'
      }} />
      )}
    </div>);

}

/* ---- A3 OTP verify (+ Face ID prompt after first verify) ---- */
function A3({ go, ctx, demoNetError }) {
  const [otp, setOtp] = useState('');
  const [secs, setSecs] = useState(299);
  const [success, setSuccess] = useState(false);
  const [askFace, setAskFace] = useState(false);
  const [netErr, setNetErr] = useState(!!demoNetError);
  useEffect(() => {const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);return () => clearInterval(t);}, []);
  useEffect(() => {
    if (otp.length === 6 && !success) {setSuccess(true);setNetErr(false);setTimeout(() => setAskFace(true), 900);}
  }, [otp]);
  const finish = (useFace) => {
    if (ctx.setFaceId) ctx.setFaceId(useFace);
    ctx.goFlow('onboard', { obStep: 'ob1' });
  };
  const mm = String(Math.floor(secs / 60)).padStart(1, '0'),ss = String(secs % 60).padStart(2, '0');
  if (askFace) {
    return (
      <AuthScaffold>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center' }}>
          <Bong emotion="excited" onesie="orange" size={160} className="hop" />
          <div className="serif" style={{ fontSize: 25, fontWeight: 600, marginTop: 16 }}>Dùng Face ID cho lần sau?</div>
          <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', marginTop: 8, maxWidth: 280, lineHeight: 1.5 }}>Lần sau chỉ cần nhìn máy là vào — không cần chờ SMS. Bật/tắt được trong Mama.</div>
        </div>
        <div style={{ padding: '0 24px 48px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ButtonPrimary onClick={() => finish(true)}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}><Ic name="faceid" size={22} sw={2.2} /> Bật Face ID</span></ButtonPrimary>
          <ButtonText onClick={() => finish(false)} style={{ textAlign: 'center' }}>Để sau cũng được</ButtonText>
        </div>
      </AuthScaffold>);

  }
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
        {netErr && !success &&
        <div style={{ width: '100%', marginTop: 16 }}>
          <Banner icon="☁️">Mạng lag chút xíu. Mình thử lại nhé. <span onClick={() => setNetErr(false)} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Thử lại</span></Banner>
        </div>
        }
        <div style={{ marginTop: 22, fontSize: 13.5, color: 'var(--text-muted)' }}>
          {success ? <span style={{ color: 'var(--success)', fontWeight: 700 }}>Xác thực thành công 💚</span> :
          secs > 0 ? <>Mã hết hạn sau <b style={{ color: 'var(--text-primary)' }}>{mm}:{ss}</b></> :
          <span onClick={() => setSecs(299)} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Gửi lại mã</span>}
        </div>
        {secs < 240 && !success && <ButtonText onClick={() => setSecs(299)} style={{ marginTop: 6 }}>Gửi lại mã</ButtonText>}
      </div>
    </AuthScaffold>);

}

function AuthFlow({ ctx }) {
  const [step, setStep] = useState(ctx.route.authStep || 'A1');
  useEffect(() => {if (ctx.route.authStep) setStep(ctx.route.authStep);}, [ctx.route.authStep]);
  const go = (s) => setStep(s);
  const M = { A1, A2, A3, intro: A1 };
  const S = M[step] || A1;
  return <S go={go} ctx={ctx} />;
}

/* ============================================================
   ONBOARDING 10A / 10B (+ due date, progressive disclosure)
   ============================================================ */
function OB1({ go }) {
  return (
    <AuthScaffold>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', textAlign: 'center' }}>
        <Bong emotion="excited" onesie="orange" size={250} float />
        <div className="serif" style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.08, marginTop: 16 }}>Mừng mama<br />đã đến!</div>
        <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginTop: 12, maxWidth: 290, lineHeight: 1.5 }}>Cùng nhau, mình sẽ hiểu bé hơn mỗi ngày — nhẹ nhàng và không vội vã.</div>
      </div>
      <div style={{ padding: '0 24px 48px' }}><ButtonPrimary onClick={() => go('ob2')}>Bắt đầu</ButtonPrimary></div>
    </AuthScaffold>);

}

function DueDateField({ mode, setMode, due, setDue }) {
  return (
    <div data-comment-anchor="d6fa4a943c-div-186-7">
      <Input label="Ngày dự sinh (không bắt buộc)" value={due} onChange={setDue} placeholder="DD / MM / YYYY" type="tel" rightSlot={<Ic name="cal" size={20} stroke="var(--text-muted)" />} />
      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 8 }}>Leap tính theo ngày dự sinh — vì não bé phát triển từ trong bụng mẹ. Với bé sinh sớm/muộn 2 tuần trở lên, điền ngày dự sinh giúp dự báo đúng hơn nhiều 💛</div>
    </div>);

}

function OB2({ go, ctx }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [dueMode, setDueMode] = useState('');
  const [due, setDue] = useState('');
  const finish = () => {
    if (ctx.updateBaby && /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/.test(dob)) ctx.updateBaby(name || 'Bống', dob.replace(/\s/g, ''));
    ctx.goFlow('app');ctx.setTab('today');
    ctx.toast('Chào mừng hai mẹ con 💛');
  };
  return (
    <AuthScaffold flowers={false}>
      <AppBar title="Chào bé yêu!" onBack={() => go('ob1')} />
      <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}><Bong emotion="curious" onesie="sage" size={104} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Tên bé (không bắt buộc)" value={name} onChange={setName} placeholder="VD: Bống" />
          <Input label="Ngày sinh" value={dob} onChange={setDob} placeholder="DD / MM / YYYY" type="tel" rightSlot={<Ic name="cal" size={20} stroke="var(--text-muted)" />} />
          <DueDateField mode={dueMode} setMode={setDueMode} due={due} setDue={setDue} />
          <div>
            <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Giới tính (không bắt buộc)</label>
            <div style={{ display: 'flex', gap: 9 }}>
              {['Bé gái', 'Bé trai', 'Chưa rõ'].map((g) => <Chip key={g} active={gender === g} onClick={() => setGender(g)} style={{ flex: 1 }}>{g}</Chip>)}
            </div>
          </div>
        </div>
        <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Chỉ ngày sinh là cần thiết — còn lại để sau cũng được.</Banner>
        <div style={{ padding: '24px 0 44px' }}><ButtonPrimary disabled={!dob} onClick={finish}>Tiếp tục</ButtonPrimary></div>
      </div>
    </AuthScaffold>);

}

function OnboardFlow({ ctx }) {
  const [step, setStep] = useState(ctx.route.obStep || 'ob1');
  useEffect(() => {if (ctx.route.obStep) setStep(ctx.route.obStep);}, [ctx.route.obStep]);
  const go = (s) => setStep(s);
  const M = { ob1: OB1, ob2: OB2, ob3: OB2 };
  const S = M[step] || OB1;
  return <S go={go} ctx={ctx} />;
}

Object.assign(window, { AuthFlow, OnboardFlow, OtpBoxes, AuthScaffold, DueDateField, A3 });