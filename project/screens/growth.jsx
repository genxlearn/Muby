/* ============================================================
   SCREEN 5 Growth · 6 Add Measurement · 7 Log History · 8 Library
   ============================================================ */

/* ---- WHO-style growth chart ---- */
function GrowthChart({ metric }) {
  // weeks 0..16, user points
  const W = 300, H = 180, padL = 8, padR = 8, padT = 12, padB = 18;
  const sets = {
    weight: { lo: [3.0, 4.0, 4.8, 5.4, 5.9, 6.3, 6.6], hi: [4.2, 5.4, 6.4, 7.1, 7.7, 8.2, 8.6], user: [3.3, 4.3, 5.2, 5.8, 6.1, 6.4], unit: 'kg', max: 9, min: 2.5 },
    height: { lo: [49, 53, 56, 58, 60, 61.5, 63], hi: [53, 57, 60, 62.5, 64.5, 66, 67.5], user: [50, 54, 57, 59, 60.5, 61], unit: 'cm', max: 70, min: 47 },
    feed:   { lo: [560, 600, 640, 680, 700, 720, 720], hi: [900, 950, 1000, 1000, 1000, 1000, 1000], user: [580, 650, 720, 780, 700, 640], unit: 'ml/ngày', max: 1100, min: 450 },
    sleep:  { lo: [14, 13.5, 13, 12.5, 12, 12, 12], hi: [17, 17, 16.5, 16.5, 16, 16, 16], user: [16, 15.5, 15, 14.5, 13.5, 14], unit: 'giờ/ngày', max: 18.5, min: 10.5 },
    diaper: { lo: [6, 6, 5.5, 5, 5, 5, 5], hi: [10, 9.5, 9, 8.5, 8, 8, 8], user: [8, 7.5, 7, 6.5, 6, 6], unit: 'tã/ngày', max: 11, min: 3.5 },
  };
  const d = sets[metric];
  const n = d.hi.length;
  const xs = (i, len) => padL + (i / (len - 1)) * (W - padL - padR);
  const ys = (v) => H - padB - ((v - d.min) / (d.max - d.min)) * (H - padT - padB);
  const bandTop = d.hi.map((v, i) => `${xs(i, n).toFixed(1)},${ys(v).toFixed(1)}`).join(' ');
  const bandBot = d.lo.map((v, i) => `${xs(i, n).toFixed(1)},${ys(v).toFixed(1)}`).reverse().join(' ');
  const userPath = d.user.map((v, i) => `${i ? 'L' : 'M'}${xs(i, d.user.length).toFixed(1)} ${ys(v).toFixed(1)}`).join(' ');
  const lastX = xs(d.user.length - 1, d.user.length), lastY = ys(d.user[d.user.length - 1]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {[0.25, 0.5, 0.75].map(f => <line key={f} x1={padL} x2={W - padR} y1={padT + f * (H - padT - padB)} y2={padT + f * (H - padT - padB)} stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="3 4" />)}
      <polygon points={`${bandTop} ${bandBot}`} fill="var(--intensity-1)" opacity="0.5" />
      <polyline points={d.hi.map((v, i) => `${xs(i, n)},${ys(v)}`).join(' ')} fill="none" stroke="var(--success)" strokeWidth="1.5" opacity="0.5" />
      <polyline points={d.lo.map((v, i) => `${xs(i, n)},${ys(v)}`).join(' ')} fill="none" stroke="var(--success)" strokeWidth="1.5" opacity="0.5" />
      <path d={userPath} fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {d.user.map((v, i) => <circle key={i} cx={xs(i, d.user.length)} cy={ys(v)} r="3.5" fill="var(--accent-primary)" stroke="var(--bg-elevated)" strokeWidth="2" />)}
      <circle cx={lastX} cy={lastY} r="6" fill="var(--accent-primary)" stroke="var(--bg-elevated)" strokeWidth="3" />
    </svg>
  );
}

