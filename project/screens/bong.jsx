/* ============================================================
   BỐNG — semi-3D baby mascot (Muby v1.0)
   <Bong emotion="happy" onesie="orange" size={130} />
   ViewBox 0 0 200 240.
   Semi-3D: radial-gradient skin, soft AO shadow, glossy highlights,
   dimensional onesie with fabric shading. Colors via CSS vars + gradients.
   ============================================================ */
(function () {
  // Onesie base colors with light/shade pairs for 3D shading
  const ONESIE = {
    orange:   { base: '#D87242', light: '#E89867', dark: '#B85A30' },
    sage:     { base: '#9CB888', light: '#B5CCA4', dark: '#7E9A6C' },
    cream:    { base: '#E8D4B5', light: '#F4E6CE', dark: '#CDB48E' },
    lavender: { base: '#B5A8C4', light: '#CBC0D8', dark: '#94859F' },
  };

  let UID = 0;

  /* ---------- gradient defs per instance ---------- */
  function Defs({ id, onesie }) {
    const o = ONESIE[onesie] || ONESIE.orange;
    return (
      <defs>
        {/* skin: radial with warm highlight top-left */}
        <radialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="var(--char-skin-hi, #FFF0E2)" />
          <stop offset="55%" stopColor="var(--char-skin, #FBE0CB)" />
          <stop offset="100%" stopColor="var(--char-skin-shade, #F2C9A7)" />
        </radialGradient>
        {/* onesie: vertical fabric gradient */}
        <linearGradient id={`${id}-onesie`} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor={o.light} />
          <stop offset="50%" stopColor={o.base} />
          <stop offset="100%" stopColor={o.dark} />
        </linearGradient>
        {/* limb gradient (slightly darker, cylindrical) */}
        <linearGradient id={`${id}-limb`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor={o.base} />
          <stop offset="100%" stopColor={o.dark} />
        </linearGradient>
        {/* cheek blush radial */}
        <radialGradient id={`${id}-blush`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="var(--char-blush, #F19F8B)" stopOpacity="0.75" />
          <stop offset="100%" stopColor="var(--char-blush, #F19F8B)" stopOpacity="0" />
        </radialGradient>
        {/* ground shadow */}
        <radialGradient id={`${id}-ground`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#2A1A14" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#2A1A14" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#2A1A14" stopOpacity="0" />
        </radialGradient>
      </defs>
    );
  }

  /* ---------- EYES (with 3D catchlights) ---------- */
  function RoundEye({ x, y, r = 6 }) {
    return (
      <g>
        <circle cx={x} cy={y + 0.8} r={r + 0.6} fill="rgba(42,26,20,0.10)" />
        <circle cx={x} cy={y} r={r} fill="var(--char-eyes)" />
        <circle cx={x + r * 0.32} cy={y - r * 0.38} r={r * 0.32} fill="#fff" opacity="0.95" />
        <circle cx={x - r * 0.3} cy={y + r * 0.32} r={r * 0.16} fill="#fff" opacity="0.5" />
      </g>
    );
  }
  function HappyEye({ x, y, w = 8 }) {
    return <path d={`M${x - w},${y + 2} Q${x},${y - 5} ${x + w},${y + 2}`} stroke="var(--char-eyes)" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }
  function SadEye({ x, y, w = 8 }) {
    return <path d={`M${x - w},${y - 2} Q${x},${y + 5} ${x + w},${y - 2}`} stroke="var(--char-eyes)" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }
  function SleepEye({ x, y, w = 8 }) {
    return <path d={`M${x - w},${y} Q${x},${y - 3} ${x + w},${y}`} stroke="var(--char-eyes)" strokeWidth="2.8" fill="none" strokeLinecap="round" />;
  }
  function SlitEye({ x, y, w = 7, tilt = 0 }) {
    return <path d={`M${x - w},${y + tilt} Q${x},${y + 1} ${x + w},${y - tilt}`} stroke="var(--char-eyes)" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }

  /* ---------- MOUTHS ---------- */
  function Smile({ y = 116, w = 13 }) {
    return <path d={`M${100 - w},${y} Q100,${y + 11} ${100 + w},${y}`} stroke="var(--char-mouth)" strokeWidth="3.6" fill="none" strokeLinecap="round" />;
  }
  function BigSmile({ y = 114 }) {
    return (
      <g>
        <path d={`M85,${y} Q100,${y + 18} 115,${y} Q100,${y + 6} 85,${y}Z`} fill="var(--char-mouth)" />
        <path d={`M92,${y + 7} Q100,${y + 11} 108,${y + 7}`} stroke="#fff" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      </g>
    );
  }
  function OpenMouth({ y = 116, rx = 7, ry = 8 }) {
    return (
      <g>
        <ellipse cx="100" cy={y} rx={rx} ry={ry} fill="var(--char-mouth)" />
        <ellipse cx="100" cy={y + ry * 0.4} rx={rx * 0.55} ry={ry * 0.35} fill="#fff" opacity="0.25" />
      </g>
    );
  }
  function TinyMouth({ y = 116 }) {
    return <path d={`M94,${y} Q100,${y + 5} 106,${y}`} stroke="var(--char-mouth)" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }
  function Wobble({ y = 117 }) {
    return <path d={`M88,${y} Q94,${y - 4} 100,${y} T112,${y}`} stroke="var(--char-mouth)" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  }
  function Frown({ y = 120, w = 11 }) {
    return <path d={`M${100 - w},${y} Q100,${y - 9} ${100 + w},${y}`} stroke="var(--char-mouth)" strokeWidth="3.4" fill="none" strokeLinecap="round" />;
  }
  function CryMouth({ y = 113 }) {
    return (
      <g>
        <path d="M89,118 Q100,107 111,118 Q100,132 89,118Z" fill="var(--char-mouth)" />
        <path d="M93,121 Q100,126 107,121" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
      </g>
    );
  }

  /* ---------- EXTRAS ---------- */
  function Tear({ x, y }) {
    return (
      <g>
        <path d={`M${x},${y} C${x - 4},${y + 6} ${x - 4},${y + 11} ${x},${y + 11} C${x + 4},${y + 11} ${x + 4},${y + 6} ${x},${y}Z`} fill="var(--tear)" />
        <circle cx={x - 1.2} cy={y + 7.5} r="1.3" fill="#fff" opacity="0.7" />
      </g>
    );
  }
  function Sparkle({ x, y, s = 5, o = 1 }) {
    return <path d={`M${x},${y - s} Q${x + 1},${y - 1} ${x + s},${y} Q${x + 1},${y + 1} ${x},${y + s} Q${x - 1},${y + 1} ${x - s},${y} Q${x - 1},${y - 1} ${x},${y - s}Z`} fill="var(--accent-primary)" opacity={o} />;
  }
  function Zzz() {
    return (
      <g fill="none" stroke="var(--text-muted)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M150,48 h9 l-9,10 h9" />
        <path d="M168,30 h6 l-6,7 h6" />
      </g>
    );
  }
  function BrowRaise({ side = 1 }) {
    const x = side > 0 ? 122 : 78;
    return <path d={`M${x - 8},${72} Q${x},${68} ${x + 8},${72}`} stroke="var(--char-eyes)" strokeWidth="2.6" fill="none" strokeLinecap="round" />;
  }
  function BrowWorried() {
    return (
      <g stroke="var(--char-eyes)" strokeWidth="2.6" fill="none" strokeLinecap="round">
        <path d="M70,74 Q78,70 86,75" />
        <path d="M114,75 Q122,70 130,74" />
      </g>
    );
  }
  function BrowAngry() {
    return (
      <g stroke="var(--char-eyes)" strokeWidth="2.8" fill="none" strokeLinecap="round">
        <path d="M70,73 L86,78" />
        <path d="M130,73 L114,78" />
      </g>
    );
  }

  /* ---------- FACE BY EMOTION ---------- */
  function Face({ emotion }) {
    const L = 78, R = 122, EY = 90;
    switch (emotion) {
      case 'happy':
        return <g><RoundEye x={L} y={EY} /><RoundEye x={R} y={EY} /><Smile /></g>;
      case 'blissful':
        return <g><HappyEye x={L} y={EY} /><HappyEye x={R} y={EY} /><BigSmile /><Sparkle x={150} y={70} s={6} o={0.8} /><Sparkle x={48} y={78} s={4} o={0.7} /></g>;
      case 'curious':
        return <g><BrowRaise side={1} /><RoundEye x={L} y={EY} r={5.5} /><RoundEye x={R} y={EY} r={6.5} /><OpenMouth y={117} rx={4.5} ry={5} /></g>;
      case 'excited':
        return <g><RoundEye x={L} y={EY} r={7} /><RoundEye x={R} y={EY} r={7} /><BigSmile /><Sparkle x={150} y={64} s={6} /><Sparkle x={46} y={70} s={5} /><Sparkle x={156} y={96} s={4} o={0.8} /></g>;
      case 'fussy':
        return <g><BrowAngry /><SlitEye x={L} y={EY} tilt={2} /><SlitEye x={R} y={EY} tilt={-2} /><Frown /></g>;
      case 'snug':
        return <g><SleepEye x={L} y={EY} /><SleepEye x={R} y={EY} /><TinyMouth /></g>;
      case 'eating':
        return <g><HappyEye x={L} y={EY} /><HappyEye x={R} y={EY} /><OpenMouth y={118} rx={6} ry={7} /></g>;
      case 'surprise':
        return <g><BrowWorried /><RoundEye x={L} y={EY} r={7.5} /><RoundEye x={R} y={EY} r={7.5} /><OpenMouth y={119} rx={6} ry={8} /></g>;
      case 'uncertain':
        return <g><BrowRaise side={1} /><RoundEye x={L} y={EY} r={4.6} /><RoundEye x={R} y={EY} r={6.4} /><Wobble /></g>;
      case 'crying':
        return <g><BrowWorried /><SadEye x={L} y={EY} /><SadEye x={R} y={EY} /><CryMouth /></g>;
      case 'sleeping':
        return <g><SleepEye x={L} y={EY} /><SleepEye x={R} y={EY} /><TinyMouth y={117} /><Zzz /></g>;
      default:
        return <g><RoundEye x={L} y={EY} /><RoundEye x={R} y={EY} /><Smile /></g>;
    }
  }

  /* ---------- BODY (semi-3D onesie) ---------- */
  function Body({ id }) {
    return (
      <g>
        {/* arms — cylindrical gradient */}
        <ellipse cx="50" cy="162" rx="13" ry="22" fill={`url(#${id}-limb)`} transform="rotate(14 50 162)" />
        <ellipse cx="150" cy="162" rx="13" ry="22" fill={`url(#${id}-limb)`} transform="rotate(-14 150 162)" />
        {/* hands — skin sphere */}
        <circle cx="44" cy="180" r="10" fill={`url(#${id}-skin)`} />
        <circle cx="156" cy="180" r="10" fill={`url(#${id}-skin)`} />
        <ellipse cx="41.5" cy="177" rx="3.5" ry="2.6" fill="#fff" opacity="0.4" transform="rotate(-25 41.5 177)" />
        <ellipse cx="153.5" cy="177" rx="3.5" ry="2.6" fill="#fff" opacity="0.4" transform="rotate(-25 153.5 177)" />
        {/* torso — gradient fabric */}
        <path d="M58,140 Q58,128 72,127 L128,127 Q142,128 142,140 L146,196 Q146,210 132,210 L68,210 Q54,210 54,196 Z" fill={`url(#${id}-onesie)`} />
        {/* torso volume highlight */}
        <ellipse cx="86" cy="152" rx="26" ry="18" fill="#fff" opacity="0.14" />
        {/* belly shading bottom */}
        <path d="M56,190 Q100,206 144,190 L146,196 Q146,210 132,210 L68,210 Q54,210 54,196 Z" fill="#2A1A14" opacity="0.08" />
        {/* legs + feet */}
        <path d="M70,200 Q70,224 84,224 Q96,224 96,206 L96,200 Z" fill={`url(#${id}-limb)`} />
        <path d="M130,200 Q130,224 116,224 Q104,224 104,206 L104,200 Z" fill={`url(#${id}-limb)`} />
        <ellipse cx="80" cy="224" rx="16" ry="9" fill={`url(#${id}-onesie)`} />
        <ellipse cx="120" cy="224" rx="16" ry="9" fill={`url(#${id}-onesie)`} />
        <ellipse cx="76" cy="221" rx="6" ry="3" fill="#fff" opacity="0.25" />
        <ellipse cx="116" cy="221" rx="6" ry="3" fill="#fff" opacity="0.25" />
        {/* placket + buttons */}
        <path d="M100,130 L100,196" stroke="rgba(0,0,0,0.10)" strokeWidth="2" />
        <circle cx="100" cy="150" r="2.6" fill="rgba(0,0,0,0.16)" />
        <circle cx="100" cy="149.3" r="2.6" fill="rgba(255,255,255,0.22)" opacity="0.6" />
        <circle cx="100" cy="168" r="2.6" fill="rgba(0,0,0,0.16)" />
        {/* collar rim light */}
        <path d="M78,130 Q100,142 122,130" stroke="rgba(255,255,255,0.30)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  function Bong({ emotion = 'happy', onesie = 'orange', size = 130, style = {}, className = '', float = false, shadow = true }) {
    const idRef = React.useRef(null);
    if (!idRef.current) idRef.current = 'bg' + (++UID);
    const id = idRef.current;
    const w = size, h = size * 1.2;
    return (
      <svg
        width={w} height={h} viewBox="0 0 200 240"
        className={(float ? 'bong-float ' : '') + className}
        style={{ display: 'block', overflow: 'visible', ...style }}
        role="img" aria-label={`Bống ${emotion}`}
      >
        <Defs id={id} onesie={onesie} />
        {/* ground shadow — anchors in 3D space */}
        {shadow && <ellipse cx="100" cy="233" rx="62" ry="10" fill={`url(#${id}-ground)`} />}
        <Body id={id} />
        {/* ears — skin gradient spheres */}
        <ellipse cx="42" cy="92" rx="10" ry="14" fill={`url(#${id}-skin)`} />
        <ellipse cx="158" cy="92" rx="10" ry="14" fill={`url(#${id}-skin)`} />
        <ellipse cx="44" cy="92" rx="5" ry="7" fill="var(--char-skin-shade)" opacity="0.7" />
        <ellipse cx="156" cy="92" rx="5" ry="7" fill="var(--char-skin-shade)" opacity="0.7" />
        {/* head — big radial gradient sphere */}
        <ellipse cx="100" cy="86" rx="58" ry="55" fill={`url(#${id}-skin)`} />
        {/* chin AO */}
        <path d="M52,100 Q100,134 148,100 Q140,128 100,130 Q60,128 52,100Z" fill="var(--char-skin-shade)" opacity="0.5" />
        {/* glossy highlight top-left of head */}
        <ellipse cx="76" cy="52" rx="24" ry="14" fill="#fff" opacity="0.35" transform="rotate(-18 76 52)" />
        {/* hair curl */}
        <path d="M100,33 C100,20 87,18 91,8 C93,3 102,4 101,12" stroke="var(--char-hair)" strokeWidth="6.5" fill="none" strokeLinecap="round" />
        {/* blush — soft radial */}
        <ellipse cx="66" cy="104" rx="11" ry="7.5" fill={`url(#${id}-blush)`} />
        <ellipse cx="134" cy="104" rx="11" ry="7.5" fill={`url(#${id}-blush)`} />
        {/* face */}
        <Face emotion={emotion} />
        {emotion === 'crying' && <Tear x={70} y={100} />}
      </svg>
    );
  }

  /* ---------- mini face (avatars, forecast) ---------- */
  function BongFace({ emotion = 'happy', size = 32, ring = false, style = {} }) {
    const idRef = React.useRef(null);
    if (!idRef.current) idRef.current = 'bf' + (++UID);
    const id = idRef.current;
    return (
      <svg width={size} height={size} viewBox="38 36 124 110" style={{ display: 'block', overflow: 'visible', ...style }} role="img" aria-label={`Bống ${emotion}`}>
        <defs>
          <radialGradient id={`${id}-skin`} cx="0.38" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="var(--char-skin-hi, #FFF0E2)" />
            <stop offset="55%" stopColor="var(--char-skin, #FBE0CB)" />
            <stop offset="100%" stopColor="var(--char-skin-shade, #F2C9A7)" />
          </radialGradient>
          <radialGradient id={`${id}-blush`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="var(--char-blush, #F19F8B)" stopOpacity="0.75" />
            <stop offset="100%" stopColor="var(--char-blush, #F19F8B)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {ring && <circle cx="100" cy="92" r="62" fill="var(--bg-sunken)" />}
        <ellipse cx="42" cy="92" rx="10" ry="14" fill={`url(#${id}-skin)`} />
        <ellipse cx="158" cy="92" rx="10" ry="14" fill={`url(#${id}-skin)`} />
        <ellipse cx="100" cy="90" rx="58" ry="55" fill={`url(#${id}-skin)`} />
        <ellipse cx="76" cy="56" rx="24" ry="14" fill="#fff" opacity="0.35" transform="rotate(-18 76 56)" />
        <path d="M100,37 C100,24 87,22 91,12 C93,7 102,8 101,16" stroke="var(--char-hair)" strokeWidth="6.5" fill="none" strokeLinecap="round" />
        <ellipse cx="66" cy="108" rx="11" ry="7.5" fill={`url(#${id}-blush)`} />
        <ellipse cx="134" cy="108" rx="11" ry="7.5" fill={`url(#${id}-blush)`} />
        <g transform="translate(0,4)"><Face emotion={emotion} /></g>
        {emotion === 'crying' && <Tear x={70} y={104} />}
      </svg>
    );
  }

  const INTENSITY_BONG = {
    1: { emotion: 'blissful', onesie: 'sage' },
    2: { emotion: 'happy', onesie: 'orange' },
    3: { emotion: 'uncertain', onesie: 'cream' },
    4: { emotion: 'crying', onesie: 'lavender', tears: 1 },
    5: { emotion: 'crying', onesie: 'lavender', tears: 2 },
  };

  function BongIntensity({ level = 2, size = 130, ...rest }) {
    const m = INTENSITY_BONG[level] || INTENSITY_BONG[2];
    return (
      <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0 }}>
        <Bong emotion={m.emotion} onesie={m.onesie} size={size} {...rest} />
        {level === 5 && (
          <svg width={size} height={size * 1.2} viewBox="0 0 200 240" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
            <path d="M130,100 C126,106 126,111 130,111 C134,111 134,106 130,100Z" fill="var(--tear)" />
            <circle cx="128.8" cy="107.5" r="1.3" fill="#fff" opacity="0.7" />
          </svg>
        )}
      </div>
    );
  }

  window.Bong = Bong;
  window.BongFace = BongFace;
  window.BongIntensity = BongIntensity;
  window.INTENSITY_BONG = INTENSITY_BONG;
})();
