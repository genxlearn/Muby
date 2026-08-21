/* ============================================================
   COMPONENT LIBRARY — primitives for every screen
   Exports to window at the end.
   ============================================================ */

const { useState, useEffect, useRef } = React;

/* ---------- Flower motif (TinyNest DNA) ---------- */
function Flower({ size = 40, color = 'var(--warning)', center = 'var(--bg-canvas)', style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={style} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) =>
      <ellipse key={a} cx="20" cy="9" rx="6.4" ry="8.4" fill={color}
      transform={`rotate(${a} 20 20)`} />
      )}
      <circle cx="20" cy="20" r="4.6" fill={center} />
    </svg>);

}

/* scattered flowers decoration layer */
function FlowerField({ items }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {items.map((f, i) =>
      <Flower key={i} size={f.s} color={f.c}
      style={{ position: 'absolute', left: f.x, top: f.y, opacity: f.o ?? 0.9, transform: `rotate(${f.r || 0}deg)` }} />
      )}
    </div>);

}

/* ---------- Icons — Untitled UI free set style (24×24, 2px stroke, round caps) ---------- */
const Icon = {
  home: (p) => <path d="M8 17h8M11.03 3.13 4.5 8.21c-.55.43-.83.65-1.02.92-.18.25-.31.53-.39.82-.09.33-.09.68-.09 1.38v5.87c0 1.12 0 1.68.22 2.11.19.37.5.68.87.87.43.22.99.22 2.11.22h11.6c1.12 0 1.68 0 2.11-.22.37-.19.68-.5.87-.87.22-.43.22-.99.22-2.11v-5.87c0-.7 0-1.05-.09-1.38a2.4 2.4 0 0 0-.39-.82c-.19-.27-.47-.49-1.02-.92l-6.53-5.08c-.35-.27-.52-.4-.71-.46a1 1 0 0 0-.62 0c-.19.05-.36.19-.71.46Z" {...p} />,
  leap: (p) => <path d="M12 21c-4 0-8-2.5-8-7 0-3.5 2.5-6 5-6 1.5 0 2.5.7 3 1.5.5-.8 1.5-1.5 3-1.5 2.5 0 5 2.5 5 6 0 4.5-4 7-8 7ZM9 3.5C9.7 3 10.8 3 12 3s2.3 0 3 .5" {...p} />,
  growth: (p) => <path d="M21 21H4.6c-.56 0-.84 0-1.05-.11a1 1 0 0 1-.44-.44C3 20.24 3 19.96 3 19.4V3M20 8l-4.7 4.7c-.18.18-.27.27-.37.3a.5.5 0 0 1-.31 0c-.1-.03-.19-.12-.37-.3l-1.5-1.5c-.18-.18-.27-.27-.37-.3a.5.5 0 0 0-.31 0c-.1.03-.19.12-.37.3L7 15.9" {...p} />,
  me: (p) => <path d="M20 21c0-1.4 0-2.1-.17-2.66a4 4 0 0 0-2.67-2.67C16.6 15.5 15.9 15.5 14.5 15.5h-5c-1.4 0-2.1 0-2.66.17a4 4 0 0 0-2.67 2.67C4 18.9 4 19.6 4 21M16 7.5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" {...p} />,
  market: (p) => <path d="M3 8.29c0-.42 0-.63.05-.83.04-.17.1-.34.2-.49.1-.17.25-.32.55-.61l1.55-1.55c.3-.3.44-.44.61-.55.15-.09.32-.16.49-.2.2-.05.4-.05.83-.05h9.44c.42 0 .63 0 .83.05.17.04.34.1.49.2.17.1.32.25.61.55l1.55 1.55c.3.3.44.44.55.61.09.15.16.32.2.49.05.2.05.4.05.83V18.4c0 .9 0 1.35-.17 1.7a1.6 1.6 0 0 1-.7.7c-.35.17-.8.17-1.7.17H5.6c-.9 0-1.35 0-1.7-.17a1.6 1.6 0 0 1-.7-.7C3 19.75 3 19.3 3 18.4V8.29ZM3.5 8.5h17M16 12a4 4 0 0 1-8 0" {...p} />,
  back: (p) => <path d="M15 18l-6-6 6-6" {...p} />,
  bell: (p) => <path d="M14 21h-4M18 8a6 6 0 1 0-12 0c0 3.09-.78 5.2-1.65 6.6-.73 1.17-1.1 1.76-1.09 1.92.02.18.06.25.2.36.14.12.73.12 1.92.12h13.24c1.19 0 1.78 0 1.92-.12.14-.11.18-.18.2-.36.01-.16-.36-.75-1.09-1.93C18.78 13.2 18 11.1 18 8Z" {...p} />,
  close: (p) => <path d="M17 7 7 17M7 7l10 10" {...p} />,
  plus: (p) => <path d="M12 5v14M5 12h14" {...p} />,
  chevron: (p) => <path d="M9 18l6-6-6-6" {...p} />,
  eye: (p) => <path d="M2.42 12.71c-.14-.21-.2-.32-.24-.49a1.2 1.2 0 0 1 0-.44c.04-.17.1-.28.24-.5C3.55 9.5 6.9 5 12 5s8.45 4.5 9.58 6.29c.14.21.2.32.24.49.03.13.03.31 0 .44-.04.17-.1.28-.24.5C20.45 14.5 17.1 19 12 19s-8.45-4.5-9.58-6.29ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" {...p} />,
  eyeOff: (p) => <path d="M10.74 5.09C11.15 5.03 11.57 5 12 5c5.1 0 8.45 4.5 9.58 6.29.14.21.2.32.24.49.03.13.03.31 0 .44-.04.17-.1.28-.24.5-.3.47-.76 1.13-1.36 1.83M6.72 6.72C4.57 8.18 3.09 10.2 2.42 11.28c-.14.21-.2.32-.24.49a1.2 1.2 0 0 0 0 .44c.04.17.1.28.24.5C3.55 14.5 6.9 19 12 19c2.06 0 3.83-.73 5.28-1.72M3 3l18 18M9.88 9.88a3 3 0 1 0 4.24 4.24" {...p} />,
  mic: (p) => <path d="M19 10v1a7 7 0 0 1-14 0v-1M12 18v3M12 15a4 4 0 0 1-4-4V6a4 4 0 1 1 8 0v5a4 4 0 0 1-4 4Z" {...p} />,
  play: (p) => <path d="M5 5.98c0-1.03 0-1.55.22-1.83a1 1 0 0 1 .74-.39c.35-.02.78.26 1.63.83l9.03 6.02c.71.47 1.06.7 1.19.99a1 1 0 0 1 0 .8c-.13.29-.48.52-1.19.99l-9.03 6.02c-.85.57-1.28.85-1.63.83a1 1 0 0 1-.74-.39C5 19.57 5 19.05 5 18.02V5.98Z" {...p} />,
  pause: (p) => <path d="M8 5v14M16 5v14" {...p} />,
  lock: (p) => <path d="M17 10V8A5 5 0 0 0 7 8v2M8.8 21h6.4c1.68 0 2.52 0 3.16-.33a3 3 0 0 0 1.31-1.31c.33-.64.33-1.48.33-3.16v-.4c0-1.68 0-2.52-.33-3.16a3 3 0 0 0-1.31-1.31C17.72 11 16.88 11 15.2 11H8.8c-1.68 0-2.52 0-3.16.33a3 3 0 0 0-1.31 1.31C4 13.28 4 14.12 4 15.8v.4c0 1.68 0 2.52.33 3.16a3 3 0 0 0 1.31 1.31c.64.33 1.48.33 3.16.33Z" {...p} />,
  check: (p) => <path d="M20 6 9 17l-5-5" {...p} />,
  faceid: (p) => <><path d="M3 8V6.5C3 4.6 4.6 3 6.5 3H8M16 3h1.5C19.4 3 21 4.6 21 6.5V8M21 16v1.5c0 1.9-1.6 3.5-3.5 3.5H16M8 21H6.5C4.6 21 3 19.4 3 17.5V16" {...p} /><path d="M8.6 14.5a4.5 4.5 0 0 0 6.8 0" {...p} /><path d="M8.75 9.2v1M15.25 9.2v1" {...p} /></>,
  music: (p) => <path d="M9 18V6.35c0-.74 0-1.11.14-1.4a1.4 1.4 0 0 1 .59-.61c.28-.15.65-.19 1.38-.28l6.78-.85c.4-.05.6-.07.76-.01.14.05.26.15.34.28.09.14.09.35.09.75V16M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" {...p} />,
  camera: (p) => <path d="M2 8.94c0-.68 0-1.02.06-1.3a3 3 0 0 1 2.38-2.38c.28-.06.62-.06 1.3-.06.26 0 .4 0 .52-.02a2 2 0 0 0 1.46-1.02c.06-.1.12-.23.24-.47.11-.24.17-.35.24-.46a2 2 0 0 1 1.46-1.02C9.77 2.2 9.9 2.2 10.16 2.2h3.68c.26 0 .4 0 .52.02a2 2 0 0 1 1.46 1.02c.06.1.12.22.24.46.11.24.17.36.24.47a2 2 0 0 0 1.46 1.02c.12.02.26.02.52.02.68 0 1.02 0 1.3.06a3 3 0 0 1 2.38 2.38c.06.28.06.62.06 1.3v7.66c0 1.68 0 2.52-.33 3.16a3 3 0 0 1-1.31 1.31c-.64.33-1.48.33-3.16.33H6.8c-1.68 0-2.52 0-3.16-.33a3 3 0 0 1-1.31-1.31C2 19.13 2 18.29 2 16.61V8.94ZM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" {...p} />,
  cal: (p) => <path d="M21 10H3M16 2v4M8 2v4M7.8 22h8.4c1.68 0 2.52 0 3.16-.33a3 3 0 0 0 1.31-1.31c.33-.64.33-1.48.33-3.16V8.8c0-1.68 0-2.52-.33-3.16a3 3 0 0 0-1.31-1.31C18.72 4 17.88 4 16.2 4H7.8c-1.68 0-2.52 0-3.16.33a3 3 0 0 0-1.31 1.31C3 6.28 3 7.12 3 8.8v8.4c0 1.68 0 2.52.33 3.16a3 3 0 0 0 1.31 1.31c.64.33 1.48.33 3.16.33Z" {...p} />
};
function Ic({ name, size = 24, stroke = 'currentColor', sw = 2, style = {} }) {
  const draw = Icon[name] || (() => null);
  const filled = name === 'play';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0, ...style }}>
      {draw({ stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: filled ? stroke : 'none' })}
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
      lineHeight: 1, whiteSpace: 'nowrap'
    }}>
      <span style={{ width: dot, height: dot, borderRadius: '50%', background: `var(--intensity-${level}-ink)`, opacity: 0.55 }} />
      {C.label} {C.emoji}
    </span>);

}

