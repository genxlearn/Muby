/* ============================================================
   APP SHELL — iPhone frame, routing, context, toolbar
   ============================================================ */
const { useState: useS, useEffect: useE, useRef: useR } = React;

const SCREEN_INDEX = [
  { id: 'ds', label: '0 · Design System', kind: 'link' },
  { id: 'A1', label: 'A1 · Welcome', kind: 'auth' },
  { id: 'A2', label: 'A2 · Đăng ký', kind: 'auth' },
  { id: 'A3', label: 'A3 · Đăng nhập', kind: 'auth' },
  { id: 'A4', label: 'A4 · OTP', kind: 'auth' },
  { id: 'A5', label: 'A5 · Khôi phục MK', kind: 'auth' },
  { id: 'A6', label: 'A6 · Đặt lại MK', kind: 'auth' },
  { id: 'today', label: '1 · Hôm nay', kind: 'tab' },
  { id: 'quicklog', label: '2 · Ghi nhanh', kind: 'sheet' },
  { id: 'soothing', label: '2B · Dỗ bé', kind: 'sheet' },
  { id: 'leap', label: '3 · Leap', kind: 'tab' },
  { id: 'leapdetail', label: '4 · Leap chi tiết', kind: 'stack' },
  { id: 'growth', label: '5 · Tăng trưởng', kind: 'tab' },
  { id: 'measure', label: '6 · Thêm đo lường', kind: 'stack' },
  { id: 'history', label: '7 · Lịch sử ghi', kind: 'stack' },
  { id: 'library', label: '8 · Thư viện', kind: 'stack' },
  { id: 'notifications', label: '9A · Thông báo', kind: 'stack' },
  { id: 'me', label: '9B · Tôi', kind: 'tab' },
  { id: 'ob1', label: '10A · Onboard', kind: 'onboard' },
  { id: 'ob2', label: '10B · Thêm bé', kind: 'onboard' },
  { id: 'ob3', label: '10C · Mời bố', kind: 'onboard' },
];

function Placeholder({ name }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 30, textAlign: 'center' }}>
      <div>
        <Bong emotion="curious" onesie="orange" size={120} />
        <div className="serif" style={{ fontSize: 20, marginTop: 12, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Màn hình đang được dựng…</div>
      </div>
    </div>
  );
}

/* TAB screens get a bottom nav; STACK screens don't */
function AppFlow({ ctx }) {
  const { route } = ctx;
  const TABS = {
    today: () => <TodayScreen ctx={ctx} />,
    leap: () => (window.LeapScreen ? <LeapScreen ctx={ctx} /> : <Placeholder name="Leap" />),
    growth: () => (window.GrowthScreen ? <GrowthScreen ctx={ctx} /> : <Placeholder name="Lớn khôn" />),
    me: () => (window.MeScreen ? <MeScreen ctx={ctx} /> : <Placeholder name="Mama" />),
  };
  const STACKS = {
    leapdetail: () => (window.LeapDetailScreen ? <LeapDetailScreen ctx={ctx} /> : <Placeholder name="Leap chi tiết" />),
    measure: () => (window.MeasureScreen ? <MeasureScreen ctx={ctx} /> : <Placeholder name="Thêm đo lường" />),
    history: () => (window.HistoryScreen ? <HistoryScreen ctx={ctx} /> : <Placeholder name="Lịch sử ghi" />),
    library: () => (window.LibraryScreen ? <LibraryScreen ctx={ctx} /> : <Placeholder name="Thư viện" />),
    notifications: () => (window.NotificationsScreen ? <NotificationsScreen ctx={ctx} /> : <Placeholder name="Thông báo" />),
    easy: () => (window.EasyScreen ? <EasyScreen ctx={ctx} /> : <Placeholder name="EASY" />),
    me: () => (window.MeScreen ? <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}><AppBar title="" onBack={ctx.back} /><MeScreen ctx={ctx} /></div> : <Placeholder name="Mama" />),
  };

  if (route.flow === 'auth') return window.AuthFlow ? <AuthFlow ctx={ctx} /> : <Placeholder name="Auth" />;
  if (route.flow === 'onboard') return window.OnboardFlow ? <OnboardFlow ctx={ctx} /> : <Placeholder name="Onboarding" />;

  // app flow
  if (route.stack) {
    return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{(STACKS[route.stack] || (() => <Placeholder name={route.stack} />))()}</div>;
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
      {(TABS[route.tab] || TABS.today)()}
      <BottomNav active={route.tab} onNav={(t) => ctx.setTab(t)} onFab={() => ctx.openSheet('quicklog')} />
    </div>
  );
}

