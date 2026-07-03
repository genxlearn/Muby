/* ============================================================
   COMPONENT LIBRARY — primitives for every screen
   Exports to window at the end.
   ============================================================ */

const { useState, useEffect, useRef } = React;

/* ---------- Flower motif (TinyNest DNA) ---------- */
function Flower({ size = 40, color = 'var(--warning)', center = 'var(--bg-canvas)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={style} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="20" cy="9" rx="6.4" ry="8.4" fill={color}
          transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="4.6" fill={center} />
    </svg>
  );
}

/* scattered flowers decoration layer */
function FlowerField({ items }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {items.map((f, i) => (
        <Flower key={i} size={f.s} color={f.c}
          style={{ position: 'absolute', left: f.x, top: f.y, opacity: f.o ?? 0.9, transform: `rotate(${f.r || 0}deg)` }} />
      ))}
    </div>
  );
}

/* ---------- Icons (stroke) ---------- */
const Icon = {
  home: (p) => <path d="M3 10.5 12 3l9 7.5M5 9.5V20h5v-6h4v6h5V9.5" {...p} />,
  leap: (p) => <path d="M12 3v18M5.5 8.5 12 3l6.5 5.5M4 14c3 2 5 2 8 0s5-2 8 0" {...p} />,
  growth: (p) => <path d="M4 20V4M4 20h16M7 16l4-5 3 3 5-7" {...p} />,
  me: (p) => <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20c1-3.5 4-5 7-5s6 1.5 7 5" {...p} />,
  back: (p) => <path d="M15 5l-7 7 7 7" {...p} />,
  bell: (p) => <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" {...p} />,
  close: (p) => <path d="M6 6l12 12M18 6 6 18" {...p} />,
  plus: (p) => <path d="M12 5v14M5 12h14" {...p} />,
  chevron: (p) => <path d="M9 6l6 6-6 6" {...p} />,
  eye: (p) => <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...p} />,
  eyeOff: (p) => <path d="M3 3l18 18M10 6a9 9 0 0 1 11 6 13 13 0 0 1-2.3 3M6.5 7.5A13 13 0 0 0 3 12s4 7 9 7a8.6 8.6 0 0 0 3.5-.7" {...p} />,
  mic: (p) => <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5 11a7 7 0 0 0 14 0M12 18v3" {...p} />,
  play: (p) => <path d="M8 5v14l11-7z" {...p} />,
  pause: (p) => <path d="M9 5v14M15 5v14" {...p} />,
  lock: (p) => <path d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z" {...p} />,
  check: (p) => <path d="M5 12.5 10 17l9-10" {...p} />,
  music: (p) => <path d="M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" {...p} />,
  camera: (p) => <path d="M3 8h4l2-2h6l2 2h4v12H3zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" {...p} />,
  cal: (p) => <path d="M4 6h16v15H4zM4 10h16M8 3v4M16 3v4" {...p} />,
};
function Ic({ name, size = 24, stroke = 'currentColor', sw = 1.9, style = {} }) {
  const draw = Icon[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke}
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {draw({})}
    </svg>
  );
}

/* ---------- IntensityBadge ---------- */
function IntensityBadge({ level = 2, size = 'md' }) {
  const C = BWW_DATA.INTENSITY_COPY[level];
  const pad = { sm: '4px 10px', md: '6px 13px', lg: '9px 18px' }[size];
  const fs = { sm: 12, md: 13.5, lg: 16 }[size];
  const dot = { sm: 8, md: 10, lg: 13 }[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: pad,
      borderRadius: 'var(--r-full)', background: `var(--intensity-${level})`,
      color: `var(--intensity-${level}-ink)`, fontSize: fs, fontWeight: 600,
      lineHeight: 1, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: dot, height: dot, borderRadius: '50%', background: `var(--intensity-${level}-ink)`, opacity: 0.55 }} />
      {C.label} {C.emoji}
    </span>
  );
}