/* ---------- MiniIntensityCurve (SVG) ---------- */
function MiniIntensityCurve({ data = [2, 3, 4, 4, 5, 4, 3], here = 4, w = 80, h = 24, showHere = true }) {
  const max = 5,min = 1;
  const pts = data.map((v, i) => {
    const x = i / (data.length - 1) * (w - 6) + 3;
    const y = h - 3 - (v - min) / (max - min) * (h - 6);
    return [x, y];
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const hp = pts[here];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--accent-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {showHere && hp && <circle cx={hp[0]} cy={hp[1]} r="3.6" fill="var(--accent-primary)" stroke="var(--bg-elevated)" strokeWidth="2" />}
    </svg>);

}

/* ---------- Buttons ---------- */
function ButtonPrimary({ children, onClick, disabled, full = true, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? '100%' : 'auto', minHeight: 56, padding: '0 24px',
      borderRadius: 'var(--r-full)', background: disabled ? 'var(--border-default)' : 'var(--accent-primary)',
      color: disabled ? 'var(--text-muted)' : 'var(--text-on-accent)', fontSize: 16.5, fontWeight: 700,
      transition: 'transform .12s, background .2s', boxShadow: disabled ? 'none' : '0 8px 22px rgba(249,107,38,0.32)',
      ...style
    }}
    onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
    onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      {children}
    </button>);

}
function ButtonSecondary({ children, onClick, full = true, style = {} }) {
  return (
    <button onClick={onClick} style={{
      width: full ? '100%' : 'auto', minHeight: 56, padding: '0 24px',
      borderRadius: 'var(--r-full)', background: 'transparent', border: '1.5px solid var(--border-default)',
      color: 'var(--text-primary)', fontSize: 16.5, fontWeight: 600, ...style
    }}>{children}</button>);

}
function ButtonText({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      color: 'var(--accent-primary)', fontSize: 15, fontWeight: 600, padding: 8, ...style
    }}>{children}</button>);

}

