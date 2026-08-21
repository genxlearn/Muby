/* ============================================================
   LEAP ENGINE — derives everything age-dependent from the baby's
   real date of birth (and optional due date), so the app is correct
   for every baby. Leap timing counts from the DUE date when given —
   brain development starts in the womb. Pure functions.
   ============================================================ */
import { BloomSkill, ForecastDay, Leap, LEAPS } from './sampleData';

export interface BabyProfile {
  name: string;      // '' allowed (optional in onboarding)
  dob: string;       // ISO 'YYYY-MM-DD'
  dueDate?: string;  // ISO — optional; leap weeks count from this when set
  gender: string;    // 'Bé gái' | 'Bé trai' | 'Chưa rõ' | ''
}

export type LeapStatus = 'in-leap' | 'between' | 'before-first' | 'after-all';

export interface DailyStat {
  id: 'feed' | 'sleep' | 'diaper';
  icon: string; label: string; value: string;
  num: number; lo: number; hi: number; unit: string; range: string; note: string;
}

export interface DailyCard {
  kind: 'fact' | 'game' | 'photo';
  label: string;
  text: string;
  action: string | null;
}

/** Sunny-state engine output (next leap, blossoming skills, daily rotation). */
export interface SunnyState {
  daysToNext: number | null;
  nextLeap: Leap | null;
  nextDate: string | null;   // 'dd/mm'
  refLeap: Leap;             // leap the sunny content refers to (current or last finished)
  daily: DailyCard;
  bloom: BloomSkill[];
  prep: { signs: string[]; tips: string[] } | null;
}

export interface BabyState {
  ageDays: number;
  ageWeeks: number;          // whole weeks (from DOB — for age display/calendar)
  ageWeeksFrac: number;
  leapWeeksFrac: number;     // fractional weeks from due date (or DOB) — drives leap math
  ageLabel: string;
  ageMonths: number;

  status: LeapStatus;
  leap: Leap;
  leapDay: number;
  leapTotal: number;
  daysUntilLeap: number;
  todayIntensity: number;    // 1..5
  forecast: ForecastDay[];