/* ---------- MiniIntensityCurve (SVG) ---------- */
function MiniIntensityCurve({ data = [2, 3, 4, 4, 5, 4, 3], here = 4, w = 80, h = 24, showHere = true }) {
  const max = 5, min = 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 6) + 3;
    const y = h - 3 - ((v - min) / (max - min)) * (h - 6);
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const hp = pts[here];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--accent-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {showHere && hp && <circle cx={hp[0]} cy={hp[1]} r="3.6" fill="var(--accent-primary)" stroke="var(--bg-elevated)" strokeWidth="2" />}
    </svg>
  );
}

/* ---------- Buttons ---------- */
function ButtonPrimary({ children, onClick, disabled, full = true, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? '100%' : 'auto', minHeight: 56, padding: '0 24px',
      borderRadius: 'var(--r-full)', background: disabled ? 'var(--border-default)' : 'var(--accent-primary)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-on-accent)', fontSize: 16.5, fontWeight: 700,
      transition: 'transform .12s, background .2s', boxShadow: disabled ? 'none' : 'var(--shadow-2)',
      ...style,
    }}
    onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
    onPointerUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    onPointerLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
      {children}
    </button>
  );
}
function ButtonSecondary({ children, onClick, full = true, style = {} }) {
  return (
    <button onClick={onClick} style={{
      width: full ? '100%' : 'auto', minHeight: 56, padding: '0 24px',
      borderRadius: 'var(--r-full)', background: 'transparent', border: '1.5px solid var(--border-default)',
      color: 'var(--text-primary)', fontSize: 16.5, fontWeight: 600, ...style,
    }}>{children}</button>
  );
}
function ButtonText({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      color: 'var(--accent-primary)', fontSize: 15, fontWeight: 600, padding: 8, ...style,
    }}>{children}</button>
  );
}

/* ---------- Card / HeroCard ---------- */
function Card({ children, style = {}, onClick, pad = 18 }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-elevated)', borderRadius: 'var(--r-lg)', padding: pad,
      boxShadow: 'var(--shadow-2)', ...style,
    }}>{children}</div>
  );
}

/* Muby Card/Hero — gradient background, white text, intensity band top */
function HeroCard({ children, intensity, style = {}, pad = 20 }) {
  return (
    <div style={{
      background: 'var(--gradient-hero)', borderRadius: 'var(--r-xl)', overflow: 'hidden',
      boxShadow: 'var(--shadow-3)', color: 'var(--text-on-hero)', position: 'relative', ...style,
    }}>
      {intensity && <div style={{ height: 5, background: `var(--intensity-${intensity})` }} />}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
}

/* ---------- Chip ---------- */
function Chip({ children, active, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 16px', minHeight: 44, borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600,
      whiteSpace: 'nowrap', transition: 'all .15s',
      background: active ? 'var(--bg-accent-soft)' : 'var(--bg-elevated)',
      color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
      border: active ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-subtle)', ...style,
    }}>{children}</button>
  );
}

/* ---------- Input ---------- */
function Input({ label, value, onChange, type = 'text', placeholder, prefix, error, hint, rightSlot, ...rest }) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  const t = isPw ? (show ? 'text' : 'password') : type;
  return (
    <div style={{ width: '100%' }}>
      {label && <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, minHeight: 56, padding: '0 16px',
        background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)',
        border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border-subtle)'}`,
      }}>
        {prefix && <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 16 }}>{prefix}</span>}
        <input type={t} value={value} onChange={(e) => onChange && onChange(e.target.value)} placeholder={placeholder}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16.5, color: 'var(--text-primary)', minWidth: 0 }} {...rest} />
        {isPw && (
          <button onClick={() => setShow(s => !s)} style={{ color: 'var(--text-muted)', display: 'flex' }} aria-label="hiện mật khẩu">
            <Ic name={show ? 'eyeOff' : 'eye'} size={20} sw={1.7} />
          </button>
        )}
        {rightSlot}
      </div>
      {error && <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 6 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

/* ---------- ListRow ---------- */
function ListRow({ icon, iconBg, title, sub, right, onClick, style = {} }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '12px 4px', cursor: onClick ? 'pointer' : 'default', ...style,
    }}>
      {icon && <div style={{
        width: 44, height: 44, borderRadius: 'var(--r-md)', background: iconBg || 'var(--bg-sunken)',
        display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0,
      }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ---------- EmptyState ---------- */
function EmptyState({ emotion = 'snug', onesie = 'cream', heading, helper, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px', gap: 6 }}>
      <Bong emotion={emotion} onesie={onesie} size={160} float />
      <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>{heading}</div>
      {helper && <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', maxWidth: 240, lineHeight: 1.5 }}>{helper}</div>}
      {action && <div style={{ marginTop: 14, width: '100%' }}>{action}</div>}
    </div>
  );
}

/* ---------- Toast (top, 3s) ---------- */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: 'absolute', top: 56, left: '50%', transform: 'translateX(-50%)', zIndex: 60,
      display: 'flex', alignItems: 'center', gap: 9, padding: '11px 18px', maxWidth: '88%',
      background: 'var(--text-primary)', color: 'var(--bg-canvas)', borderRadius: 'var(--r-full)',
      boxShadow: 'var(--shadow-4)', fontSize: 14.5, fontWeight: 600,
      animation: 'toastIn .3s cubic-bezier(.2,.9,.3,1.2)',
    }}>{toast.text}</div>
  );
}

