/* ============================================================
   SCREEN 1 — TODAY (Home) v4
   Hero = leap-specific, Symptoms Strip, Action Cards, EASY educational
   + Quick Log Sheet + Soothing Sheet
   ============================================================ */

/* greeting avatar */
function BabyAvatar({ size = 36 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--bg-sunken)', overflow: 'hidden', display: 'grid', placeItems: 'center', flexShrink: 0, border: '1.5px solid var(--border-subtle)' }}>
      <BongFace emotion="happy" size={size * 0.92} />
    </div>
  );
}

function GreetRow({ ctx }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>Chào buổi sáng, mama 💛</div>
        <div className="serif" style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.1, marginTop: 2 }}>{BWW_DATA.BABY.ageLabel}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => ctx.go('notifications')} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)', position: 'relative' }}>
          <Ic name="bell" size={21} />
          <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', border: '2px solid var(--bg-elevated)' }} />
        </button>
        <BabyAvatar size={42} />
      </div>
    </div>
  );
}

/* 7-day forecast strip */
function ForecastStrip({ data, onPick }) {
  const EMO = { 1: 'blissful', 2: 'happy', 3: 'uncertain', 4: 'crying', 5: 'crying' };
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'space-between' }}>
      {data.map((d, i) => (
        <button key={i} onClick={() => onPick && onPick(d)} style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 2px 7px',
          borderRadius: 'var(--r-md)', background: d.today ? 'var(--bg-accent-soft)' : 'transparent',
          border: d.today ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: d.today ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{d.day}</span>
          <span style={{ width: 30, height: 30, borderRadius: '50%', background: `var(--intensity-${d.n})`, display: 'grid', placeItems: 'center' }}>
            <BongFace emotion={EMO[d.n]} size={26} />
          </span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: `var(--intensity-${d.n})` }} />
        </button>
      ))}
    </div>
  );
}

/* ---- Symptom Detail Bottom Sheet ---- */
function SymptomSheet({ ctx, symptom, leap, open, onClose }) {
  if (!symptom || !leap) return null;
  const action = leap.actions.find(a => a.title.toLowerCase().includes(symptom.toLowerCase().slice(0, 6)));
  return (
    <Sheet open={open} onClose={onClose} height="58%" title={symptom}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {action ? (
          <>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)' }}><b>Vì sao?</b> {action.why}</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)' }}><b>Nên làm gì?</b> {action.what}</div>
          </>
        ) : (
          <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Đây là biểu hiện bình thường ở Leap {leap.n}. Bé đang học {leap.skill}. Ôm bé nhiều hơn và kiên nhẫn nhé mama 💛
          </div>
        )}
        <Banner icon="💛" tone="soft">Mỗi leap rồi sẽ qua. Bé đang lớn lên ngay trong vòng tay mama.</Banner>
      </div>
    </Sheet>
  );
}