/* ---------- Card / HeroCard ---------- */
function Card({ children, style = {}, onClick, pad = 18 }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--bg-elevated)', borderRadius: 'var(--r-lg)', padding: pad,
      boxShadow: 'var(--shadow-2)', ...style
    }}>{children}</div>);

}

/* Muby Card/Hero — gradient background, white text, intensity band top */
function HeroCard({ children, intensity, style = {}, pad = 20 }) {
  return (
    <div style={{
      background: 'var(--gradient-hero)', borderRadius: 'var(--r-xl)', overflow: 'hidden',
      boxShadow: 'var(--shadow-3)', color: 'var(--text-on-hero)', position: 'relative', ...style
    }}>
      {/* pattern: soft concentric arcs + scattered dots, tone-on-tone */}
      <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} preserveAspectRatio="xMaxYMin slice" viewBox="0 0 353 200">
        <g fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1.5">
          <circle cx="335" cy="-10" r="52"></circle>
          <circle cx="335" cy="-10" r="86"></circle>
          <circle cx="335" cy="-10" r="122"></circle>
          <circle cx="-14" cy="205" r="46"></circle>
          <circle cx="-14" cy="205" r="78"></circle>
        </g>
        <g fill="rgba(255,255,255,0.14)">
          <circle cx="52" cy="34" r="2.4"></circle>
          <circle cx="120" cy="16" r="1.7"></circle>
          <circle cx="205" cy="42" r="2"></circle>
          <circle cx="86" cy="88" r="1.6"></circle>
          <circle cx="290" cy="132" r="2.2"></circle>
          <circle cx="180" cy="150" r="1.6"></circle>
        </g>
      </svg>
      <div style={{ padding: pad, position: 'relative' }}>{children}</div>
    </div>);

}