/* ---------- Banner (inline, dismissable) ---------- */
function Banner({ icon, children, tone = 'soft', onClose, style = {} }) {
  const bg = tone === 'soft' ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
      background: bg, borderRadius: 'var(--r-md)', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.45, ...style,
    }}>
      {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && <button onClick={onClose} style={{ color: 'var(--text-muted)', flexShrink: 0 }}><Ic name="close" size={16} sw={2} /></button>}
    </div>
  );
}

/* ---------- SkeletonCard ---------- */
function SkeletonCard({ h = 120 }) {
  return <div className="skeleton" style={{ height: h, borderRadius: 'var(--r-lg)' }} />;
}

/* ---------- WeekCell (calendar) ---------- */
function WeekCell({ w, n, current, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 44, height: 50, borderRadius: 10, background: `var(--intensity-${n})`,
      color: `var(--intensity-${n}-ink)`, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 1, position: 'relative',
      border: current ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
      fontWeight: 700, fontSize: 13,
    }}>
      <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 600 }}>T</span>
      {w}
    </button>
  );
}

/* ---------- EasyBlock (single block) ---------- */
function EasyBlock({ block, current }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '12px 6px', borderRadius: 'var(--r-md)',
      background: current ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)',
      border: current ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
      opacity: block.done ? 0.55 : 1,
    }}>
      <div style={{ fontSize: 20 }}>{block.icon}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{block.label}</div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{block.time}</div>
    </div>
  );
}

