/* ============================================================
   APP SHELL v2 — CLEAN / NO EXTERNAL CONTROLS
   Pure immersive prototype. Start from A1 Welcome.
   ============================================================ */
const { useState: useS, useEffect: useE, useRef: useR } = React;

function Placeholder({ name }) {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 30, textAlign: 'center' }}>
      <div>
        <Bong emotion="curious" onesie="orange" size={120} />
        <div className="serif" style={{ fontSize: 20, marginTop: 12, color: 'var(--text-primary)' }}>{name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Đang tải…</div>
      </div>
    </div>
  );
}

function AppFlow({ ctx }) {
  const { route } = ctx;
  const TABS = {
    today: () => <TodayScreen ctx={ctx} />,
    leap: () => (window.LeapScreen ? <LeapScreen ctx={ctx} /> : <Placeholder name="Leap" />),
    growth: () => (window.GrowthScreen ? <GrowthScreen ctx={ctx} /> : <Placeholder name="Tăng trưởng" />),
    me: () => (window.MeScreen ? <MeScreen ctx={ctx} /> : <Placeholder name="Tôi" />),
  };
  const STACKS = {
    leapdetail: () => (window.LeapDetailScreen ? <LeapDetailScreen ctx={ctx} /> : <Placeholder name="Leap chi tiết" />),
    measure: () => (window.MeasureScreen ? <MeasureScreen ctx={ctx} /> : <Placeholder name="Thêm đo lường" />),
    history: () => (window.HistoryScreen ? <HistoryScreen ctx={ctx} /> : <Placeholder name="Lịch sử ghi" />),
    library: () => (window.LibraryScreen ? <LibraryScreen ctx={ctx} /> : <Placeholder name="Thư viện" />),
    notifications: () => (window.NotificationsScreen ? <NotificationsScreen ctx={ctx} /> : <Placeholder name="Thông báo" />),
  };

  if (route.flow === 'auth') return window.AuthFlow ? <AuthFlow ctx={ctx} /> : <Placeholder name="Auth" />;
  if (route.flow === 'onboard') return window.OnboardFlow ? <OnboardFlow ctx={ctx} /> : <Placeholder name="Onboarding" />;

  if (route.stack) {
    return <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>{(STACKS[route.stack] || (() => <Placeholder name={route.stack} />))()}</div>;
  }
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {(TABS[route.tab] || TABS.today)()}
      <BottomNav active={route.tab} onNav={(t) => ctx.setTab(t)} onFab={() => ctx.openSheet('quicklog')} />
    </div>
  );
}

function Phone({ ctx }) {
  return (
    <div style={{
      width: 393, height: 852, borderRadius: 54, background: 'var(--bg-canvas)', position: 'relative',
      boxShadow: '0 0 0 13px #1c1714, 0 0 0 15px #2c2420, 0 30px 80px rgba(0,0,0,0.35)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'background .3s',
    }}>
      <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 122, height: 35, background: '#000', borderRadius: 20, zIndex: 40 }} />
      <StatusBar />
      <AppFlow ctx={ctx} />
      <QuickLogSheet ctx={ctx} open={ctx.sheet === 'quicklog'} />
      {window.SoothingSheet && <SoothingSheet ctx={ctx} open={ctx.sheet === 'soothing'} />}
      {window.Paywall && <Paywall ctx={ctx} />}
      <Toast toast={ctx.toastVal} />
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'var(--text-primary)', opacity: 0.25, zIndex: 45 }} />
    </div>
  );
}

function App() {
  // Start from Auth Welcome (A1)
  const [theme, setTheme] = useS('light');
  const [route, setRoute] = useS({ flow: 'auth', tab: 'today', stack: null, authStep: 'A1' });
  const [sheet, setSheet] = useS(null);
  const [toastVal, setToastVal] = useS(null);
  const [intensity, setIntensity] = useS(2);
  const [empty, setEmpty] = useS(false);
  const [premium, setPremium] = useS(false);
  const [trial, setTrial] = useS(null); // null | { daysLeft: number }
  const [paywall, setPaywall] = useS(null);
  const toastTimer = useR(null);

  useE(() => { document.documentElement.dataset.theme = theme === 'dark' ? 'dark' : ''; }, [theme]);

  const ctx = {
    theme, route, sheet, toastVal, intensity, empty, paywall,
    premium: premium || !!trial,           // trial unlocks everything
    purchased: premium, trial,
    startTrial: () => { setTrial({ daysLeft: 30 }); },
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

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'grid', placeItems: 'center', background: '#1a1410', overflow: 'hidden' }}>
      <div id="phoneScale" style={{ transformOrigin: 'top left' }}>
        <Phone ctx={ctx} />
      </div>
    </div>
  );
}

function fitPhone() {
  const wrap = document.getElementById('phoneScale');
  if (!wrap) return;
  const availH = window.innerHeight - 32;
  const availW = window.innerWidth - 32;
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
  new ResizeObserver(fitPhone).observe(document.body);
}