/* ---------- Chip ---------- */
function Chip({ children, active, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 18px', minHeight: 44, borderRadius: 'var(--r-full)', fontSize: 14, fontWeight: 600,
      whiteSpace: 'nowrap', transition: 'all .15s',
      background: active ? 'var(--accent-primary)' : 'var(--bg-elevated)',
      color: active ? '#fff' : 'var(--text-secondary)',
      border: active ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-subtle)',
      boxShadow: active ? '0 4px 12px rgba(249,107,38,0.30)' : 'none', ...style
    }}>{children}</button>);

}

/* ---------- Input ---------- */
function Input({ label, value, onChange, type = 'text', placeholder, prefix, error, hint, rightSlot, ...rest }) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  const t = isPw ? show ? 'text' : 'password' : type;
  return (
    <div style={{ width: '100%' }}>
      {label && <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, minHeight: 56, padding: '0 16px',
        background: 'var(--bg-sunken)', borderRadius: 'var(--r-md)',
        border: `1.5px solid ${error ? 'var(--danger)' : 'var(--border-subtle)'}`
      }}>
        {prefix && <span style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: 16 }}>{prefix}</span>}
        <input type={t} value={value} onChange={(e) => onChange && onChange(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 16.5, color: 'var(--text-primary)', minWidth: 0 }} {...rest} />
        {isPw &&
        <button onClick={() => setShow((s) => !s)} style={{ color: 'var(--text-muted)', display: 'flex' }} aria-label="hiện mật khẩu">
            <Ic name={show ? 'eyeOff' : 'eye'} size={20} sw={1.7} />
          </button>
        }
        {rightSlot}
      </div>
      {error && <div style={{ fontSize: 12.5, color: 'var(--danger)', marginTop: 6 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 6 }}>{hint}</div>}
    </div>);

}

