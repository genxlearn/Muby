/* ============================================================
   SCREEN 3 — LEAP TAB (3A Hôm nay · 3B Hành trình · 3C Lịch)
   SCREEN 4 — LEAP DETAIL
   v4: specific developmental content, action cards per leap
   ============================================================ */

function SubTabs({ tabs, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--bg-sunken)', borderRadius: 'var(--r-full)', padding: 4, margin: '0 20px' }} data-comment-anchor="7befceb31a-div-9-5">
      {tabs.map((t) =>
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        flex: 1, padding: '9px 4px', borderRadius: 'var(--r-full)', fontSize: 13.5, fontWeight: 600,
        background: value === t.id ? 'var(--bg-elevated)' : 'transparent',
        color: value === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
        boxShadow: value === t.id ? 'var(--shadow-1)' : 'none', transition: 'all .15s'
      }}>{t.label}</button>
      )}
    </div>);

}

const FORECAST_EMO = { 1: 'blissful', 2: 'happy', 3: 'uncertain', 4: 'crying', 5: 'crying' };

/* ---- 3A Hôm nay (v4: specific content) ---- */
function LeapToday({ ctx }) {
  const { intensity } = ctx;
  const C = BWW_DATA.INTENSITY_COPY[intensity];
  const { CURRENT_LEAP, LEAP_DAY, LEAP_TOTAL } = BWW_DATA;
  const PHASE = BWW_DATA.leapPhase(LEAP_DAY, LEAP_TOTAL);
  const sunny = intensity <= 2;

  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }} data-comment-anchor="e6ced5d135-div-32-5">
      {/* HERO — phase-based framing */}
      <Card pad={0} style={{ overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: 5, background: `var(--intensity-${intensity})` }} />
        <div style={{ padding: '18px 16px', display: 'flex', gap: 6 }}>
          <div style={{ flex: 1 }}>
            <IntensityBadge level={intensity} size="md" />
            <div className="serif" style={{ fontSize: 21, fontWeight: 600, marginTop: 12, lineHeight: 1.22 }}>
              Bé đang ở {PHASE.name} của Leap {CURRENT_LEAP.n}
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 6 }}>
              {PHASE.desc}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginTop: 8 }}>
              Ngày {LEAP_DAY}/{LEAP_TOTAL} · còn khoảng {LEAP_TOTAL - LEAP_DAY} ngày
            </div>
          </div>
          <div style={{ alignSelf: 'flex-end', flexShrink: 0 }}>
            <BongIntensity level={intensity} size={128} float />
          </div>
        </div>
      </Card>

      {/* FORECAST */}
      <Card pad={14}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>7 ngày tới</div>
        <div className="no-sb" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '-6px -6px -6px', padding: '6px 6px 12px' }} data-comment-anchor="e9ba184d9e-div-58-9">
          {BWW_DATA.FORECAST.map((d, i) =>
          <div key={i} style={{
            flexShrink: 0, width: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '10px 4px',
            borderRadius: 'var(--r-md)', background: d.today ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)',
            border: d.today ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent'
          }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: d.today ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{d.today ? 'Hôm nay' : d.day}</span>
              <span style={{ width: 44, height: 44, borderRadius: '50%', background: `var(--intensity-${d.n})`, display: 'grid', placeItems: 'center' }}>
                <BongFace emotion={FORECAST_EMO[d.n]} size={38} />
              </span>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--intensity-${d.n})` }} />
            </div>
          )}
        </div>
      </Card>

      {/* Symptoms — quan trọng, ngay sau dự báo; badge xuống dòng */}
      {CURRENT_LEAP.symptoms && CURRENT_LEAP.symptoms.length > 0 &&
      <div data-comment-anchor="274fa89efd-div-120-7">
          <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12, padding: '0 2px' }}>📌 Biểu hiện thường thấy:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CURRENT_LEAP.symptoms.map((s, i) =>
          <span key={i} style={{
            padding: '8px 14px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600,
            background: 'var(--bg-accent-soft)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)'
          }}>{s}</span>
          )}
          </div>
        </div>
      }

      {/* "ĐANG XẢY RA GÌ?" — SPECIFIC description from leap data */}
      <Card onClick={() => ctx.go('leapdetail')}>
        <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1, color: 'var(--accent-primary)' }}>ĐANG XẢY RA GÌ?</div>
        <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>{CURRENT_LEAP.fullName}</div>
        <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.55, whiteSpace: 'pre-line' }}>
          {CURRENT_LEAP.desc.split('\n')[0]}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, minHeight: 44, padding: '10px 16px', borderRadius: 'var(--r-full)', background: 'var(--bg-accent-soft)', color: 'var(--accent-primary)', fontSize: 13, fontWeight: 700 }}>Xem chi tiết <Ic name="chevron" size={14} sw={2.4} /></span>
      </Card>

      {/* CONTEXT-AWARE SECTION */}
      {sunny ? (
      /* Sunny Play — per-leap activities */
      <SunnyPlaySection leap={CURRENT_LEAP} ctx={ctx} />) : (

      /* Stormy — "Giúp bé hợp tác" action cards from leap data */
      CURRENT_LEAP.actions && CURRENT_LEAP.actions.length > 0 ?
      <div>
            <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 12, padding: '0 2px' }}>Giúp bé hợp tác ở Leap {CURRENT_LEAP.n}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CURRENT_LEAP.actions.map((a, i) =>
          <ActionCard key={i} action={a} intensity={ctx.intensity} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
          )}
            </div>
          </div> :

      <div>
            <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 12, padding: '0 2px' }}>Cách dỗ bé hôm nay 🤍</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
          { emoji: '🎵', title: 'Tiếng ồn trắng', what: 'Mô phỏng âm thanh trong bụng mẹ, giúp bé dịu lại.', why: '', hasSound: true },
          { emoji: '🤱', title: 'Da kề da', what: 'Đặt bé lên ngực mẹ, hơi ấm làm bé bình tĩnh.', why: '' }].
          map((a, i) =>
          <ActionCard key={i} action={a} intensity={ctx.intensity} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
          )}
            </div>
          </div>)

      }

      <Banner icon="💛" tone="soft">Bé hôm nay thế nào rồi mama? <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }} onClick={() => ctx.openSheet('quicklog')}>Ghi lại cảm xúc</span></Banner>
    </div>);

}

/* ---- 3B Hành trình (timeline — unchanged) ---- */
function LeapJourney({ ctx }) {
  const { LEAPS, CURRENT_LEAP, BABY } = BWW_DATA;
  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 16px' }}>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 23, top: 12, bottom: 12, width: 2.5, background: 'var(--border-subtle)' }} />
        {LEAPS.map((lp) => {
          const past = lp.range[1] < BABY.ageWeeks;
          const current = lp.n === CURRENT_LEAP.n;
          return (
            <div key={lp.n} style={{ display: 'flex', gap: 16, marginBottom: current ? 8 : 18, position: 'relative' }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', flexShrink: 0, zIndex: 1, display: 'grid', placeItems: 'center',
                background: past ? 'var(--success)' : current ? 'var(--accent-primary)' : 'var(--bg-sunken)',
                color: past || current ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: 16,
                border: '3px solid var(--bg-canvas)'
              }}>{past ? <Ic name="check" size={22} sw={2.6} /> : lp.n}</div>
              {current ?
              <Card pad={15} style={{ flex: 1, border: '1.5px solid var(--accent-primary)' }} onClick={() => ctx.go('leapdetail')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, color: 'var(--accent-primary)' }}>ĐANG DIỄN RA</div>
                      <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginTop: 3 }}>Leap {lp.n} · {lp.world}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>Bé đang học: {lp.skill}</div>
                    </div>
                    <BongIntensity level={ctx.intensity} size={56} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                    <IntensityBadge level={ctx.intensity} size="sm" />
                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <MiniIntensityCurve w={92} h={28} />
                      <span style={{ fontSize: 10.5, color: 'var(--accent-primary)', fontWeight: 700 }}>▼ Hôm nay</span>
                    </div>
                  </div>
                </Card> :

              <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: past ? 'var(--text-secondary)' : 'var(--text-primary)' }}>Leap {lp.n} · {lp.world}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Khoảng tuần {lp.wk} · {past ? 'Đã qua' : 'Sắp tới'}</div>
                </div>
              }
            </div>);

        })}
      </div>
    </div>);

}

/* ---- 3C Lịch (calendar — tuần/ngày + chi tiết 7 ngày trong tuần) ---- */
function LeapCalendar({ ctx }) {
  const weeks = BWW_DATA.buildCalendar();
  const [pick, setPick] = useState(null);
  const [legend, setLegend] = useState(true);
  const [mode, setMode] = useState('week'); // 'week' | 'day'
  const DOW = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const curIdx = weeks.findIndex((w) => w.current);
  const todayDow = (new Date().getDay() + 6) % 7; // 0=T2
  const dayN = (weekN, di) => Math.max(1, Math.min(5, weekN + [-1, 0, 0, 1, 0, 0, -1][di]));
  // day mode: 14 ngày tới
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();d.setDate(d.getDate() + i);
    const wi = Math.min(weeks.length - 1, curIdx + Math.floor((todayDow + i) / 7));
    return { d, n: dayN(weeks[wi].n, (todayDow + i) % 7), today: i === 0, w: weeks[wi].w };
  });
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 16px' }} data-comment-anchor="e2757568b0-div-195-5">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700 }}>77 tuần kỳ diệu</div>
        <button onClick={() => setLegend((l) => !l)} style={{ fontSize: 12.5, color: 'var(--accent-primary)', fontWeight: 600 }}>{legend ? 'Ẩn chú thích' : 'Chú thích'}</button>
      </div>
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-sunken)', borderRadius: 'var(--r-full)', padding: 4, marginBottom: 16 }}>
        {[['week', 'Theo tuần'], ['day', 'Theo ngày']].map(([id, l]) =>
        <button key={id} onClick={() => setMode(id)} style={{ flex: 1, padding: '9px 4px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600, background: mode === id ? 'var(--bg-elevated)' : 'transparent', color: mode === id ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: mode === id ? 'var(--shadow-1)' : 'none' }}>{l}</button>
        )}
      </div>
      {legend &&
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {[[1, 'Nắng'], [3, 'Hơi ấm'], [5, 'Cần mama']].map(([l, t]) =>
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 14, height: 14, borderRadius: 4, background: `var(--intensity-${l})` }} />{t}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--bg-elevated)', border: '2.5px solid var(--accent-primary)' }} />Hôm nay (bé đang ở đây)
          </div>
        </div>
        }
      {mode === 'week' ?
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 7 }}>
        {weeks.map((w) =>
          <button key={w.w} onClick={() => setPick(w)} style={{
            aspectRatio: '0.9', borderRadius: 9, background: `var(--intensity-${w.n})`, color: `var(--intensity-${w.n}-ink)`,
            fontSize: 12, fontWeight: 700, border: w.current ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
            display: 'grid', placeItems: 'center'
          }}>{w.w}</button>
          )}
      </div> :
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {days.map((d, i) =>
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', minHeight: 52, borderRadius: 'var(--r-md)', background: 'var(--bg-elevated)', border: d.today ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)' }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: `var(--intensity-${d.n})`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <BongFace emotion={FORECAST_EMO[d.n]} size={28} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.today ? 'Hôm nay' : `${DOW[(d.d.getDay() + 6) % 7]} · ${d.d.getDate()}/${d.d.getMonth() + 1}`}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Tuần {d.w} · {BWW_DATA.INTENSITY_COPY[d.n].label}</div>
            </div>
            {d.today && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-primary)' }}>Bé đang ở đây</span>}
          </div>
        )}
      </div>
      }
    </div>
      <Sheet open={!!pick} onClose={() => setPick(null)} height="58%" title={pick ? `Tuần ${pick.w}` : ''} sub={pick ? `7 ngày trong tuần này` : ''}>
        {pick &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {DOW.map((lbl, di) => {
              const n = dayN(pick.n, di);
              const isToday = pick.current && di === todayDow;
              return (
                <div key={di} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '8px 2px', borderRadius: 'var(--r-md)', background: isToday ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)', border: isToday ? '2px solid var(--accent-primary)' : '2px solid transparent' }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: isToday ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{lbl}</span>
                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: `var(--intensity-${n})`, display: 'grid', placeItems: 'center' }}>
                      <BongFace emotion={FORECAST_EMO[n]} size={21} />
                    </span>
                  </div>);
            })}
            </div>
            {pick.current && <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--accent-primary)', textAlign: 'center' }}>▼ Bé đang ở {DOW[todayDow]} tuần này</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center' }}>
              <BongIntensity level={pick.n} size={84} />
              <div>
                <IntensityBadge level={pick.n} size="md" />
                <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 190, lineHeight: 1.5, marginTop: 8 }}>{BWW_DATA.INTENSITY_COPY[pick.n].copy}</div>
              </div>
            </div>
          </div>
        }
      </Sheet>
    </div>);

}

function LeapScreen({ ctx, initialSub }) {
  const [sub, setSub] = useState(initialSub || 'today');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '6px 0 12px' }}>
        <div className="serif" style={{ fontSize: 24, fontWeight: 600, padding: '0 20px 12px' }}>Hành trình của bé</div>
        <SubTabs value={sub} onChange={setSub} tabs={[{ id: 'today', label: 'Hôm nay' }, { id: 'cal', label: 'Lịch' }, { id: 'journey', label: 'Hành trình' }]} />
      </div>
      {sub === 'today' && <LeapToday ctx={ctx} />}
      {sub === 'journey' && <LeapJourney ctx={ctx} />}
      {sub === 'cal' && <LeapCalendar ctx={ctx} />}
    </div>);

}

/* ============================================================
   SCREEN 4 — Leap Detail (v4: specific content from leap data)
   ============================================================ */
function LeapDetailScreen({ ctx }) {
  const [tab, setTab] = useState('now');
  const { CURRENT_LEAP } = BWW_DATA;
  const locked = CURRENT_LEAP.n >= 4 && !ctx.premium;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar title="" onBack={ctx.back} right={<button onClick={() => ctx.go('library')} style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600, padding: 8 }}>Thư viện</button>} />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {/* HERO */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <BongIntensity level={ctx.intensity} size={120} float />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1.5, color: 'var(--accent-primary)' }}>LEAP {CURRENT_LEAP.n}</div>
            <div className="serif" style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.08, margin: '4px 0 6px' }}>{CURRENT_LEAP.fullName}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 8 }}>Bé đang học: {CURRENT_LEAP.skill}</div>
            <IntensityBadge level={ctx.intensity} size="sm" />
          </div>
        </div>

        {/* Intensity curve */}
        <Card pad={14} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Bạn đang ở đây</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Ngày {BWW_DATA.LEAP_DAY}/{BWW_DATA.LEAP_TOTAL}</span>
          </div>
          <MiniIntensityCurve w={300} h={56} />
        </Card>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-sunken)', borderRadius: 'var(--r-full)', padding: 4, marginBottom: 20 }}>
          {[{ id: 'now', label: 'Đang xảy ra' }, { id: 'actions', label: 'Giúp bé' }, { id: 'hist', label: 'Lịch sử' }].map((t) =>
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '9px 4px', borderRadius: 'var(--r-full)', fontSize: 13.5, fontWeight: 600,
            background: tab === t.id ? 'var(--bg-elevated)' : 'transparent', color: tab === t.id ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: tab === t.id ? 'var(--shadow-1)' : 'none'
          }}>{t.label}</button>
          )}
        </div>

        {/* TAB: Đang xảy ra — v4: SPECIFIC developmental description */}
        {tab === 'now' &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>{CURRENT_LEAP.desc}</div>

            {/* Symptoms */}
            {CURRENT_LEAP.symptoms && CURRENT_LEAP.symptoms.length > 0 &&
          <div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 12 }}>📌 Biểu hiện thường thấy:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CURRENT_LEAP.symptoms.map((s, i) =>
              <span key={i} style={{
                padding: '7px 13px', borderRadius: 'var(--r-full)', fontSize: 13, fontWeight: 600,
                background: 'var(--bg-accent-soft)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)'
              }}>{s}</span>
              )}
                </div>
              </div>
          }

            {locked &&
          <Card pad={16} style={{ background: 'var(--bg-accent-soft)', border: '1px dashed var(--accent-primary)' }}>
                <div style={{ fontSize: 14.5, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: 12 }}>Đọc đầy đủ dấu hiệu & cách đồng hành cùng bé qua Leap {CURRENT_LEAP.n}…</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 14 }}>Mở khóa trọn đời — 199.000đ — sau đó 199.000đ trọn đời 💛</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <ButtonPrimary onClick={() => ctx.openPaywall('Mở khóa Leap đầy đủ')} style={{ minHeight: 48 }}>Dùng thử 1 tháng</ButtonPrimary>
                  <ButtonSecondary onClick={ctx.back} style={{ minHeight: 48 }}>Để sau</ButtonSecondary>
                </div>
              </Card>
          }
          </div>
        }

        {/* TAB: Giúp bé — v4: leap-specific action cards */}
        {tab === 'actions' &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CURRENT_LEAP.actions && CURRENT_LEAP.actions.length > 0 ?
          CURRENT_LEAP.actions.map((a, i) =>
          <ActionCard key={i} action={a} intensity={ctx.intensity} onSound={a.hasSound ? () => ctx.openSheet('soothing') : null} />
          ) :

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Giữ nhịp sinh hoạt đều đặn — bé cần dự đoán được điều gì xảy ra tiếp.', 'Cho bé nhiều cơ hội được ôm — đây là nhu cầu thật, không phải thói quen.', 'Chơi trốn tìm để bé luyện khái niệm "biến mất rồi quay lại."'].map((t, i) =>
            <Card key={i} pad={14}><div style={{ display: 'flex', gap: 10 }}><span style={{ color: 'var(--success)' }}><Ic name="check" size={20} sw={2.4} /></span><span style={{ fontSize: 14.5, lineHeight: 1.5 }}>{t}</span></div></Card>
            )}
              </div>
          }
          </div>
        }

        {/* TAB: Lịch sử — past leaps */}
        {tab === 'hist' &&
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {BWW_DATA.LEAPS.filter((lp) => lp.range[1] < BWW_DATA.BABY.ageWeeks).reverse().map((lp, i) =>
          <ListRow key={i} icon={<Ic name="check" size={18} stroke="var(--success)" />} iconBg="color-mix(in srgb, var(--success) 18%, transparent)"
          title={`Leap ${lp.n} · ${lp.world}`} sub={`Tuần ${lp.wk} · đã vượt qua`} />
          )}
            {BWW_DATA.LEAPS.filter((lp) => lp.range[1] < BWW_DATA.BABY.ageWeeks).length === 0 &&
          <EmptyState emotion="curious" onesie="sage" heading="Đây là leap đầu tiên!" helper="Bé đang bắt đầu hành trình kỳ diệu." />
          }
          </div>
        }

        <Banner icon="💛" tone="soft" style={{ marginTop: 18 }}>Mỗi leap rồi sẽ qua. Bé đang lớn lên ngay trong vòng tay mama.</Banner>
      </div>
    </div>);

}

Object.assign(window, { LeapScreen, LeapDetailScreen });