/* ---------- Bottom Sheet ---------- */
function Sheet({ open, onClose, height = '65%', children, title, sub }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50, pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,12,8,0.42)',
        opacity: open ? 1 : 0, transition: 'opacity .3s',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height, maxHeight: '92%',
        background: 'var(--bg-elevated)', borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        boxShadow: 'var(--shadow-4)', transform: open ? 'translateY(0)' : 'translateY(101%)',
        transition: 'transform .34s cubic-bezier(.2,.8,.2,1)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--border-default)' }} />
        </div>
        {title && (
          <div style={{ padding: '6px 22px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="serif" style={{ fontSize: 21, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
              {sub && <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 3 }}>{sub}</div>}
            </div>
            <button onClick={onClose} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}>
              <Ic name="close" size={18} sw={2} />
            </button>
          </div>
        )}
        <div className="no-sb" style={{ flex: 1, overflowY: 'auto', padding: '0 22px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

/* ---------- iOS Status Bar ---------- */
function StatusBar({ dark }) {
  const col = 'var(--text-primary)';
  return (
    <div style={{
      height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 30px 0 34px', flexShrink: 0, position: 'relative', zIndex: 5,
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: col, letterSpacing: 0.3 }}>9:41</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: col }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill={col}><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="5" y="4.5" width="3" height="7.5" rx="1"/><rect x="10" y="2" width="3" height="10" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35"/></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill={col}><path d="M8.5 2.5c2 0 3.8.8 5.2 2l1.3-1.4C13.3 1.4 11 .5 8.5.5S3.7 1.4 1.9 3.1L3.3 4.5c1.4-1.2 3.2-2 5.2-2Z"/><path d="M8.5 6c1 0 2 .4 2.7 1.1l1.4-1.4C11.5 4.6 10 4 8.5 4S5.5 4.6 4.4 5.7l1.4 1.4C6.5 6.4 7.5 6 8.5 6Z"/><circle cx="8.5" cy="9.5" r="1.7"/></svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.2" stroke={col} opacity="0.4"/><rect x="2" y="2" width="17" height="9" rx="1.8" fill={col}/><rect x="23.5" y="4" width="1.6" height="5" rx="0.8" fill={col} opacity="0.4"/></svg>
      </div>
    </div>
  );
}

/* ---------- Bottom Nav + FAB ---------- */
function BottomNav({ active, onNav, onFab }) {
  const items = [
    { id: 'today', icon: 'home', label: 'Hôm nay' },
    { id: 'leap', icon: 'leap', label: 'Leap' },
    { id: 'fab' },
    { id: 'growth', icon: 'growth', label: 'Phát triển' },
    { id: 'me', icon: 'me', label: 'Mama' },
  ];
  return (
    <div style={{
      flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'flex-end',
      justifyContent: 'space-around', padding: '8px 8px 30px', background: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border-subtle)', boxShadow: '0 -2px 12px rgba(42,26,20,0.06)',
    }}>
      {items.map((it) => it.id === 'fab' ? (
        <button key="fab" onClick={onFab} aria-label="Ghi nhanh" style={{
          width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-primary)',
          color: 'var(--text-on-accent)', display: 'grid', placeItems: 'center',
          boxShadow: '0 8px 20px rgba(216,114,66,0.42)', transform: 'translateY(-18px)',
          border: '4px solid var(--bg-elevated)',
        }}>
          <Ic name="plus" size={30} sw={2.4} />
        </button>
      ) : (
        <button key={it.id} onClick={() => onNav(it.id)} aria-label={it.label} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 6px', minHeight: 48,
          color: active === it.id ? 'var(--accent-primary)' : 'var(--text-muted)', flex: 1, minWidth: 0,
        }}>
          <Ic name={it.icon} size={25} sw={active === it.id ? 2.2 : 1.8} />
          <span style={{ fontSize: 10.5, fontWeight: active === it.id ? 700 : 500, whiteSpace: 'nowrap' }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- App bar (stack screens) ---------- */
function AppBar({ title, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 12px', flexShrink: 0,
    }}>
      {onBack && <button onClick={onBack} style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--text-primary)', background: 'var(--bg-sunken)' }}><Ic name="back" size={22} /></button>}
      <div className="serif" style={{ flex: 1, fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
      {right}
    </div>
  );
}

/* ---------- Voice recorder pill ---------- */
function VoiceRecorder({ recording, onToggle, error }) {
  return (
    <button onMouseDown={onToggle} onMouseUp={onToggle} style={{
      width: '100%', minHeight: 52, borderRadius: 'var(--r-full)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
      background: recording ? 'var(--accent-primary)' : 'var(--bg-sunken)',
      color: recording ? 'var(--text-on-accent)' : 'var(--text-secondary)',
      fontWeight: 600, fontSize: 15, border: `1.5px solid ${recording ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
      transition: 'all .2s',
    }}>
      <Ic name="mic" size={20} sw={1.9} />
      {recording ? 'Đang nghe…' : 'Giữ để nói'}
      {recording && <span className="rec-wave" style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 3, height: 14, borderRadius: 2, background: 'currentColor', animation: `wave 0.7s ${i*0.12}s ease-in-out infinite` }} />)}
      </span>}
    </button>
  );
}

Object.assign(window, {
  Flower, FlowerField, Ic, Icon, IntensityBadge, MiniIntensityCurve,
  ButtonPrimary, ButtonSecondary, ButtonText, Card, HeroCard, Chip, Input, ListRow,
  EmptyState, Toast, Banner, SkeletonCard, WeekCell, EasyBlock, Sheet,
  StatusBar, BottomNav, AppBar, VoiceRecorder,
});