function GrowthScreen({ ctx }) {
  const [metric, setMetric] = useState('weight');
  const { BABY } = BWW_DATA;
  const META = {
    weight: { latest: `${BABY.weight} kg`, sub: 'Bé đang phát triển khoẻ mạnh 💚', band: 'Vùng khoẻ mạnh theo WHO' },
    height: { latest: `${BABY.height} cm`, sub: 'Bé đang phát triển khoẻ mạnh 💚', band: 'Vùng khoẻ mạnh theo WHO' },
    feed: { latest: '640 ml/ngày', sub: 'Bé đang bú đủ — yên tâm nhé mama 💚', band: 'Khoảng thường gặp ở bé cùng tuổi' },
    sleep: { latest: '14 giờ/ngày', sub: 'Ngủ ít hơn chút trong leap là bình thường 💛', band: 'Khoảng thường gặp ở bé cùng tuổi' },
    diaper: { latest: '6 tã/ngày', sub: 'Tã ướt đều đặn = bé bú đủ 💚', band: 'Khoảng thường gặp ở bé cùng tuổi' },
  };
  const m = META[metric];
  const stat = BWW_DATA.DAILY_STATS.find((s) => s.id === metric);

  // nhật ký theo từng tab
  const TYPE_MAP = { feed: 'feed', sleep: 'sleep', diaper: 'diaper' };
  const MEASURE_LOG = [
    { date: 'Hôm nay · 04/07', label: '6.4 kg · 61 cm' },
    { date: '20/06', label: '6.1 kg · 60.5 cm' },
    { date: '05/06', label: '5.8 kg · 59 cm' },
  ];
  const dailyLog = TYPE_MAP[metric]
    ? BWW_DATA.LOG_HISTORY.map((g) => ({ date: g.date, items: g.items.filter((it) => it.type === TYPE_MAP[metric]) })).filter((g) => g.items.length)
    : null;

  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      <div style={{ padding: '6px 20px 0' }}>
        <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Bé lớn lên</div>

        <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 12, padding: '0 2px' }}>Đường lớn của bé</div>
        <div className="no-sb" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '-6px -20px 18px', padding: '6px 20px 10px' }}>
          {[{ id: 'weight', label: 'Cân nặng' }, { id: 'height', label: 'Chiều cao' }, { id: 'feed', label: 'Cữ ăn' }, { id: 'sleep', label: 'Giấc ngủ' }, { id: 'diaper', label: 'Tã' }].map(t => (
            <Chip key={t.id} active={metric === t.id} onClick={() => setMetric(t.id)}>{t.label}</Chip>
          ))}
        </div>

        {/* HÔM NAY — chỉ số đối chiếu của tab đang chọn (cữ ăn / ngủ / tã) */}
        {stat && (() => {
          const inRange = stat.num >= stat.lo && stat.num <= stat.hi;
          const pos = Math.min(100, Math.max(0, ((stat.num - stat.lo) / (stat.hi - stat.lo)) * 60 + 20));
          return (
            <Card pad={16} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--r-md)', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>{stat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{stat.label}</div>
                  <div style={{ fontSize: 16.5, fontWeight: 700, marginTop: 2 }}>{stat.value}</div>
                </div>
                {inRange &&
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 11px', borderRadius: 'var(--r-full)', background: 'var(--success-soft)', color: 'var(--success)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    <Ic name="check" size={13} sw={3} /> Trong khoảng
                  </span>
                }
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'var(--bg-sunken)' }}>
                  <div style={{ position: 'absolute', left: '20%', right: '20%', top: 0, bottom: 0, borderRadius: 4, background: 'var(--success-soft)' }} />
                  <div style={{ position: 'absolute', left: `${pos}%`, top: -3, width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-primary)', border: '2.5px solid var(--bg-elevated)', boxShadow: 'var(--shadow-1)', transform: 'translateX(-50%)' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.45 }}>{stat.range}</div>
              </div>
              <Banner icon="💛" tone="soft" style={{ marginTop: 12, fontSize: 12.5 }}>{stat.note}</Banner>
            </Card>
          );
        })()}

        {/* Số mới nhất — cho cân nặng / chiều cao */}
        {!stat &&
        <Card pad={16} style={{ marginBottom: 24, background: 'var(--bg-accent-soft)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <BongFace emotion="blissful" size={56} ring />
            <div>
              <div className="serif" style={{ fontSize: 26, fontWeight: 600 }}>{m.latest}</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 2 }}>{m.sub}</div>
            </div>
          </div>
        </Card>
        }

        {/* CHART */}
        <Card pad={14} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ width: 14, height: 14, borderRadius: 4, background: 'var(--intensity-1)', opacity: 0.7 }} />
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', fontWeight: 600 }}>{m.band}</span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--accent-primary)', fontWeight: 600 }}><span style={{ width: 16, height: 3, borderRadius: 2, background: 'var(--accent-primary)' }} />Bé</span>
          </div>
          <GrowthChart metric={metric} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, marginTop: 6, padding: '0 2px' }}>
            <span>Mới sinh</span><span>Hiện tại · {BWW_DATA.BABY.ageLabel}</span>
          </div>
        </Card>

        {/* NHẬT KÝ theo tab */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
            <div style={{ fontSize: 15.5, fontWeight: 700 }}>Nhật ký {({ weight: 'đo lường', height: 'đo lường', feed: 'cữ ăn', sleep: 'giấc ngủ', diaper: 'tã' })[metric]}</div>
            <ButtonText onClick={() => ctx.go('history')} style={{ padding: 0 }}>Xem tất cả →</ButtonText>
          </div>
          {dailyLog ? (
            dailyLog.length ? dailyLog.map((g, gi) => (
              <div key={gi} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', margin: '0 2px 8px' }}>{g.date}</div>
                <Card pad={6}>
                  {g.items.map((it, i) => (
                    <div key={i} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                      <ListRow icon={it.icon} title={it.label} right={<span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{it.time}</span>} />
                    </div>
                  ))}
                </Card>
              </div>
            )) : (
              <Card pad={16}><div style={{ fontSize: 13.5, color: 'var(--text-muted)', textAlign: 'center' }}>Chưa có ghi chép hôm nay. Cứ thong thả mama 💛</div></Card>
            )
          ) : (
            <Card pad={6}>
              {MEASURE_LOG.map((r, i) => (
                <div key={i} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <ListRow icon="📏" title={r.label} sub={r.date} right={<Ic name="chevron" size={16} stroke="var(--text-muted)" />} />
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        <ButtonPrimary onClick={() => metric === 'weight' || metric === 'height' ? ctx.go('measure') : ctx.openSheet('quicklog')}>{metric === 'weight' || metric === 'height' ? '+ Thêm đo lường' : '+ Ghi nhanh'}</ButtonPrimary>
      </div>
    </div>
  );
}

/* ---- SCREEN 6 Add Measurement ---- */
function MeasureScreen({ ctx }) {
  const [w, setW] = useState(''); const [h, setH] = useState(''); const [hd, setHd] = useState('');
  const [petals, setPetals] = useState(false);
  const save = () => {
    setPetals(true);
    setTimeout(() => { ctx.back(); ctx.toast('Đã lưu. Bé đang phát triển khoẻ mạnh 💚'); }, 900);
  };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
      <AppBar title="Thêm đo lường" onBack={ctx.back} />
      {petals && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: `${(i * 7 + 5) % 95}%`, top: -10, animation: `petalFall ${1 + (i % 5) * 0.2}s ${i * 0.05}s ease-in forwards` }}>
              <Flower size={14 + (i % 3) * 6} color={['var(--warning)', 'var(--accent-primary)', 'var(--success)'][i % 3]} />
            </div>
          ))}
        </div>
      )}
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 44px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><Bong emotion="happy" onesie="orange" size={100} float /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Ngày đo" value="Hôm nay · 05/06/2026" onChange={() => {}} rightSlot={<Ic name="cal" size={20} stroke="var(--text-muted)" />} />
          <Input label="Cân nặng (kg)" type="tel" value={w} onChange={setW} placeholder="6.4" />
          <Input label="Chiều cao (cm)" type="tel" value={h} onChange={setH} placeholder="61" />
          <Input label="Vòng đầu (cm) · không bắt buộc" type="tel" value={hd} onChange={setHd} placeholder="40.2" />
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={{ flex: 1, height: 80, borderRadius: 'var(--r-md)', border: '1.5px dashed var(--border-default)', background: 'var(--bg-sunken)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12.5, fontWeight: 600 }}><Ic name="camera" size={22} /> Thêm ảnh</button>
            <button style={{ flex: 1, height: 80, borderRadius: 'var(--r-md)', border: '1.5px dashed var(--border-default)', background: 'var(--bg-sunken)', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 12.5, fontWeight: 600 }}>✎ Ghi chú</button>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 16 }} />
        <ButtonPrimary disabled={!w || !h} onClick={save}>Lưu số đo</ButtonPrimary>
      </div>
    </div>
  );
}