/* ---------- ListRow ---------- */
function ListRow({ icon, iconBg, title, sub, right, onClick, style = {} }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 13, padding: '12px 4px', cursor: onClick ? 'pointer' : 'default', ...style
    }}>
      {icon && <div style={{
        width: 44, height: 44, borderRadius: 'var(--r-md)', background: iconBg || 'var(--bg-sunken)',
        display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0
      }}>{icon}</div>}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>);

}

/* ---------- EmptyState ---------- */
function EmptyState({ emotion = 'snug', onesie = 'cream', heading, helper, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px', gap: 6 }}>
      <Bong emotion={emotion} onesie={onesie} size={160} float />
      <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginTop: 8 }}>{heading}</div>
      {helper && <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', maxWidth: 240, lineHeight: 1.5 }}>{helper}</div>}
      {action && <div style={{ marginTop: 14, width: '100%' }}>{action}</div>}
    </div>);

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
      animation: 'toastIn .3s cubic-bezier(.2,.9,.3,1.2)'
    }}>{toast.text}</div>);

}


/* ---------- Icon3D — semi-3D gradient badge thay emoji ---------- */
const EMOJI3D = {
  '🍼': ['baby', '#FFB877', '#E0692A'],
  '🤱': ['baby', '#F8A3B8', '#D95C7E'],
  '🌙': ['moon-stars', '#A9A3E8', '#6C63C8'],
  '😴': ['bed', '#A9A3E8', '#6C63C8'],
  '🛏️': ['bed', '#A9A3E8', '#6C63C8'],
  '💧': ['drop', '#8FCBEF', '#3E8FC9'],
  '💛': ['heart', '#FFD97A', '#E8A81E'],
  '🎵': ['music-notes', '#F8A3B8', '#D95C7E'],
  '🌼': ['flower', '#B5D99A', '#6E9A4E'],
  '✨': ['sparkle', '#FFD97A', '#E8A81E'],
  '☕': ['coffee', '#D9B48F', '#9C6B3F'],
  '👀': ['eyes', '#8FCBEF', '#3E8FC9'],
  '😢': ['smiley-sad', '#8FCBEF', '#3E8FC9'],
  '😰': ['smiley-sad', '#A9A3E8', '#6C63C8'],
  '😤': ['smiley-angry', '#FFA98F', '#D9603A'],
  '🤚': ['hand', '#FFB877', '#E0692A'],
  '🗣️': ['chat-circle-dots', '#B5D99A', '#6E9A4E'],
  '🚪': ['door-open', '#D9B48F', '#9C6B3F'],
  '🐕': ['dog', '#D9B48F', '#9C6B3F'],
  '🍽️': ['fork-knife', '#FFB877', '#E0692A'],
  '🧸': ['cube', '#F8A3B8', '#D95C7E'],
  '🌧️': ['cloud-rain', '#8FCBEF', '#3E8FC9'],
  '🌊': ['waves', '#8FCBEF', '#3E8FC9'],
  '🤫': ['wind', '#B5D99A', '#6E9A4E'],
  '📌': ['push-pin', '#FFA98F', '#D9603A'],
  '☁️': ['cloud', '#A9A3E8', '#6C63C8'],
};
function Icon3D({ emo, size = 40, radius, style = {} }) {
  const m = EMOJI3D[emo] || ['sparkle', '#FFD97A', '#E8A81E'];
  return (
    <span aria-hidden="true" style={{
      width: size, height: size, borderRadius: radius != null ? radius : Math.round(size * 0.32),
      background: `linear-gradient(145deg, ${m[1]} 0%, ${m[2]} 100%)`,
      boxShadow: `inset 0 1.5px 2px rgba(255,255,255,0.55), inset 0 -2.5px 5px rgba(0,0,0,0.18), 0 3px 8px ${m[2]}55`,
      display: 'inline-grid', placeItems: 'center', flexShrink: 0, ...style
    }}>
      <i className={'ph-fill ph-' + m[0]} style={{ fontSize: Math.round(size * 0.52), lineHeight: 1, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.22)' }} />
    </span>
  );
}

/* ---------- Banner (inline, dismissable) ---------- */
function Banner({ icon, children, tone = 'soft', onClose, style = {} }) {
  if (typeof icon === 'string' && EMOJI3D[icon]) icon = <Icon3D emo={icon} size={30} />;
  const bg = tone === 'soft' ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px',
      background: bg, borderRadius: 'var(--r-md)', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.45, ...style
    }}>
      {icon && <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>}
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && <button onClick={onClose} style={{ color: 'var(--text-muted)', flexShrink: 0 }}><Ic name="close" size={16} sw={2} /></button>}
    </div>);

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
      fontWeight: 700, fontSize: 13
    }}>
      <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 600 }}>T</span>
      {w}
    </button>);

}

