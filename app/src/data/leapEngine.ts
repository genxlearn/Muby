/* ============================================================
   LEAP ENGINE — derives everything age-dependent from the baby's
   real date of birth, so the app is correct for every baby.
   Pure functions; no storage or React here.
   ============================================================ */
import { ForecastDay, Leap, LEAPS } from './sampleData';

export interface BabyProfile {
  name: string;      // '' allowed (optional in onboarding)
  dob: string;       // ISO 'YYYY-MM-DD'
  gender: string;    // 'Bé gái' | 'Bé trai' | 'Chưa rõ' | ''
}

export type LeapStatus = 'in-leap' | 'between' | 'before-first' | 'after-all';

export interface BabyState {
  ageDays: number;
  ageWeeks: number;          // whole weeks
  ageWeeksFrac: number;      // fractional weeks, used against leap ranges
  ageLabel: string;          // 'x tháng y ngày' (or 'x ngày' / 'x tuổi y tháng')
  ageMonths: number;

  status: LeapStatus;
  /** The leap the UI talks about: the one in progress, or the next upcoming
   *  (or the last one once all 10 are done). */
  leap: Leap;
  leapDay: number;           // 1-based day inside the leap window (0 if not in leap)
  leapTotal: number;         // length of the leap window in days
  daysUntilLeap: number;     // >0 when status is 'between'/'before-first'
  todayIntensity: number;    // 1..5
  forecast: ForecastDay[];   // next 7 days, real weekday names, [0] = today

  easyVariant: string;       // 'EASY 3' | 'EASY 3.5' | 'EASY 4' | 'EASY 2 giấc'
  easyDetail: string;
  statRanges: StatRanges;
  ageBracketLabel: string;   // 'Bé 3–4 tháng' …
}