  easyVariant: string;
  easyDetail: string;
  statRanges: StatRanges;
  dailyStats: DailyStat[];
  ageBracketLabel: string;
  sunny: SunnyState;
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

/** Due dates may sit slightly in the future (overdue estimates) or past. ±1 year window. */
export function parseDueDateInput(input: string): string | null {
  const m = input.trim().match(/^(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{4})$/);
  if (!m) return null;
  const d = parseInt(m[1], 10), mo = parseInt(m[2], 10), y = parseInt(m[3], 10);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  if (Math.abs(Date.now() - date.getTime()) > 5 * 365 * DAY_MS) return null;
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

function daysSince(iso: string, now: Date): number {
  const [y, m, d] = iso.split('-').map((s) => parseInt(s, 10));
  return Math.round((startOfDay(now).getTime() - new Date(y, m - 1, d).getTime()) / DAY_MS);
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

/** Intensity for a fractional leap-week — the Muby v3 curve (min 1 inside a leap). */
export function intensityAtWeek(weekFrac: number): number {
  for (const lp of LEAPS) {
    if (weekFrac >= lp.range[0] && weekFrac <= lp.range[1]) {
      return Math.max(1, Math.min(5, 5 - Math.round(Math.abs(weekFrac - lp.wk) * 1.3)));
    }
  }
  return 1;
}

/* ---------- age-dependent reference content ---------- */

function easyFor(ageWeeks: number): { variant: string; detail: string } {
  if (ageWeeks < 26) {
    return { variant: 'EASY 3', detail: 'Giai đoạn này hầu hết bé theo nhịp EASY 3–4 giờ (ăn-chơi-ngủ rồi lặp lại). Nhưng mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
  }
  if (ageWeeks < 39) {
    return { variant: 'EASY 4', detail: 'Ở 6–9 tháng, nhiều bé theo nhịp EASY 4 (chu kỳ ~4 giờ, 2–3 giấc ngày). Mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
  }
  return { variant: 'EASY 2 giấc', detail: 'Sau 9 tháng, phần lớn bé chuyển dần về 2 giấc ngày với chu kỳ thức dài hơn. Mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.' };
}

function bracketFor(ageMonths: number): { label: string; b: { feed: [number, number]; sleep: [number, number]; diaper: [number, number] } } {
  if (ageMonths < 3) return { label: 'Bé 0–3 tháng', b: { feed: [7, 12], sleep: [14, 17], diaper: [6, 10] } };
  if (ageMonths < 6) return { label: 'Bé 3–6 tháng', b: { feed: [5, 8], sleep: [12, 16], diaper: [5, 8] } };
  if (ageMonths < 9) return { label: 'Bé 6–9 tháng', b: { feed: [4, 6], sleep: [12, 15], diaper: [4, 7] } };
  return { label: 'Bé trên 9 tháng', b: { feed: [3, 5], sleep: [11, 14], diaper: [4, 6] } };
}

/* magic weekly facts for the sunny daily card */
const MAGIC: Record<number, string> = {
  15: 'Tuần này mắt bé bắt đầu nhìn rõ ở khoảng 40cm — đúng khoảng cách từ mặt mẹ khi cho bú. Không phải ngẫu nhiên đâu 💛',
  16: 'Não bé tuần này tạo hàng triệu kết nối mới mỗi ngày — mỗi lần mama nói chuyện với con là một lần "xây đường" cho não bé.',
  17: 'Bé giờ nghe được sự khác nhau giữa giọng vui và giọng mệt của mẹ — con đang học cảm xúc qua tai đấy.',
  18: 'Tay bé tuần này bắt đầu "biết nghe lời" hơn — con nhìn vật, rồi nhìn tay mình, rồi với. Cả một dây chuyền điều khiển!',
};

/* ---------- main ---------- */

export function computeBabyState(dobIso: string, dueDateIso?: string | null, now: Date = new Date()): BabyState {
  const ageDays = Math.max(0, daysSince(dobIso, now));
  const ageWeeksFrac = ageDays / 7;
  const ageWeeks = Math.floor(ageWeeksFrac);
  const { label: ageLabel, months: ageMonths } = ageLabelFor(dobIso, now);

  // Leap timing counts from the due date when provided (can be negative for
  // babies born early who haven't reached their due date yet — clamp to 0).
  const leapDays = dueDateIso ? Math.max(0, daysSince(dueDateIso, now)) : ageDays;
  const leapWeeksFrac = leapDays / 7;

  const inLeap = LEAPS.find((lp) => leapWeeksFrac >= lp.range[0] && leapWeeksFrac <= lp.range[1]) ?? null;
  const next = LEAPS.find((lp) => lp.range[0] > leapWeeksFrac) ?? null;
  const last = [...LEAPS].reverse().find((lp) => lp.range[1] < leapWeeksFrac) ?? null;

  let status: LeapStatus;
  let leap: Leap;
  let daysUntilLeap = 0;
  if (inLeap) {
    status = 'in-leap';
    leap = inLeap;
  } else if (next) {
    status = leapWeeksFrac < LEAPS[0].range[0] ? 'before-first' : 'between';
    leap = next;
    daysUntilLeap = Math.max(1, Math.ceil(next.range[0] * 7 - leapDays));
  } else {
    status = 'after-all';
    leap = LEAPS[LEAPS.length - 1];
  }

  const leapTotal = Math.max(1, Math.round((leap.range[1] - leap.range[0]) * 7));
  const leapDay = status === 'in-leap'
    ? Math.min(leapTotal, Math.max(1, Math.floor(leapDays - leap.range[0] * 7) + 1))
    : 0;

  const todayIntensity = intensityAtWeek(leapWeeksFrac);

  const forecast: ForecastDay[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfDay(now).getTime() + i * DAY_MS);
    forecast.push({
      day: VN_DAYS[d.getDay()],
      n: intensityAtWeek((leapDays + i) / 7),
      today: i === 0,
    });
  }

  const easy = easyFor(ageWeeks);
  const { label: ageBracketLabel, b } = bracketFor(ageMonths);
  const statRanges: StatRanges = {
    feed: { lo: b.feed[0], hi: b.feed[1], range: `${ageBracketLabel} thường bú ${b.feed[0]}–${b.feed[1]} cữ mỗi ngày` },
    sleep: { lo: b.sleep[0], hi: b.sleep[1], range: `${ageBracketLabel} thường ngủ ${b.sleep[0]}–${b.sleep[1]} giờ mỗi ngày` },
    diaper: { lo: b.diaper[0], hi: b.diaper[1], range: `Bé bú đủ thường có ${b.diaper[0]}–${b.diaper[1]} tã ướt mỗi ngày` },
  };
  // sample "today" logs synthesized in-range for the baby's age (logging is still mock)
  const dailyStats: DailyStat[] = [
    { id: 'feed', icon: '🍼', label: 'Cữ ăn hôm nay', value: `${b.feed[0]} cữ · ${b.feed[0] * 92}ml`, num: b.feed[0], lo: b.feed[0], hi: b.feed[1], unit: 'cữ', range: statRanges.feed.range, note: 'Trong leap, bé có thể bú ít mỗi cữ nhưng đòi ăn nhiều lần — bình thường nhé mama.' },
    { id: 'sleep', icon: '🌙', label: 'Giấc ngủ hôm nay', value: `3 giấc ngày · ${b.sleep[0] + 2}g tổng`, num: b.sleep[0] + 2, lo: b.sleep[0], hi: b.sleep[1], unit: 'giờ', range: statRanges.sleep.range, note: 'Ngủ ngắn hơn trong leap là chuyện rất thường gặp.' },
    { id: 'diaper', icon: '💧', label: 'Tã hôm nay', value: `${b.diaper[0] + 1} lần · ${b.diaper[0]} ướt, 1 bẩn`, num: b.diaper[0] + 1, lo: b.diaper[0], hi: b.diaper[1], unit: 'tã ướt', range: statRanges.diaper.range, note: 'Tã ướt đều đặn = bé đang bú đủ — dấu hiệu yên tâm nhất.' },
  ];

  /* ---- Sunny-state engine ---- */
  const refLeap = inLeap ?? last ?? leap;
  const daysToNext = next ? Math.max(0, Math.round(next.range[0] * 7 - leapDays)) : null;
  const nextStart = next && daysToNext != null ? new Date(startOfDay(now).getTime() + daysToNext * DAY_MS) : null;
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const wk = Math.floor(leapWeeksFrac);
  const magicText = MAGIC[wk] || `Mỗi ngày tuần này, não bé đang luyện lại kỹ năng ${refLeap.skill} — cả trong lúc ngủ. Giấc ngủ ngon cũng là học đấy mama.`;
  const bloom = refLeap.bloom ?? [];
  const game = bloom[2] ?? bloom[0];
  const dw = now.getDay(); // 0 = CN
  const daily: DailyCard =
    dw === 0
      ? { kind: 'photo', label: '📸 Khoảnh khắc tuần này', text: 'Tuần này nhiều bé bắt đầu cười thành tiếng. Nếu bé cười, quay lại 10 giây thôi — sau này xem lại sẽ tan chảy đó.', action: 'Lưu khoảnh khắc' }
      : dw % 2 === 1
        ? { kind: 'fact', label: '✨ Điều kỳ diệu hôm nay', text: magicText, action: null }
        : { kind: 'game', label: '🎲 Trò 5 phút', text: game ? `Bé vừa học ${game.skill}. Thử: ${game.game}` : `Chơi ú òa với khăn — con đang luyện kỹ năng ${refLeap.skill}.`, action: null };

  const sunny: SunnyState = {
    daysToNext,
    nextLeap: next,
    nextDate: nextStart ? `${pad2(nextStart.getDate())}/${pad2(nextStart.getMonth() + 1)}` : null,
    refLeap,
    daily,
    bloom,
    prep: next
      ? {
          signs: next.prepSigns ?? next.symptoms.slice(0, 2).map((s) => s.toLowerCase()),
          tips: [
            'Tuần tới hạn chế xáo trộn lịch — hoãn việc lớn nếu được.',
            'Sạc pin cho mama: tranh thủ ngủ bù tuần này, tuần sau con cần mẹ nhiều hơn ☕',
          ],
        }
      : null,
  };

  return {
    ageDays,
    ageWeeks,
    ageWeeksFrac,
    leapWeeksFrac,
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
    statRanges,
    dailyStats,
    ageBracketLabel,
    sunny,
  };
}