/* ---------- EasyBlock (single block) ---------- */
function EasyBlock({ block, current }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '12px 6px', borderRadius: 'var(--r-md)',
      background: current ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)',
      border: current ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
      opacity: block.done ? 0.55 : 1
    }}>
      <div style={{ fontSize: 20 }}>{block.icon}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{block.label}</div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600 }}>{block.time}</div>
    </div>);

}

/* ---------- Bottom Sheet ---------- */
function Sheet({ open, onClose, height = '65%', children, title, sub }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50, pointerEvents: open ? 'auto' : 'none',
      overflow: 'hidden', visibility: open ? 'visible' : 'hidden',
      transition: open ? 'visibility 0s' : 'visibility 0s .36s'
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(20,12,8,0.42)',
        opacity: open ? 1 : 0, transition: 'opacity .3s'
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 'auto', maxHeight: '92%',
        background: 'var(--bg-elevated)', borderRadius: 'var(--r-xl) var(--r-xl) 0 0',
        boxShadow: 'var(--shadow-4)', transform: open ? 'translateY(0)' : 'translateY(101%)',
        transition: 'transform .34s cubic-bezier(.2,.8,.2,1)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '12px 0 4px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'var(--border-default)' }} />
        </div>
        {title &&
        <div style={{ padding: '6px 22px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="serif" style={{ fontSize: 21, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
              {sub && <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 3 }}>{sub}</div>}
            </div>
            <button onClick={onClose} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}>
              <Ic name="close" size={18} sw={2} />
            </button>
          </div>
        }
        <div className="no-sb" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 22px 36px' }}>{children}</div>
      </div>
    </div>);

}

/* ---------- iOS Status Bar ---------- */
function StatusBar({ dark }) {
  const col = 'var(--text-primary)';
  return (
    <div style={{
      height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 30px 0 34px', flexShrink: 0, position: 'relative', zIndex: 5
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: col, letterSpacing: 0.3 }}>9:41</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: col }}>
        <svg width="18" height="12" viewBox="0 0 18 12" fill={col}><rect x="0" y="7" width="3" height="5" rx="1" /><rect x="5" y="4.5" width="3" height="7.5" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" opacity="0.35" /></svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill={col}><path d="M8.5 2.5c2 0 3.8.8 5.2 2l1.3-1.4C13.3 1.4 11 .5 8.5.5S3.7 1.4 1.9 3.1L3.3 4.5c1.4-1.2 3.2-2 5.2-2Z" /><path d="M8.5 6c1 0 2 .4 2.7 1.1l1.4-1.4C11.5 4.6 10 4 8.5 4S5.5 4.6 4.4 5.7l1.4 1.4C6.5 6.4 7.5 6 8.5 6Z" /><circle cx="8.5" cy="9.5" r="1.7" /></svg>
        <svg width="26" height="13" viewBox="0 0 26 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="3.2" stroke={col} opacity="0.4" /><rect x="2" y="2" width="17" height="9" rx="1.8" fill={col} /><rect x="23.5" y="4" width="1.6" height="5" rx="0.8" fill={col} opacity="0.4" /></svg>
      </div>
    </div>);

}