/* ---------- iPhone frame ---------- */
function Phone({ ctx }) {
  return (
    <div style={{
      width: 393, height: 852, borderRadius: 54, background: 'var(--bg-canvas)', position: 'relative',
      boxShadow: '0 0 0 13px #1c1714, 0 0 0 15px #2c2420, var(--shadow-4)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'background .3s',
    }}>
      {/* dynamic island */}
      <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 122, height: 35, background: '#000', borderRadius: 20, zIndex: 40 }} />
      <StatusBar />
      <AppFlow ctx={ctx} />
      {/* overlays */}
      <QuickLogSheet ctx={ctx} open={ctx.sheet === 'quicklog'} />
      {window.SoothingSheet && <SoothingSheet ctx={ctx} open={ctx.sheet === 'soothing'} />}
      {window.Paywall && <Paywall ctx={ctx} />}
      <Toast toast={ctx.toastVal} />
      {/* home indicator */}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'var(--text-primary)', opacity: 0.25, zIndex: 45 }} />
    </div>
  );
}

/* ---------- Toolbar control ---------- */
function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: 'var(--bg-sunken)', borderRadius: 'var(--r-full)', padding: 3, gap: 2 }}>
      {options.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} style={{
          padding: '6px 13px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600,
          background: value === o.v ? 'var(--bg-elevated)' : 'transparent',
          color: value === o.v ? 'var(--text-primary)' : 'var(--text-muted)',
          boxShadow: value === o.v ? 'var(--shadow-1)' : 'none',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

function App() {
  const [theme, setTheme] = useS('light');
  const [route, setRoute] = useS({ flow: 'app', tab: 'today', stack: null });
  const [sheet, setSheet] = useS(null);
  const [toastVal, setToastVal] = useS(null);
  const [intensity, setIntensity] = useS(window.BWW_DATA ? BWW_DATA.FORECAST[0].n : 2);
  const [empty, setEmpty] = useS(false);
  const [premium, setPremium] = useS(false);
  const [trial, setTrial] = useS(null); // null | { daysLeft: number }
  const [paywall, setPaywall] = useS(null);
  const [faceId, setFaceId] = useS(true);
  const toastTimer = useR(null);

  useE(() => { document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : ''; }, [theme]);

  const ctx = {
    theme, route, sheet, toastVal, intensity, empty, paywall, faceId, setFaceId,
    premium: premium || !!trial,
    purchased: premium, trial,
    startTrial: () => setTrial({ daysLeft: 7 }),
    cancelTrial: () => setTrial(null),
    updateBaby: (name, dob) => { BWW_DATA.recompute(dob, name); setIntensity(BWW_DATA.FORECAST[0].n); },
    setTheme,
    setTab: (t) => { setRoute({ flow: 'app', tab: t, stack: null }); setSheet(null); },
    go: (stack) => { setRoute(r => ({ ...r, flow: 'app', stack })); setSheet(null); },
    back: () => setRoute(r => ({ ...r, stack: null })),
    goFlow: (flow, extra = {}) => { setRoute({ flow, tab: 'today', stack: null, ...extra }); setSheet(null); },
    setRoute,
    openSheet: (s) => setSheet(s),
    closeSheet: () => setSheet(null),
    setIntensity, setEmpty, setPremium,
    openPaywall: (title) => setPaywall({ title }),
    closePaywall: () => setPaywall(null),
    toast: (text) => {
      setToastVal({ text, id: Date.now() });
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVal(null), 3000);
    },
  };

  // jump-to-screen handler
  const jump = (id) => {
    const s = SCREEN_INDEX.find(x => x.id === id);
    if (!s) return;
    if (s.kind === 'link') { window.open('Design System.html', '_blank'); return; }
    if (s.kind === 'tab') ctx.setTab(id);
    else if (s.kind === 'stack') ctx.go(id);
    else if (s.kind === 'sheet') { ctx.setTab('today'); setTimeout(() => setSheet(id), 60); }
    else if (s.kind === 'auth') ctx.goFlow('auth', { authStep: id });
    else if (s.kind === 'onboard') ctx.goFlow('onboard', { obStep: id });
  };

  const onToday = route.flow === 'app' && route.tab === 'today' && !route.stack;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        padding: '14px 22px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <Flower size={24} color="var(--accent-primary)" />
          <div style={{ fontWeight: 700, fontSize: 15.5 }}>Muby <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>v3 · Prototype</span></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {onToday && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>Hôm nay:</span>
              <Seg value={empty ? 'empty' : 'i' + intensity}
                onChange={(v) => { if (v === 'empty') setEmpty(true); else { setEmpty(false); setIntensity(+v.slice(1)); } }}
                options={[{ v: 'i2', label: '🌼 Nắng' }, { v: 'i4', label: '☁️ Khó' }, { v: 'empty', label: 'Trống' }]} />
            </div>
          )}
          <select onChange={(e) => { jump(e.target.value); e.target.selectedIndex = 0; }} style={{
            padding: '9px 13px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-default)',
            background: 'var(--bg-canvas)', color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
          }}>
            <option>↪ Tới màn hình…</option>
            {SCREEN_INDEX.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <button onClick={() => setPremium(p => !p)} style={{
            padding: '8px 13px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-default)',
            background: premium ? 'var(--accent-soft-bg)' : 'var(--bg-canvas)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600,
          }}>{premium ? '✓ Premium' : 'Free tier'}</button>
          <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} style={{
            padding: '9px 15px', borderRadius: 'var(--r-full)', border: '1px solid var(--border-default)',
            background: 'var(--bg-canvas)', color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 600,
          }}>{theme === 'dark' ? '☀️ Sáng' : '🌙 Tối'}</button>
        </div>
      </div>

      {/* stage */}
      <div id="stage" style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 16, background: 'var(--bg-canvas)', transition: 'background .3s', minHeight: 0, overflow: 'hidden' }}>
        <div id="phoneScale" style={{ transformOrigin: 'top left' }}>
          <Phone ctx={ctx} />
        </div>
      </div>
    </div>
  );
}

function fitPhone() {
  const stage = document.getElementById('stage');
  const wrap = document.getElementById('phoneScale');
  if (!stage || !wrap) return;
  const availH = stage.clientHeight - 24;
  const availW = stage.clientWidth - 24;
  const scale = Math.max(0.05, Math.min(1, availH / 852, availW / 393));
  wrap.style.transform = `scale(${scale})`;
  wrap.style.width = (393 * scale) + 'px';
  wrap.style.height = (852 * scale) + 'px';
}
window.addEventListener('resize', fitPhone);
window.addEventListener('load', fitPhone);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
requestAnimationFrame(fitPhone);
setTimeout(fitPhone, 120);
setTimeout(fitPhone, 600);
if (window.ResizeObserver) {
  const ro = new ResizeObserver(fitPhone);
  setTimeout(() => { const s = document.getElementById('stage'); if (s) ro.observe(s); ro.observe(document.body); }, 200);
}