/* ---- SCREEN 7 Log History ---- */
function HistoryScreen({ ctx }) {
  const [filter, setFilter] = useState('all');
  const chips = [['all', 'Tất cả'], ['feed', 'Cữ ăn'], ['sleep', 'Giấc ngủ'], ['diaper', 'Tã'], ['mood', 'Cảm xúc']];
  const groups = BWW_DATA.LOG_HISTORY.map(g => ({ ...g, items: g.items.filter(it => filter === 'all' || it.type === filter) })).filter(g => g.items.length);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar title="Nhật ký của bé" onBack={ctx.back} />
      <div className="no-sb" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 20px 14px', marginTop: -6 }}>
        {chips.map(([id, label]) => <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>{label}</Chip>)}
      </div>
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {groups.length === 0 ? (
          <EmptyState emotion="snug" onesie="cream" heading="Chưa có ghi chép nào" helper="Cứ thong thả mama 💛 Mọi khoảnh khắc sẽ được lưu ở đây." />
        ) : groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', margin: '0 2px 12px', letterSpacing: 0.3 }}>{g.date}</div>
            <Card pad={6}>
              {g.items.map((it, i) => (
                <div key={i} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none' }}>
                  <ListRow icon={it.icon} title={it.label} right={<span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{it.time}</span>} />
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- SCREEN 8 Library ---- */
function LibraryScreen({ ctx }) {
  const [tab, setTab] = useState('leap');
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar title="Thư viện" onBack={ctx.back} />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--accent-primary)', padding: 20, color: 'var(--text-on-accent)', marginBottom: 24, position: 'relative' }}>
          <FlowerField items={[{ x: 250, y: -6, s: 60, c: 'rgba(255,255,255,0.18)', r: 10 }, { x: 300, y: 90, s: 40, c: 'rgba(255,255,255,0.14)' }]} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 1.2, opacity: 0.85 }}>CHO TUẦN NÀY CỦA BẠN</div>
            <div className="serif" style={{ fontSize: 23, fontWeight: 600, marginTop: 8, lineHeight: 1.25, maxWidth: 240 }}>Vì sao bé bám mẹ hơn trong Leap 4</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 10 }}>4 phút đọc · dành cho mama</div>
          </div>
        </div>
        <div className="no-sb" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '-6px -20px 14px', padding: '6px 20px 10px' }}>
          {[['leap', 'Theo Leap'], ['age', 'Theo Tuổi'], ['saved', 'Đã lưu'], ['all', 'Tất cả']].map(([id, l]) => <Chip key={id} active={tab === id} onClick={() => setTab(id)}>{l}</Chip>)}
        </div>
        {tab === 'saved' ? (
          <EmptyState emotion="happy" onesie="sage" heading="Chưa lưu bài nào" helper="Chạm ♥ ở bài viết để đọc lại sau nhé mama." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {BWW_DATA.LIBRARY.map((a, i) => (
              <Card key={i} pad={0} style={{ overflow: 'hidden' }} onClick={() => i >= 3 && !ctx.premium ? ctx.openPaywall('Mở khóa toàn bộ thư viện') : null}>
                <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
                  <div style={{ width: 84, flexShrink: 0, background: a.color, position: 'relative', display: 'grid', placeItems: 'center' }}>
                    <Flower size={34} color="rgba(255,255,255,0.5)" />
                    {i >= 3 && !ctx.premium && <span style={{ position: 'absolute', top: 6, right: 6, color: 'var(--text-primary)' }}><Ic name="lock" size={15} /></span>}
                  </div>
                  <div style={{ padding: '13px 14px', flex: 1 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, color: 'var(--accent-primary)' }}>{a.tag}</div>
                    <div style={{ fontSize: 14.5, fontWeight: 600, marginTop: 5, lineHeight: 1.35 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>{a.mins} phút đọc</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { GrowthScreen, MeasureScreen, HistoryScreen, LibraryScreen });