export interface StatRanges {
  feed: { lo: number; hi: number; range: string };
  sleep: { lo: number; hi: number; range: string };
  diaper: { lo: number; hi: number; range: string };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/* ---------- date helpers ---------- */

/** Parse 'DD/MM/YYYY' (accepts '-' or '.' separators, loose spacing) → ISO date or null. */
export function parseDobInput(input: string): string | null {
  const m = input.trim().match(/^(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{4})$/);
  if (!m) return null;
  const d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  if (date.getTime() > Date.now()) return null;                       // not in the future
  if (Date.now() - date.getTime() > 5 * 365 * DAY_MS) return null;    // sanity: < 5 years old
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(mo)}-${pad(d)}`;
}

export function formatDobDisplay(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function startOfDay(t: Date): Date {
  return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}

function ageDaysAt(dobIso: string, now: Date): number {
  const [y, m, d] = dobIso.split('-').map((s) => parseInt(s, 10));
  const dob = new Date(y, m - 1, d);
  return Math.max(0, Math.round((startOfDay(now).getTime() - dob.getTime()) / DAY_MS));
}

/** Calendar-accurate 'x tháng y ngày'. */
function ageLabelFor(dobIso: string, now: Date): { label: string; months: number } {
  const [y, m, d] = dobIso.split('-').map((s) => parseInt(s, 10));
  const dob = new Date(y, m - 1, d);
  const today = startOfDay(now);
  let months = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
  let anchor = new Date(dob.getFullYear(), dob.getMonth() + months, dob.getDate());
  if (anchor.getTime() > today.getTime()) {
    months -= 1;
    anchor = new Date(dob.getFullYear(), dob.getMonth() + months, dob.getDate());
  }
  const days = Math.round((today.getTime() - anchor.getTime()) / DAY_MS);
  if (months <= 0) return { label: `${Math.max(0, days)} ngày tuổi`, months: 0 };
  if (months >= 24) {
    const years = Math.floor(months / 12);
    const remM = months % 12;
    return { label: remM ? `${years} tuổi ${remM} tháng` : `${years} tuổi`, months };
  }
  return { label: days ? `${months} tháng ${days} ngày` : `${months} tháng`, months };
}

/* ---------- leap math ---------- */

/** Intensity for a fractional age-in-weeks — same curve as the 77-week calendar. */
export function intensityAtWeek(weekFrac: number): number {
  for (const lp of LEAPS) {
    if (weekFrac >= lp.range[0] && weekFrac <= lp.range[1]) {
      return Math.max(2, Math.min(5, 5 - Math.round(Math.abs(weekFrac - lp.wk) * 1.3)));
    }
  }
  return 1;
}

function leapAtWeek(weekFrac: number): Leap | null {
  return LEAPS.find((lp) => weekFrac >= lp.range[0] && weekFrac <= lp.range[1]) ?? null;
}

function nextLeapAfter(weekFrac: number): Leap | null {
  return LEAPS.find((lp) => lp.range[0] > weekFrac) ?? null;
}

/* ---------- age-dependent reference content ---------- */

function easyFor(ageWeeks: number): { variant: string; detail: string } {
  if (ageWeeks < 13) {
    return { variant: 'EASY 3', detail: 'Dưới 3 tháng, hầu hết bé theo nhịp EASY 3 (ăn-chơi-ngủ mỗi 3 giờ). Nhưng mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
  }
  if (ageWeeks < 26) {
    return { variant: 'EASY 3', detail: 'Ở 3–6 tháng, hầu hết bé theo nhịp EASY 3 → 4 (ăn-chơi-ngủ mỗi 3–4 giờ). Nhưng mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
  }
  if (ageWeeks < 39) {
    return { variant: 'EASY 4', detail: 'Ở 6–9 tháng, nhiều bé theo nhịp EASY 4 (chu kỳ ~4 giờ, 2–3 giấc ngày). Mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
  }
  return { variant: 'EASY 2 giấc', detail: 'Sau 9 tháng, phần lớn bé chuyển dần về 2 giấc ngày với chu kỳ thức dài hơn. Mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
}

function bracketFor(ageWeeks: number): { label: string; ranges: StatRanges } {
  if (ageWeeks < 13) {
    return {
      label: 'Bé 0–3 tháng',
      ranges: {
        feed: { lo: 7, hi: 10, range: 'Bé 0–3 tháng thường bú 7–10 cữ mỗi ngày' },
        sleep: { lo: 14, hi: 17, range: 'Bé 0–3 tháng thường ngủ 14–17 giờ mỗi ngày' },
        diaper: { lo: 6, hi: 10, range: 'Bé bú đủ thường có 6–10 tã ướt mỗi ngày' },
      },
    };
  }
  if (ageWeeks < 26) {
    return {
      label: 'Bé 3–6 tháng',
      ranges: {
        feed: { lo: 5, hi: 8, range: 'Bé 3–6 tháng thường bú 5–8 cữ mỗi ngày' },
        sleep: { lo: 12, hi: 17, range: 'Bé 3–6 tháng thường ngủ 12–17 giờ mỗi ngày' },
        diaper: { lo: 5, hi: 8, range: 'Bé bú đủ thường có 5–8 tã ướt mỗi ngày' },
      },
    };
  }
  if (ageWeeks < 52) {
    return {
      label: 'Bé 6–12 tháng',
      ranges: {
        feed: { lo: 4, hi: 6, range: 'Bé 6–12 tháng thường bú 4–6 cữ (kèm ăn dặm) mỗi ngày' },
        sleep: { lo: 12, hi: 15, range: 'Bé 6–12 tháng thường ngủ 12–15 giờ mỗi ngày' },
        diaper: { lo: 4, hi: 7, range: 'Bé bú đủ thường có 4–7 tã ướt mỗi ngày' },
      },
    };
  }
  return {
    label: 'Bé trên 1 tuổi',
    ranges: {
      feed: { lo: 3, hi: 5, range: 'Bé trên 1 tuổi thường có 3–5 bữa (sữa + ăn dặm) mỗi ngày' },
      sleep: { lo: 11, hi: 14, range: 'Bé trên 1 tuổi thường ngủ 11–14 giờ mỗi ngày' },
      diaper: { lo: 4, hi: 6, range: 'Bé thường có 4–6 tã ướt mỗi ngày' },
    },
  };
}

/* ---------- main ---------- */

export function computeBabyState(dobIso: string, now: Date = new Date()): BabyState {
  const ageDays = ageDaysAt(dobIso, now);
  const ageWeeksFrac = ageDays / 7;
  const ageWeeks = Math.floor(ageWeeksFrac);
  const { label: ageLabel, months: ageMonths } = ageLabelFor(dobIso, now);

  const inLeap = leapAtWeek(ageWeeksFrac);
  const next = nextLeapAfter(ageWeeksFrac);
  let status: LeapStatus;
  let leap: Leap;
  let daysUntilLeap = 0;
  if (inLeap) {
    status = 'in-leap';
    leap = inLeap;
  } else if (next) {
    status = ageWeeksFrac < LEAPS[0].range[0] ? 'before-first' : 'between';
    leap = next;
    daysUntilLeap = Math.max(1, Math.ceil(next.range[0] * 7 - ageDays));
  } else {
    status = 'after-all';
    leap = LEAPS[LEAPS.length - 1];
  }

  const leapTotal = Math.round((leap.range[1] - leap.range[0]) * 7);
  const leapDay = status === 'in-leap'
    ? Math.min(leapTotal, Math.max(1, Math.floor(ageDays - leap.range[0] * 7) + 1))
    : 0;

  const todayIntensity = intensityAtWeek(ageWeeksFrac);

  const forecast: ForecastDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfDay(now).getTime() + i * DAY_MS);
    forecast.push({
      day: VN_DAYS[d.getDay()],
      n: intensityAtWeek((ageDays + i) / 7),
      today: i === 0,
    });
  }

  const easy = easyFor(ageWeeks);
  const bracket = bracketFor(ageWeeks);

  return {
    ageDays,
    ageWeeks,
    ageWeeksFrac,
    ageLabel,
    ageMonths,
    status,
    leap,
    leapDay,
    leapTotal,
    daysUntilLeap,
    todayIntensity,
    forecast,
    easyVariant: easy.variant,
    easyDetail: easy.detail,
    statRanges: bracket.ranges,
    ageBracketLabel: bracket.label,
  };
}