/* ---- Action Card (Muby: left intensity strip, progressive disclosure) ---- */
function ActionCard({ action, onSound, intensity = 4, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 3, flexShrink: 0, background: `var(--intensity-${intensity})` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* header row — always visible, ≥48pt tap target */}
          <button onClick={() => setOpen(o => !o)} aria-expanded={open} style={{
            width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: '14px 14px 14px 16px',
            minHeight: 56, textAlign: 'left',
          }}>
            <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{action.emoji}</span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{action.title}</span>
            <Ic name="chevron" size={18} stroke="var(--text-muted)" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }} />
          </button>
          {/* detail — progressive disclosure */}
          <div style={{ maxHeight: open ? 400 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height .3s ease, opacity .22s' }}>
            <div style={{ padding: '0 16px 16px 16px' }}>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Vì sao?</span> {action.why}
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 8 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Nên làm:</span> {action.what}
              </div>
              {action.hasSound && onSound && (
                <button onClick={onSound} style={{
                  marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 16px', minHeight: 44,
                  borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: 'var(--text-on-accent)',
                  fontSize: 13, fontWeight: 700,
                }}>🎵 Bật tiếng ồn trắng</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---- EASY Educational Card (collapsible) ---- */
function EasyEducationCard() {
  const [open, setOpen] = useState(false);
  const info = BWW_DATA.EASY_INFO;
  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px',
        textAlign: 'left',
      }}>
        <span style={{ fontSize: 20 }}>📘</span>
        <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>Tìm hiểu phương pháp EASY</span>
        <Ic name="chevron" size={18} stroke="var(--text-muted)" style={{ transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform .2s' }} />
      </button>
      <div style={{
        maxHeight: open ? 400 : 0, opacity: open ? 1 : 0, overflow: 'hidden',
        transition: 'max-height .35s ease, opacity .25s',
      }}>
        <div style={{ padding: '0 16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            <b style={{ color: 'var(--text-primary)' }}>EASY là gì?</b> {info.desc}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-accent-soft)', borderRadius: 'var(--r-md)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)' }}>{info.variant}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>phù hợp với bé {BWW_DATA.BABY.ageLabel}</span>
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{info.detail}</div>
          <Banner icon="☁️" tone="soft" style={{ fontSize: 13 }}>{info.note}</Banner>
          <ButtonText onClick={() => {}} style={{ textAlign: 'left', padding: 0 }}>Xem chi tiết EASY trong thư viện →</ButtonText>
        </div>
      </div>
    </Card>
  );
}

/* ---- Sunny Play section (when intensity <= 2) ---- */
function SunnyPlaySection({ leap, ctx }) {
  const plays = leap.sunnyPlay || [];
  if (plays.length === 0) return null;
  return (
    <div>
      <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 4, padding: '0 2px' }}>Sunny Play — Bé sẵn sàng học! 🌼</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, padding: '0 2px' }}>Hoạt động nhẹ nhàng cho Leap {leap.n}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {plays.map((a, i) => (
          <Card key={i} pad={14} onClick={() => !ctx.premium && ctx.openPaywall && ctx.openPaywall('Mở khóa hướng dẫn từng bước')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 'var(--r-md)', background: 'var(--intensity-1)', display: 'grid', placeItems: 'center', flexShrink: 0 }}><BongFace emotion="curious" size={36} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{a.desc}</div>
              </div>
              <span style={{ fontSize: 12.5, color: 'var(--accent-primary)', fontWeight: 700, whiteSpace: 'nowrap' }}>Thử ngay →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TODAY SCREEN — v4 main
   ============================================================ */
let _todayLoaded = false;

function TodayScreen({ ctx }) {
  const { intensity, empty } = ctx;
  const C = BWW_DATA.INTENSITY_COPY[intensity];
  const { CURRENT_LEAP, LEAP_DAY, LEAP_TOTAL } = BWW_DATA;
  const [loading, setLoading] = useState(!_todayLoaded);
  const [symptomPick, setSymptomPick] = useState(null);

  useEffect(() => {
    if (_todayLoaded) return;
    const t = setTimeout(() => { _todayLoaded = true; setLoading(false); }, 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div style={{ flex: 1, overflow: 'hidden', padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GreetRow ctx={ctx} />
        <SkeletonCard h={185} />
        <SkeletonCard h={50} />
        <SkeletonCard h={130} />
        <SkeletonCard h={92} />
      </div>
    );
  }

  if (empty) {
    return (
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 0' }}><GreetRow ctx={ctx} /></div>
        <EmptyState emotion="snug" onesie="cream"
          heading="Chưa có gì hôm nay"
          helper="Cứ thong thả mama 💛 Khi nào sẵn sàng, mình ghi lại khoảnh khắc đầu tiên nhé."
          action={<ButtonPrimary onClick={() => ctx.openSheet('quicklog')}>Ghi nhanh</ButtonPrimary>} />
      </div>
    );
  }

  const sunny = intensity <= 2;

  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GreetRow ctx={ctx} />

        {/* ===== HERO CARD (Muby: gradient hero + intensity band) ===== */}
        <HeroCard intensity={intensity} pad={0}>
          <div style={{ display: 'flex', padding: '16px 14px 18px 18px', gap: 6 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <IntensityBadge level={intensity} size="lg" />
              <div className="serif" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2, marginTop: 12, color: 'var(--text-on-hero)' }}>
                Leap {CURRENT_LEAP.n} · {CURRENT_LEAP.world}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-on-hero)', opacity: 0.8, lineHeight: 1.45, marginTop: 6 }}>
                Bé đang học: <b style={{ opacity: 1 }}>{CURRENT_LEAP.skill}</b>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 'var(--r-full)', background: 'rgba(255,255,255,0.12)', marginTop: 10, fontSize: 12, fontWeight: 600, color: 'var(--text-on-hero)', opacity: 0.9 }}>
                Ngày {LEAP_DAY}/{LEAP_TOTAL}
              </div>
              {intensity >= 4 && (
                <div>
                <button onClick={() => ctx.openSheet('soothing')} style={{
                  marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 15px',
                  borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: '#fff',
                  fontSize: 13.5, fontWeight: 700,
                }}>🎵 Bật tiếng ồn trắng</button>
                </div>
              )}
            </div>
            <div style={{ alignSelf: 'flex-end', flexShrink: 0 }}>
              <BongIntensity level={intensity} size={118} float />
            </div>
          </div>
        </HeroCard>

        {/* ===== SYMPTOMS STRIP (v4 NEW) ===== */}
        {CURRENT_LEAP.symptoms && CURRENT_LEAP.symptoms.length > 0 && (
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, padding: '0 2px' }}>📌 Biểu hiện thường thấy ở leap này:</div>
            <div className="no-sb" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
              {CURRENT_LEAP.symptoms.map((s, i) => (
                <button key={i} onClick={() => setSymptomPick(s)} style={{
                  flexShrink: 0, padding: '11px 16px', minHeight: 44, borderRadius: 'var(--r-full)', fontSize: 13.5, fontWeight: 600,
                  background: 'var(--bg-accent-soft)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                }}>{s}</button>
              ))}
            </div>
            <button onClick={() => ctx.go('leapdetail')} style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, marginTop: 4, padding: '10px 2px', minHeight: 44 }}>
              Đúng con mình! Xem cách giúp bé →
            </button>
          </div>
        )}

        {/* ===== ACTION CARDS: "Giúp bé hợp tác" (v4 — replaces EASY timeline) ===== */}
        {CURRENT_LEAP.actions && CURRENT_LEAP.actions.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)' }}>Giúp bé hợp tác ở Leap {CURRENT_LEAP.n}</div>
              <ButtonText onClick={() => ctx.go('leapdetail')} style={{ padding: 0 }}>Xem tất cả →</ButtonText>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CURRENT_LEAP.actions.slice(0, 3).map((a, i) => (
                <ActionCard key={i} action={a} intensity={intensity} defaultOpen={i === 0} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
              ))}
            </div>
          </div>
        )}

        {/* ===== EASY EDUCATIONAL CARD (v4 — collapsible, educational only) ===== */}
        <EasyEducationCard />

        {/* ===== SUNNY PLAY (when sunny) ===== */}
        {sunny && <SunnyPlaySection leap={CURRENT_LEAP} ctx={ctx} />}

        {/* ===== FORECAST ===== */}
        <Card pad={14}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>7 ngày tới</div>
          <ForecastStrip data={BWW_DATA.FORECAST} onPick={() => ctx.setTab('leap')} />
        </Card>

        {/* ===== RECENT LOGS ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)' }}>Vừa ghi</div>
            <ButtonText onClick={() => ctx.go('history')} style={{ padding: 0 }}>Xem tất cả</ButtonText>
          </div>
          <div className="no-sb" style={{ display: 'flex', gap: 9, overflowX: 'auto', paddingBottom: 2 }}>
            {BWW_DATA.RECENT_LOGS.map((l, i) => (
              <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-1)' }}>
                <span style={{ fontSize: 18 }}>{l.icon}</span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{l.detail}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.ago}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SMART REMINDER ===== */}
        <Banner icon="🍼" tone="sunken">Khoảng <b style={{ color: 'var(--text-primary)' }}>11:30</b> bé có thể đói. Mình sẽ nhắc nhẹ nhé.</Banner>
      </div>

      {/* Symptom detail sheet */}
      <SymptomSheet ctx={ctx} symptom={symptomPick} leap={CURRENT_LEAP} open={!!symptomPick} onClose={() => setSymptomPick(null)} />
    </div>
  );
}