/* ---------- Bottom Nav — floating pill, 4 tabs + FAB giữa ---------- */
function BottomNav({ active, onNav, onFab }) {
  const left = [
  { id: 'today', icon: 'home', label: 'Hôm nay' },
  { id: 'leap', icon: 'leap', label: 'Leap' }];
  const right = [
  { id: 'growth', icon: 'growth', label: 'Lớn khôn' },
  { id: 'me', icon: 'me', label: 'Mama' }];

  const Item = ({ it }) => {
    const on = active === it.id;
    return (
      <button onClick={() => onNav(it.id)} aria-label={it.label} style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
        minHeight: 52, borderRadius: 'var(--r-full)',
        color: on ? 'var(--accent-primary)' : 'var(--text-muted)',
        transition: 'color .2s', whiteSpace: 'nowrap'
      }}>
        <Ic name={it.icon} size={23} sw={on ? 2.4 : 1.8} />
        <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500 }}>{it.label}</span>
      </button>);
  };

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      padding: '28px 16px 24px',
      background: 'linear-gradient(to top, color-mix(in srgb, var(--bg-canvas) 88%, transparent) 30%, transparent)',
      pointerEvents: 'none'
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 2,
        background: 'color-mix(in srgb, var(--bg-elevated) 90%, transparent)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--r-full)',
        padding: '6px 8px', boxShadow: 'var(--shadow-3)', pointerEvents: 'auto', position: 'relative'
      }}>
        {left.map((it) => <Item key={it.id} it={it} />)}
        {/* FAB — Ghi nhanh */}
        <button onClick={onFab} aria-label="Ghi nhanh" style={{
          width: 58, height: 58, borderRadius: '50%', flexShrink: 0, margin: '-14px 6px 0',
          background: 'var(--accent-primary)', color: '#fff', display: 'grid', placeItems: 'center',
          boxShadow: '0 8px 20px rgba(216,114,66,0.4), 0 0 0 5px color-mix(in srgb, var(--bg-canvas) 80%, transparent)'
        }}>
          <Ic name="plus" size={26} sw={2.6} />
        </button>
        {right.map((it) => <Item key={it.id} it={it} />)}
      </div>
    </div>);

}

/* ---------- App bar (stack screens) ---------- */
function AppBar({ title, onBack, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px 12px', flexShrink: 0
    }}>
      {onBack && <button onClick={onBack} style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'var(--text-primary)', background: 'var(--bg-sunken)' }}><Ic name="back" size={22} /></button>}
      <div className="serif" style={{ flex: 1, fontSize: 20, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
      {right}
    </div>);

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
      transition: 'all .2s'
    }}>
      <Ic name="mic" size={20} sw={1.9} />
      {recording ? 'Đang nghe…' : 'Giữ để nói'}
      {recording && <span className="rec-wave" style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 3, height: 14, borderRadius: 2, background: 'currentColor', animation: `wave 0.7s ${i * 0.12}s ease-in-out infinite` }} />)}
      </span>}
    </button>);

}

Object.assign(window, {
  Flower, FlowerField, Ic, Icon, Icon3D, IntensityBadge, MiniIntensityCurve,
  ButtonPrimary, ButtonSecondary, ButtonText, Card, HeroCard, Chip, Input, ListRow,
  EmptyState, Toast, Banner, SkeletonCard, WeekCell, EasyBlock, Sheet,
  StatusBar, BottomNav, AppBar, VoiceRecorder
});