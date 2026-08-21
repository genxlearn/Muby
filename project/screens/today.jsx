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
    </div>);

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
        <button onClick={() => ctx.go('me')} aria-label="Trang của mama" style={{ padding: 0 }}><BabyAvatar size={42} /></button>
      </div>
    </div>);

}

/* 7-day forecast strip — swipeable, larger cells */
function ForecastStrip({ data, onPick }) {
  const EMO = { 1: 'blissful', 2: 'happy', 3: 'uncertain', 4: 'crying', 5: 'crying' };
  return (
    <div className="no-sb" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '-8px -4px -6px', padding: '8px 4px 14px' }} data-comment-anchor="6b3a4a48da-div-38-5">
      {data.map((d, i) =>
      <button key={i} onClick={() => onPick && onPick(d)} style={{
        flexShrink: 0, width: 64, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '10px 4px',
        borderRadius: 'var(--r-md)', background: d.today ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)',
        border: d.today ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent'
      }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: d.today ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{d.today ? 'Hôm nay' : d.day}</span>
          <span style={{ width: 44, height: 44, borderRadius: '50%', background: `var(--intensity-${d.n})`, display: 'grid', placeItems: 'center' }}>
            <BongFace emotion={EMO[d.n]} size={38} />
          </span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--intensity-${d.n})` }} />
        </button>
      )}
    </div>);

}

/* ---- Symptom Detail Bottom Sheet ---- */
function SymptomSheet({ ctx, symptom, leap, open, onClose }) {
  if (!symptom || !leap) return null;
  const action = leap.actions.find((a) => a.title.toLowerCase().includes(symptom.toLowerCase().slice(0, 6)));
  return (
    <Sheet open={open} onClose={onClose} height="58%" title={symptom}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {action ?
        <>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)' }}><b>Vì sao?</b> {action.why}</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-primary)' }}><b>Nên làm gì?</b> {action.what}</div>
          </> :

        <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Đây là biểu hiện bình thường ở Leap {leap.n}. Bé đang học {leap.skill}. Ôm bé nhiều hơn và kiên nhẫn nhé mama 💛
          </div>
        }
        <Banner icon="💛" tone="soft">Mỗi leap rồi sẽ qua. Bé đang lớn lên ngay trong vòng tay mama.</Banner>
      </div>
    </Sheet>);

}

/* ---- Action Card (Muby: left intensity strip, progressive disclosure) ---- */
function ActionCard({ action, onSound, intensity = 4, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* header row — always visible, ≥48pt tap target */}
          <button onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{
            width: '100%', display: 'flex', gap: 12, alignItems: 'center', padding: '14px 14px 14px 16px',
            minHeight: 56, textAlign: 'left'
          }}>
            <Icon3D emo={action.emoji} size={40} />
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
              {action.hasSound && onSound &&
              <button onClick={onSound} style={{
                marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 16px', minHeight: 44,
                borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: 'var(--text-on-accent)',
                fontSize: 13, fontWeight: 700
              }}>🎵 Bật tiếng ồn trắng</button>
              }
            </div>
          </div>
        </div>
      </div>
    </Card>);

}

/* ---- EASY teaser card → trang giải thích riêng ---- */
function EasyEducationCard({ ctx }) {
  const info = BWW_DATA.EASY_INFO;
  const BLOCKS = [
  { k: 'E', label: 'Ăn', icon: '🍼' },
  { k: 'A', label: 'Chơi', icon: '✨' },
  { k: 'S', label: 'Ngủ', icon: '🌙' },
  { k: 'Y', label: 'Mama', icon: '☕' }];

  return (
    <Card pad={0} style={{ overflow: 'hidden' }} onClick={() => ctx.go('easy')}>
      <button style={{ width: '100%', textAlign: 'left', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }} aria-label="Tìm hiểu phương pháp EASY">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          <div style={{ flex: 1 }} data-comment-anchor="882a89bdb1-div-132-11">
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>Nhịp sinh hoạt EASY</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 4 }}>{info.variant} · phù hợp bé {BWW_DATA.BABY.ageLabel}</div>
          </div>
          <span style={{ fontSize: 12.5, color: 'var(--accent-primary)', fontWeight: 700, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: 3 }}>Tìm hiểu <Ic name="chevron" size={15} sw={2.2} /></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
          {BLOCKS.map((b) =>
          <div key={b.k} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px', borderRadius: 'var(--r-md)', background: 'var(--bg-sunken)' }}>
              <Icon3D emo={b.icon} size={32} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-primary)' }}>{b.k} · {b.label}</span>
            </div>
          )}
        </div>
      </button>
    </Card>);
}

/* ---- Trang EASY — giải thích đầy đủ (stack) ---- */
function EasyScreen({ ctx }) {
  const info = BWW_DATA.EASY_INFO;
  const STEPS = [
  { k: 'E', name: 'Eat — Ăn', icon: '🍼', desc: 'Bé thức dậy là được ăn ngay. Bú lúc tỉnh táo giúp bé ăn no hơn, không ngủ quên giữa cữ.' },
  { k: 'A', name: 'Activity — Chơi', icon: '✨', desc: 'Sau ăn là lúc bé tỉnh táo nhất: tummy time, nói chuyện, nhìn ngắm. Với bé 3–4 tháng, 60–90 phút thức là vừa đủ.' },
  { k: 'S', name: 'Sleep — Ngủ', icon: '🌙', desc: 'Thấy bé dụi mắt, ngáp, quay mặt đi — đó là tín hiệu buồn ngủ. Đặt bé xuống khi lim dim, bé sẽ học tự vào giấc.' },
  { k: 'Y', name: 'Your time — Của mama', icon: '☕', desc: 'Bé ngủ = giờ của bạn. Nghỉ ngơi, ăn uống, hay đơn giản là ngồi yên một chút. Chăm mình cũng là chăm con.' }];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar title="Phương pháp EASY" onBack={ctx.back} />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 44px' }} data-comment-anchor="32d823f80d-div-162-7">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <Bong emotion="snug" onesie="sage" size={92} float />
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            Trong Leap {BWW_DATA.CURRENT_LEAP.n}, thế giới của bé đang thay đổi — một nhịp <b style={{ color: 'var(--text-primary)' }}>quen thuộc</b> giúp con đoán được điều gì đến tiếp theo, nên bớt bất an hơn.
          </div>
        </div>

        <Card pad={16} style={{ background: 'var(--bg-accent-soft)', marginBottom: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--accent-primary)', marginBottom: 12 }}>EASY GIÚP GÌ TRONG LEAP {BWW_DATA.CURRENT_LEAP.n}?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
            ['🍼', 'Bé có thể bú ít mỗi cữ nhưng đòi ăn nhiều lần — cứ theo nhịp E, không ép đủ lượng.'],
            ['🌙', 'Trong leap bé dễ mệt sớm — đặt ngủ sớm hơn 30 phút so với lịch quen.'],
            ['✨', 'Giữ nguyên trình tự Ăn → Chơi → Ngủ — sự quen thuộc chính là điểm tựa của con lúc này.']].
            map(([e, t], i) =>
            <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.55 }}><span>{e}</span><span>{t}</span></div>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {STEPS.map((s, i) =>
          <Card key={s.k} pad={14}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Icon3D emo={s.icon} size={44} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700 }}><span style={{ color: 'var(--accent-primary)' }}>{s.k}</span> · {s.name.split(' — ')[1]}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, marginTop: 4 }}>{s.desc}</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card pad={16} style={{ background: 'var(--bg-accent-soft)', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', marginBottom: 6 }}>{info.variant} — DÀNH CHO BÉ {BWW_DATA.BABY.ageLabel.toUpperCase()}</div>
          <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{info.detail}</div>
        </Card>

        <Banner icon="☁️" tone="soft" style={{ marginBottom: 24 }}>{info.note}</Banner>

        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
          EASY là khung tham khảo, không phải lịch cứng.<br />Bé của bạn luôn là người dẫn nhịp 💛
        </div>
      </div>
    </div>);
}

/* ---- Sunny Play section (when intensity <= 2) ---- */
function SunnyPlaySection({ leap, ctx }) {
  const plays = leap.sunnyPlay || [];
  if (plays.length === 0) return null;
  return (
    <div>
      <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 4, padding: '0 2px' }}>Sunny Play — Bé sẵn sàng học! 🌼</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, padding: '0 2px' }}>Hoạt động nhẹ nhàng cho Leap {leap.n}</div>
      <div className="no-sb" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '-8px -20px -10px', padding: '8px 20px 18px', scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }} data-comment-anchor="d49af464b9-div-206-7">
        {plays.map((a, i) =>
        <div key={i} style={{ flexShrink: 0, width: 250, scrollSnapAlign: 'start', borderRadius: 'var(--r-lg)', background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-2)', border: '1px solid var(--border-subtle)', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ width: 46, height: 46, borderRadius: 'var(--r-md)', background: 'var(--intensity-1)', display: 'grid', placeItems: 'center' }}><BongFace emotion="curious" size={36} /></div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{a.title}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{a.desc}</div>
            <button onClick={() => !ctx.premium && ctx.openPaywall && ctx.openPaywall('Mở khóa hướng dẫn từng bước')} style={{ alignSelf: 'flex-start', minHeight: 44, padding: '10px 16px', borderRadius: 'var(--r-full)', background: 'var(--bg-accent-soft)', color: 'var(--accent-primary)', fontSize: 13, fontWeight: 700 }}>Thử ngay →</button>
          </div>
        )}
      </div>
    </div>);

}

/* ---- Sunny: "Hôm nay của bé" — rotating daily card (fact / game / photo) ---- */
function TodayOfBabyCard({ ctx, variant }) {
  const d = variant || BWW_DATA.SUNNY.daily;
  return (
    <Card pad={16}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--accent-primary)', marginBottom: 8 }}>{d.label}</div>
      <div style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-primary)' }}>{d.text}</div>
      {d.action &&
      <button onClick={() => ctx.toast('Đã lưu vào Khoảnh khắc 🎉')} style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '10px 16px', borderRadius: 'var(--r-full)', background: 'var(--bg-accent-soft)', color: 'var(--accent-primary)', fontSize: 13.5, fontWeight: 700 }}>📸 {d.action}</button>
      }
    </Card>);
}

/* ---- Sunny: "Kỹ năng đang nở" — blossoming skills + milestone button ---- */
function BloomSection({ ctx }) {
  const S = BWW_DATA.SUNNY;
  const [saved, setSaved] = useState({});
  if (!S.bloom.length) return null;
  return (
    <div>
      <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 12, padding: '0 2px' }}>Kỹ năng đang nở sau Leap {S.refLeap.n} 🌱</div>
      <div className="no-sb" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '-8px -20px -10px', padding: '8px 20px 18px', scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }} data-comment-anchor="9b7830c37f-div-245-7">
        {S.bloom.map((b, i) =>
        <div key={i} style={{ flexShrink: 0, width: 264, scrollSnapAlign: 'start', borderRadius: 'var(--r-lg)', background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-2)', border: '1px solid var(--border-subtle)', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.35 }}>{b.sign}</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55, flex: 1 }}>{b.game}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            <button onClick={() => {setSaved((s) => ({ ...s, [i]: true }));ctx.toast(`Đã lưu khoảnh khắc đầu tiên con ${b.skill} 🎉`);}} disabled={saved[i]} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, minHeight: 44, padding: '10px 14px', borderRadius: 'var(--r-full)',
              background: saved[i] ? 'var(--success-soft, var(--bg-sunken))' : 'var(--bg-accent-soft)',
              color: saved[i] ? 'var(--success)' : 'var(--accent-primary)', fontSize: 13, fontWeight: 700
            }}>{saved[i] ? '✓ Đã lưu vào Nhật ký' : '🎉 Con làm được rồi!'}</button>
            {!ctx.premium &&
            <button onClick={() => ctx.openPaywall('Mở khóa hướng dẫn từng bước')} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', minHeight: 44, padding: '10px 4px' }}>Từng bước →</button>
            }
          </div>
        </div>
        )}
      </div>
    </div>);
}

/* ---- "Chuẩn bị cho Leap {n+1}" — pre-leap prep card ---- */
function PrepCard({ ctx }) {
  const S = BWW_DATA.SUNNY;
  if (!S.prep || !S.nextLeap) return null;
  return (
    <Card pad={16} style={{ background: 'var(--bg-accent-soft)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, color: 'var(--accent-primary)', marginBottom: 8 }}>☁️ CHUẨN BỊ CHO LEAP {S.nextLeap.n}</div>
      <div style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-primary)' }}>
        Leap {S.nextLeap.n} sắp đến (dự kiến ngày {S.nextDate}). Vài dấu hiệu sớm: <b>{S.prep.signs.join(', ')}</b>.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
        {S.prep.tips.map((t, i) =>
        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}><span>·</span><span>{t}</span></div>
        )}
      </div>
      <button onClick={() => ctx.go('leapdetail')} style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: 'var(--accent-primary)', minHeight: 44, padding: '10px 2px' }}>Đọc trước về Leap {S.nextLeap.n} →</button>
    </Card>);
}

/* ---- Post-leap premium moment (one-time, dismissible, never at intensity ≥ 4) ---- */
function PostLeapCard({ ctx, onDismiss }) {
  const S = BWW_DATA.SUNNY;
  const done = S.refLeap;
  if (!done || ctx.intensity >= 4 || ctx.purchased) return null;
  return (
    <Card pad={16}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Bong emotion="blissful" onesie="sage" size={64} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.4 }}>Leap {done.n} đã qua rồi 🌼 Mama và {BWW_DATA.BABY.name} đã cùng nhau vượt qua.</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 6 }}>
            {S.nextLeap ? <>Leap {S.nextLeap.n} sẽ đến trong khoảng {Math.max(1, Math.round((S.daysToNext || 7) / 7))} tuần nữa. Mở khóa toàn bộ 10 leap để luôn sẵn sàng nhé.</> : 'Mở khóa toàn bộ 10 leap để luôn sẵn sàng nhé.'}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button onClick={() => ctx.openPaywall('Luôn sẵn sàng cho leap tiếp theo')} style={{ minHeight: 44, padding: '10px 16px', borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: '#fff', fontSize: 13, fontWeight: 700 }}>Xem Muby Premium</button>
            <button onClick={onDismiss} style={{ minHeight: 44, padding: '10px 12px', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>Để sau</button>
          </div>
        </div>
      </div>
    </Card>);
}

/* ============================================================
   TODAY SCREEN — v4 main
   ============================================================ */
let _todayLoaded = false;

function TodayScreen({ ctx }) {
  const { intensity, empty } = ctx;
  const C = BWW_DATA.INTENSITY_COPY[intensity];
  const { CURRENT_LEAP, LEAP_DAY, LEAP_TOTAL } = BWW_DATA;
  const PHASE = BWW_DATA.leapPhase(LEAP_DAY, LEAP_TOTAL);
  const [loading, setLoading] = useState(ctx.loading ? true : !_todayLoaded);
  const [symptomPick, setSymptomPick] = useState(null);
  const [actionIdx, setActionIdx] = useState(0);
  const [postLeapDismissed, setPostLeapDismissed] = useState(false);
  const sunny = intensity <= 2;
  const S = BWW_DATA.SUNNY;

  useEffect(() => {
    if (ctx.loading || _todayLoaded) return;
    const t = setTimeout(() => {_todayLoaded = true;setLoading(false);}, 700);
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
      </div>);

  }

  if (ctx.error) {
    return (
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <GreetRow ctx={ctx} />
          <Banner icon="☁️">Không tải được. Thử lại nhé 💛 <span onClick={() => ctx.toast('Đang tải lại…')} style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>Thử lại</span></Banner>
          <div style={{ opacity: 0.55 }}><HeroCard intensity={intensity} pad={0}>
            <div style={{ padding: '16px 20px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'var(--text-on-hero)', opacity: 0.65 }}>BẢN LƯU GẦN NHẤT</div>
              <div className="serif" style={{ fontSize: 19, fontWeight: 600, marginTop: 8, color: 'var(--text-on-hero)' }}>Bé đang ở đoạn giữa của Leap {CURRENT_LEAP.n}</div>
            </div>
          </HeroCard></div>
        </div>
      </div>);
  }

  if (empty) {
    return (
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 0' }}><GreetRow ctx={ctx} /></div>
        <EmptyState emotion="snug" onesie="cream"
        heading="Chưa có gì hôm nay"
        helper="Cứ thong thả mama 💛 Khi nào sẵn sàng, mình ghi lại khoảnh khắc đầu tiên nhé."
        action={<ButtonPrimary onClick={() => ctx.openSheet('quicklog')}>Ghi nhanh</ButtonPrimary>} />
      </div>);

  }

  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
      <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <GreetRow ctx={ctx} />

        {/* ===== HERO (compact: dự báo + giai đoạn + progress + 7 ngày) ===== */}
        <HeroCard intensity={intensity} pad={0}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px 0' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'var(--text-on-hero)', opacity: 0.65 }}>DỰ BÁO HÔM NAY</span>
            {!sunny &&
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-on-hero)', opacity: 0.75 }}>Ngày {LEAP_DAY}/{LEAP_TOTAL} · còn khoảng {LEAP_TOTAL - LEAP_DAY} ngày</span>
            }
          </div>
          <div style={{ display: 'flex', padding: '10px 14px 0 20px', gap: 6 }}>
            <div style={{ flex: 1, minWidth: 0 }} data-comment-anchor="e04de58e50-div-233-13">
              <IntensityBadge level={intensity} size="sm" />
              <div className="serif" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.22, marginTop: 10, color: 'var(--text-on-hero)' }}>
                {sunny ? <>Tuần nắng của {BWW_DATA.BABY.name} 🌼</> : <>Bé đang ở {PHASE.name} của Leap {CURRENT_LEAP.n}</>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-on-hero)', opacity: 0.85, lineHeight: 1.5, marginTop: 6 }}>
                {sunny ? C.copy : PHASE.desc}
              </div>
              {sunny && S && S.nextLeap &&
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-on-hero)', opacity: 0.85, marginTop: 8 }} data-comment-anchor="432e5b1ce0-div-394-15">
                🌤️ Leap {S.nextLeap.n} dự kiến bắt đầu ngày {S.nextDate} — còn {S.daysToNext} ngày nữa
              </div>
              }
              {intensity >= 4 &&
              <div>
                <button onClick={() => ctx.openSheet('soothing')} style={{
                  marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 15px',
                  borderRadius: 'var(--r-full)', background: 'rgba(255,255,255,0.92)', color: 'var(--accent-primary)',
                  fontSize: 13.5, fontWeight: 700
                }}>🎵 Bật tiếng ồn trắng</button>
                </div>
              }
            </div>
            <div style={{ alignSelf: 'flex-end', flexShrink: 0 }}>
              <BongIntensity level={intensity} size={100} float />
            </div>
          </div>
          {/* progress mỏng */}
          <div style={{ padding: '10px 20px 0' }}>
            <div style={{ height: 4, borderRadius: 3, background: 'rgba(255,255,255,0.22)' }}>
              <div style={{ width: `${Math.round(LEAP_DAY / LEAP_TOTAL * 100)}%`, height: '100%', borderRadius: 3, background: 'rgba(255,255,255,0.9)' }} />
            </div>
          </div>
          {/* 7 ngày tới — gắn vào đáy hero, không cần card riêng */}
          <div style={{ margin: '12px 6px 6px', background: 'var(--bg-elevated)', borderRadius: 'calc(var(--r-xl) - 6px)', padding: '10px 10px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 6px 6px' }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-muted)' }}>7 ngày tới</span>
              <button onClick={() => ctx.setTab('leap')} style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: 3, padding: '4px 2px' }}>Xem chi tiết <Ic name="chevron" size={13} sw={2.4} /></button>
            </div>
            <ForecastStrip data={BWW_DATA.FORECAST} onPick={() => ctx.setTab('leap')} />
          </div>
        </HeroCard>

        {/* ===== POST-LEAP PREMIUM MOMENT (sunny, one-time, dismissible) ===== */}
        {sunny && !postLeapDismissed && <PostLeapCard ctx={ctx} onDismiss={() => setPostLeapDismissed(true)} />}

        {/* ===== PRE-LEAP PREP (từ 5 ngày trước leap kế) ===== */}
        {sunny && S && S.prep && S.daysToNext != null && S.daysToNext <= 5 && <PrepCard ctx={ctx} />}

        {/* ===== SLOT 2: stormy = symptoms · sunny = "Hôm nay của bé" ===== */}
        {sunny ?
        <TodayOfBabyCard ctx={ctx} /> :
        CURRENT_LEAP.symptoms && CURRENT_LEAP.symptoms.length > 0 &&
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>Biểu hiện thường thấy</div>
              <ButtonText onClick={() => ctx.go('leapdetail')} style={{ padding: 0 }}>Cách giúp bé →</ButtonText>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {CURRENT_LEAP.symptoms.map((s, i) => {
              const SYMPTOM_EMO = ['crying', 'snug', 'sleeping', 'eating', 'uncertain', 'fussy'];
              return (
                <button key={i} onClick={() => setSymptomPick(s)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px', minHeight: 64,
                  borderRadius: 'var(--r-lg)', background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-1)',
                  border: '1px solid var(--border-subtle)', textAlign: 'left', transition: 'transform .12s'
                }}
                onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
                onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-accent-soft)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    <BongFace emotion={SYMPTOM_EMO[i % SYMPTOM_EMO.length]} size={33} />
                  </span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, lineHeight: 1.35, color: 'var(--text-primary)' }}>{s}</span>
                </button>);

            })}
            </div>
          </div>
        }

        {/* ===== SLOT 3: stormy = action cards · sunny = "Kỹ năng đang nở" ===== */}
        {sunny ?
        <BloomSection ctx={ctx} /> :
        CURRENT_LEAP.actions && CURRENT_LEAP.actions.length > 0 &&
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)' }}>Giúp bé hợp tác ở Leap {CURRENT_LEAP.n}</div>
              <ButtonText onClick={() => ctx.go('leapdetail')} style={{ padding: 0 }}>Tất cả →</ButtonText>
            </div>
            <div className="no-sb" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '-8px -20px -10px', padding: '8px 20px 18px', scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }}
          onScroll={(e) => setActionIdx(Math.min(2, Math.round(e.currentTarget.scrollLeft / 296)))}>
              {CURRENT_LEAP.actions.slice(0, 3).map((a, i) =>
            <div key={i} style={{
              flexShrink: 0, width: 284, scrollSnapAlign: 'start', borderRadius: 'var(--r-lg)',
              background: 'var(--bg-elevated)', boxShadow: 'var(--shadow-2)', border: '1px solid var(--border-subtle)',
              padding: 16, display: 'flex', flexDirection: 'column', gap: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <Icon3D emo={a.emoji} size={42} />
                  <span style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' }}>{a.title}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Vì sao?</span> {a.why}
                </div>
                <div style={{ background: 'var(--bg-accent-soft)', borderRadius: 'var(--r-md)', padding: '10px 12px', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55, marginTop: 'auto' }}>
                  <span style={{ fontWeight: 700 }}>Nên làm:</span> {a.what}
                </div>
                {a.hasSound &&
              <button onClick={() => ctx.openSheet('soothing')} style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 16px', minHeight: 44,
                borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: 'var(--text-on-accent)',
                fontSize: 13, fontWeight: 700
              }}>🎵 Bật tiếng ồn trắng</button>
              }
              </div>
            )}
            </div>
            {/* dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 4 }}>
              {CURRENT_LEAP.actions.slice(0, 3).map((_, i) =>
            <span key={i} style={{ width: i === actionIdx ? 16 : 6, height: 6, borderRadius: 3, background: i === actionIdx ? 'var(--accent-primary)' : 'var(--border-default)', transition: 'all .2s' }} />
            )}
            </div>
          </div>
        }

        {/* ===== EASY EDUCATIONAL CARD (v4 — collapsible, educational only) ===== */}
        <EasyEducationCard ctx={ctx} />

        {/* ===== RECENT LOGS ===== */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 2px' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)' }}>Vừa ghi</div>
            <ButtonText onClick={() => ctx.go('history')} style={{ padding: 0 }}>Xem tất cả</ButtonText>
          </div>
          <div className="no-sb" style={{ display: 'flex', gap: 9, overflowX: 'auto', margin: '-6px -20px -8px', padding: '6px 20px 14px' }}>
            <button onClick={() => ctx.openSheet('quicklog')} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', minHeight: 48, background: 'var(--text-primary)', color: 'var(--bg-canvas)', borderRadius: 'var(--r-full)', fontSize: 13.5, fontWeight: 700, boxShadow: '0 4px 12px rgba(42,26,20,0.25)' }}>
              <Ic name="plus" size={17} sw={2.6} /> Ghi nhanh
            </button>
            {BWW_DATA.RECENT_LOGS.map((l, i) =>
            <div key={i} style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-1)' }}>
                <Icon3D emo={l.icon} size={30} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{l.detail}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.ago}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== SMART REMINDER ===== */}
        <Banner icon="🍼" tone="sunken">Khoảng <b style={{ color: 'var(--text-primary)' }}>11:30</b> bé có thể đói. Mình sẽ nhắc nhẹ nhé.</Banner>
      </div>

      {/* Symptom detail sheet */}
      <SymptomSheet ctx={ctx} symptom={symptomPick} leap={CURRENT_LEAP} open={!!symptomPick} onClose={() => setSymptomPick(null)} />
    </div>);

}

/* ============================================================
   SCREEN 2 — QUICK LOG SHEET (unchanged from v3)
   ============================================================ */
function QuickLogSheet({ ctx, open }) {
  const [detail, setDetail] = useState(null);
  useEffect(() => { if (!open) setDetail(null); }, [open]);
  const tiles = [
  { id: 'feed', emo: 'eating', onesie: 'orange', label: 'Cữ ăn', sub: 'chọn lượng', icon: '🍼' },
  { id: 'sleep', emo: 'sleeping', onesie: 'lavender', label: 'Giấc ngủ', sub: 'chọn giờ', icon: '🌙' },
  { id: 'diaper', emo: 'happy', onesie: 'sage', label: 'Tã', sub: 'chọn loại', icon: '💧' },
  { id: 'mood', emo: 'blissful', onesie: 'cream', label: 'Cảm xúc', sub: '', icon: '💛' },
  { id: 'soothe', emo: 'snug', onesie: 'lavender', label: 'Dỗ bé', sub: '', icon: '🎵' },
  { id: 'play', emo: 'curious', onesie: 'orange', label: 'Sunny Play', sub: '', icon: '🌼' }];

  const tap = (t) => {
    if (t.id === 'soothe') {ctx.openSheet('soothing');return;}
    if (t.id === 'play') {ctx.closeSheet();ctx.setTab('leap');return;}
    setDetail(t.id);
  };
  const save = (label, val) => {
    ctx.closeSheet();
    ctx.toast(`Đã ghi ${label} · ${val}. Bạn đang làm rất tốt ❤️`);
  };
  const OPTS = {
    feed: { title: 'Cữ ăn', q: 'Bé ăn bao nhiêu?', opts: ['60ml', '80ml', '100ml', '120ml', 'Bú mẹ'] },
    sleep: { title: 'Giấc ngủ', q: 'Bé ngủ từ khi nào?', opts: ['Bắt đầu bây giờ', '15 phút trước', '30 phút trước', '1 giờ trước', 'Vừa thức dậy'] },
    diaper: { title: 'Tã', q: 'Tã của bé thế nào?', opts: ['Ướt', 'Bẩn', 'Cả hai'] },
  };
  const MOODS = [['blissful', 'Vui lắm'], ['happy', 'Thoải mái'], ['uncertain', 'Hơi khó'], ['fussy', 'Cáu kỉnh'], ['crying', 'Khóc nhiều']];
  const D = detail && OPTS[detail];
  return (
    <Sheet open={open} onClose={ctx.closeSheet} height="66%"
    title={detail ? (D ? D.title : 'Cảm xúc') : 'Ghi nhanh'}
    sub={detail ? 'Chọn một ô là xong — không cần điền gì thêm.' : 'Chọn một mục, rồi chọn chi tiết. Hai chạm là xong.'}>
      {!detail &&
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11, marginTop: 8 }} data-comment-anchor="fce278506f-div-564-7">
        {tiles.map((t) =>
        <button key={t.id} onClick={() => tap(t)} style={{
          aspectRatio: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
          background: 'var(--bg-sunken)', borderRadius: 'var(--r-lg)', border: '1.5px solid var(--border-subtle)',
          transition: 'transform .12s'
        }}
        onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.94)'}
        onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <BongFace emotion={t.emo} size={48} />
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>{t.label}</div>
            {t.sub && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{t.sub}</div>}
          </button>
        )}
      </div>
      }
      {detail && D &&
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 12 }}>{D.q}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {D.opts.map((o) =>
          <button key={o} onClick={() => save(D.title.toLowerCase(), o)} style={{ minHeight: 56, borderRadius: 'var(--r-md)', background: 'var(--bg-sunken)', border: '1.5px solid var(--border-subtle)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{o}</button>
          )}
        </div>
        <ButtonText onClick={() => setDetail(null)} style={{ textAlign: 'center', width: '100%', marginTop: 16 }}>← Quay lại</ButtonText>
      </div>
      }
      {detail === 'mood' &&
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 12 }}>Hôm nay bé thế nào?</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          {MOODS.map(([emo, label]) =>
          <button key={emo} onClick={() => save('cảm xúc', label.toLowerCase())} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 2px', minHeight: 88, borderRadius: 'var(--r-md)', background: 'var(--bg-sunken)', border: '1.5px solid var(--border-subtle)' }}>
              <BongFace emotion={emo} size={42} />
              <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
            </button>
          )}
        </div>
        <ButtonText onClick={() => setDetail(null)} style={{ textAlign: 'center', width: '100%', marginTop: 16 }}>← Quay lại</ButtonText>
      </div>
      }
    </Sheet>);

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
      <div className="no-sb" style={{ display: 'flex', gap: 12, overflowX: 'auto', margin: '-4px -22px -8px', padding: '8px 22px 16px' }}>
        {BWW_DATA.SOOTHING.map((s) => {
          const locked = s.premium && !ctx.premium && ctx.intensity < 4;
          const isOn = playing === s.id;
          return (
            <div key={s.id} style={{
              flexShrink: 0, width: 150, borderRadius: 'var(--r-lg)', overflow: 'hidden',
              background: 'var(--bg-sunken)', border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ height: 86, background: s.tint, position: 'relative', display: 'grid', placeItems: 'center' }}>
                <Icon3D emo={s.emoji} size={50} />
                {locked && <span style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(42,26,20,0.55)', color: '#fff', borderRadius: 'var(--r-full)', padding: '3px 9px', fontSize: 10.5, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><Ic name="lock" size={11} sw={2.4} /> Premium</span>}
              </div>
              <div style={{ padding: '12px 13px 14px' }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{s.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
                  <button onClick={() => locked ? ctx.openPaywall('Mở khóa âm thanh dỗ bé') : setPlaying(isOn ? null : s.id)} style={{
                    width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                    background: locked ? 'var(--border-default)' : 'var(--accent-primary)', color: locked ? 'var(--text-muted)' : 'var(--text-on-accent)',
                    display: 'grid', placeItems: 'center'
                  }}>
                    {locked ? <Ic name="lock" size={18} /> : <Ic name={isOn ? 'pause' : 'play'} size={20} />}
                  </button>
                  <input type="range" min="0" max="100" defaultValue="60" disabled={locked} style={{ flex: 1, accentColor: 'var(--accent-primary)' }} />
                </div>
              </div>
            </div>);

        })}
      </div>
      <div style={{ marginTop: 24, fontSize: 13.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12 }}>Hẹn giờ tắt</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {[15, 30, 45, 60].map((t) => <Chip key={t} active={timer === t} onClick={() => setTimer(t)} style={{ flex: 1 }}>{t}p</Chip>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, padding: '14px 16px', background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)' }}>
        <span style={{ fontSize: 14.5, fontWeight: 600 }}>Chạy nền khi tắt màn hình</span>
        <button onClick={() => setBg((b) => !b)} style={{ width: 50, height: 30, borderRadius: 'var(--r-full)', background: bg ? 'var(--accent-primary)' : 'var(--border-default)', position: 'relative', transition: 'background .2s' }}>
          <span style={{ position: 'absolute', top: 3, left: bg ? 23 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: 'var(--shadow-1)' }} />
        </button>
      </div>
    </Sheet>);

}

Object.assign(window, { TodayScreen, QuickLogSheet, SoothingSheet, BabyAvatar, ActionCard, SunnyPlaySection, EasyScreen, TodayOfBabyCard, BloomSection, PrepCard, PostLeapCard });