/* ============================================================
   SCREEN 2 — QUICK LOG SHEET (unchanged from v3)
   ============================================================ */
function QuickLogSheet({ ctx, open }) {
  const tiles = [
    { id: 'feed', emo: 'eating', onesie: 'orange', label: 'Cữ ăn', sub: '80ml', icon: '🍼' },
    { id: 'sleep', emo: 'sleeping', onesie: 'lavender', label: 'Giấc ngủ', sub: 'bây giờ', icon: '🌙' },
    { id: 'diaper', emo: 'happy', onesie: 'sage', label: 'Tã', sub: 'Ướt', icon: '💧' },
    { id: 'mood', emo: 'blissful', onesie: 'cream', label: 'Cảm xúc', sub: '', icon: '💛' },
    { id: 'soothe', emo: 'snug', onesie: 'lavender', label: 'Dỗ bé', sub: '', icon: '🎵' },
    { id: 'play', emo: 'curious', onesie: 'orange', label: 'Sunny Play', sub: '', icon: '🌼' },
  ];
  const tap = (t) => {
    if (t.id === 'soothe') { ctx.openSheet('soothing'); return; }
    if (t.id === 'play') { ctx.closeSheet(); ctx.setTab('leap'); return; }
    ctx.closeSheet();
    ctx.toast(`Đã ghi ${t.label.toLowerCase()} rồi. Bạn đang làm rất tốt ❤️`);
  };
  return (
    <Sheet open={open} onClose={ctx.closeSheet} height="66%" title="Ghi nhanh" sub="Một chạm là xong. Không cần điền gì thêm.">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11, marginTop: 8 }}>
        {tiles.map((t) => (
          <button key={t.id} onClick={() => tap(t)} style={{
            aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
            background: 'var(--bg-sunken)', borderRadius: 'var(--r-lg)', border: '1.5px solid var(--border-subtle)',
            transition: 'transform .12s',
          }}
          onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
          onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <BongFace emotion={t.emo} size={48} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{t.label}</div>
            {t.sub && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{t.sub}</div>}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

/* ============================================================
   SCREEN 2B — SOOTHING SHEET (unchanged)
   ============================================================ */
function SoothingSheet({ ctx, open }) {
  const [playing, setPlaying] = useState(null);
  const [timer, setTimer] = useState(30);
  const [bg, setBg] = useState(true);
  return (
    <Sheet open={open} onClose={ctx.closeSheet} height="82%" title="Hộp công cụ dỗ bé" sub="Không cần mạng 💤">
      <div className="no-sb" style={{ display: 'flex', gap: 13, overflowX: 'auto', paddingBottom: 6, marginTop: 4 }}>
        {BWW_DATA.SOOTHING.map((s) => {
          const locked = s.premium && !ctx.premium && ctx.intensity < 4;
          const isOn = playing === s.id;
          return (
            <div key={s.id} style={{
              flexShrink: 0, width: 150, borderRadius: 'var(--r-lg)', overflow: 'hidden',
              background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ height: 86, background: s.tint, position: 'relative', display: 'grid', placeItems: 'center', fontSize: 38 }}>
                {s.emoji}
                {locked && <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(42,26,20,0.55)', color: '#fff', borderRadius: 'var(--r-full)', padding: '3px 9px', fontSize: 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><Ic name="lock" size={11} sw={2.4} /> Premium</span>}
              </div>
              <div style={{ padding: '12px 13px 14px' }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <button onClick={() => locked ? ctx.openPaywall('Mở khóa âm thanh dỗ bé') : setPlaying(isOn ? null : s.id)} style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: locked ? 'var(--border-default)' : 'var(--accent-primary)', color: locked ? 'var(--text-muted)' : 'var(--text-on-accent)',
                    display: 'grid', placeItems: 'center',
                  }}>
                    {locked ? <Ic name="lock" size={18} /> : <Ic name={isOn ? 'pause' : 'play'} size={20} />}
                  </button>
                  <input type="range" min="0" max="100" defaultValue="60" disabled={locked} style={{ flex: 1, accentColor: 'var(--accent-primary)' }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 22, fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>Hẹn giờ tắt</div>
      <div style={{ display: 'flex', gap: 9 }}>
        {[15, 30, 45, 60].map(t => <Chip key={t} active={timer === t} onClick={() => setTimer(t)} style={{ flex: 1 }}>{t}p</Chip>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, padding: '14px 16px', background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)' }}>
        <span style={{ fontSize: 14.5, fontWeight: 600 }}>Chạy nền khi tắt màn hình</span>
        <button onClick={() => setBg(b => !b)} style={{ width: 50, height: 30, borderRadius: 'var(--r-full)', background: bg ? 'var(--accent-primary)' : 'var(--border-default)', position: 'relative', transition: 'background .2s' }}>
          <span style={{ position: 'absolute', top: 3, left: bg ? 23 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: 'var(--shadow-1)' }} />
        </button>
      </div>
    </Sheet>
  );
}

Object.assign(window, { TodayScreen, QuickLogSheet, SoothingSheet, BabyAvatar, ActionCard, SunnyPlaySection });
