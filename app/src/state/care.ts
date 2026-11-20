/* ============================================================
   CARE HELPERS - time formatting, live clock and the "trạng thái
   sống" summary shown at the top of Hôm nay (MVP v2.1).
   ============================================================ */
import { useEffect, useState } from 'react';
import type { LogEntry, Side, Timer } from '../navigation/AppContext';

const pad = (n: number) => String(n).padStart(2, '0');

export const clock = (ms: number) => {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** "1 giờ 20 phút" · "45 phút" · "vừa xong" */
export function duration(ms: number): string {
  const m = Math.max(0, Math.round(ms / 60000));
  if (m < 1) return 'vừa xong';
  if (m < 60) return `${m} phút`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} giờ ${r} phút` : `${h} giờ`;
}

/** "2 giờ trước" · "15 phút trước" · "vừa xong" */
export function ago(ms: number, now = Date.now()): string {
  const d = duration(now - ms);
  return d === 'vừa xong' ? d : `${d} trước`;
}

/** Stopwatch text: "08:32" or "1:05:09". */
export function stopwatch(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

/** Re-render every `ms` while mounted (for running timers). */
export function useNow(ms = 1000, active = true): number {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms, active]);
  return now;
}

export const sideName = (s: Side) => (s === 'L' ? 'trái' : 'phải');

/** Elapsed breastfeeding time per side, including the running segment. */
export function breastTotals(t: Timer, now: number): { L: number; R: number; total: number } {
  if (!t || t.kind !== 'breast') return { L: 0, R: 0, total: 0 };
  const L = t.acc.L + (t.side === 'L' && t.segStart ? now - t.segStart : 0);
  const R = t.acc.R + (t.side === 'R' && t.segStart ? now - t.segStart : 0);
  return { L, R, total: L + R };
}

export function lastBreastSide(logs: LogEntry[]): { side: Side; at: number } | null {
  const l = logs.find((x) => x.type === 'feed' && x.side);
  return l && l.side ? { side: l.side, at: l.at } : null;
}

/** Label + one-line detail for the Status Strip. */
export function statusSummary(logs: LogEntry[], timer: Timer, now: number, name: string) {
  const parts: string[] = [];
  const feed = logs.find((l) => l.type === 'feed');
  const diaper = logs.find((l) => l.type === 'diaper');
  if (feed) parts.push(`Bú lần cuối ${ago(feed.at, now)}${feed.side ? ` (bên ${sideName(feed.side)})` : ''}`);
  if (diaper) parts.push(`Tã ${ago(diaper.at, now)}`);

  if (timer && timer.kind === 'sleep') {
    return { asleep: true, status: `${name} đang ngủ · ${duration(now - timer.startAt)}`, detail: parts.join(' · ') || 'Chạm "Bé dậy rồi" khi bé thức' };
  }
  const sleep = logs.find((l) => l.type === 'sleep' && l.endAt);
  if (sleep && sleep.endAt) {
    return { asleep: false, status: `Đang thức · ${duration(now - sleep.endAt)}`, detail: parts.join(' · ') || `Ngủ dậy lúc ${clock(sleep.endAt)}` };
  }
  if (parts.length) return { asleep: false, status: 'Hôm nay của bé', detail: parts.join(' · ') };
  return { asleep: false, status: 'Chưa có ghi chép hôm nay', detail: 'Bấm nút + để ghi cữ ăn, giấc ngủ hoặc tã' };
}
