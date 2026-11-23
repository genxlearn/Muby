/* ============================================================
   APP CONTEXT - state machine ported from app-clean.jsx.
   Pure immersive flow (no external controls): Auth → Onboarding → App.
   Premium is a reverse trial: 7 days start automatically at signup
   (no card), then the app falls back to Free until the one-time
   79.000đ unlock (store in-app purchase). Both are persisted per account.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ThemeMode } from '../theme/tokens';
import * as IAP from '../purchases/iap';

export type Flow = 'auth' | 'onboard' | 'app';
export type Tab = 'today' | 'leap' | 'growth' | 'community';
export type Stack =
  | 'leapdetail' | 'measure' | 'history' | 'library' | 'notifications'
  | 'easy' | 'me' | 'designsystem' | 'feedtimer' | 'sleeptimer' | null;
export type Sheet = 'quicklog' | 'soothing' | null;

export interface Route {
  flow: Flow;
  tab: Tab;
  stack: Stack;
  authStep?: string;
  obStep?: string;
}

export interface Toast { text: string; id: number }

/* ---- Logs, running timer, milestones (MVP v2.1) ---- */
export type LogType = 'feed' | 'sleep' | 'diaper' | 'mood';
export type Side = 'L' | 'R';
export interface LogEntry {
  id: string;
  type: LogType;
  label: string;   // "Cữ ăn"
  detail: string;  // "120 ml", "Bú mẹ · trái 8p, phải 6p"
  at: number;      // start time (ms)
  endAt?: number;  // sleep end
  side?: Side;     // last breast side used
}
export type Timer =
  | { kind: 'breast'; startAt: number; side: Side | null; segStart: number | null; acc: { L: number; R: number } }
  | { kind: 'sleep'; startAt: number }
  | null;

export interface Trial { daysLeft: number }
export interface Paywall { title: string }

export interface AppCtx {
  theme: ThemeMode;
  route: Route;
  sheet: Sheet;
  toastVal: Toast | null;
  intensity: number;
  empty: boolean;
  paywall: Paywall | null;
  premium: boolean;       // effective unlock (purchased OR reverse trial running)
  purchased: boolean;
  trial: Trial | null;

  /** Grant the unlock locally (after a verified store purchase / restore). */
  buyPremium: () => void;
  /** Store purchase flow; resolves with the outcome. Grants Premium on success. */
  purchase: () => Promise<IAP.BuyResult>;
  /** Restore a previous store purchase. */
  restorePurchase: () => Promise<'ok' | 'none' | 'unavailable'>;
  /** Localized price from the store, falls back to 79.000đ. */
  priceLabel: string;
  /** (Re)start the 7-day reverse trial - normally only fired at signup. */
  startTrial: () => void;
  cancelTrial: () => void;
  setTheme: (m: ThemeMode) => void;
  setTab: (t: Tab) => void;
  go: (stack: Exclude<Stack, null>) => void;
  back: () => void;
  goFlow: (flow: Flow, extra?: Partial<Route>) => void;
  setRoute: React.Dispatch<React.SetStateAction<Route>>;
  openSheet: (s: Exclude<Sheet, null>) => void;
  closeSheet: () => void;
  setIntensity: (n: number) => void;
  setEmpty: (b: boolean) => void;
  setPremium: (b: boolean) => void;
  openPaywall: (title: string) => void;
  closePaywall: () => void;
  toast: (text: string) => void;

  logs: LogEntry[];
  addLog: (e: Omit<LogEntry, 'id'>) => void;
  timer: Timer;
  setTimer: (t: Timer) => void;
  /** key `${leapN}:${index}` → date checked (ms) */
  milestones: Record<string, number>;
  toggleMilestone: (key: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used within <AppProvider>');
  return c;
}

/* ---- persisted premium record (per account) ---- */
const TRIAL_DAYS = 7;
const premiumKey = (account: string) => `bww.premium.v2.${account}`;
const careKey = (account: string) => `bww.care.v1.${account}`;
interface CareRecord { logs: LogEntry[]; timer: Timer; milestones: Record<string, number> }
interface PremiumRecord { purchased: boolean; trialStart: number | null }

function daysLeftOf(rec: PremiumRecord): number {
  if (rec.trialStart == null) return 0;
  const elapsed = Math.floor((Date.now() - rec.trialStart) / 86400000);
  return Math.max(0, TRIAL_DAYS - elapsed);
}

export function AppProvider({
  themeMode,
  setThemeMode,
  initialRoute,
  accountKey = 'local',
  children,
}: {
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  initialRoute?: Route;
  /** Normalized phone of the signed-in account - premium/trial persist per account. */
  accountKey?: string;
  children: React.ReactNode;
}) {
  const [route, setRoute] = useState<Route>(
    initialRoute ?? { flow: 'auth', tab: 'today', stack: null, authStep: 'A1' }
  );
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toastVal, setToastVal] = useState<Toast | null>(null);
  const [intensity, setIntensity] = useState(2);
  const [empty, setEmpty] = useState(false);
  const [rec, setRec] = useState<PremiumRecord>({ purchased: false, trialStart: null });
  const [paywall, setPaywall] = useState<Paywall | null>(null);
  const [care, setCare] = useState<CareRecord>({ logs: [], timer: null, milestones: {} });
  const careLoaded = useRef(false);
  const [priceLabel, setPriceLabel] = useState(IAP.FALLBACK_PRICE);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastSeq = useRef(0);

  // Load the account's premium record; first entry starts the reverse trial.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(premiumKey(accountKey));
        if (raw) {
          if (alive) setRec(JSON.parse(raw) as PremiumRecord);
        } else {
          const fresh: PremiumRecord = { purchased: false, trialStart: Date.now() };
          if (alive) setRec(fresh);
          await AsyncStorage.setItem(premiumKey(accountKey), JSON.stringify(fresh));
        }
      } catch {}
    })();
    return () => {
      alive = false;
    };
  }, [accountKey]);

  // Logs, running timer and milestones persist per account.
  useEffect(() => {
    let alive = true;
    careLoaded.current = false;
    AsyncStorage.getItem(careKey(accountKey))
      .then((raw) => {
        if (!alive) return;
        if (raw) setCare({ logs: [], timer: null, milestones: {}, ...(JSON.parse(raw) as Partial<CareRecord>) });
        careLoaded.current = true;
      })
      .catch(() => { careLoaded.current = true; });
    return () => { alive = false; };
  }, [accountKey]);
  const updateCare = (fn: (c: CareRecord) => CareRecord) => {
    setCare((c) => {
      const next = fn(c);
      AsyncStorage.setItem(careKey(accountKey), JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  // Store price + silent ownership check (re-grants Premium after reinstall).
  useEffect(() => {
    let alive = true;
    IAP.loadPrice().then((p) => { if (alive && p) setPriceLabel(p); });
    IAP.ownsPremium().then((owned) => {
      if (alive && owned) setRec((r) => {
        if (r.purchased) return r;
        const next = { ...r, purchased: true };
        AsyncStorage.setItem(premiumKey(accountKey), JSON.stringify(next)).catch(() => {});
        return next;
      });
    });
    return () => { alive = false; };
  }, [accountKey]);

  const saveRec = (next: PremiumRecord) => {
    setRec(next);
    AsyncStorage.setItem(premiumKey(accountKey), JSON.stringify(next)).catch(() => {});
  };

  const daysLeft = daysLeftOf(rec);
  const trial: Trial | null = !rec.purchased && daysLeft > 0 ? { daysLeft } : null;

  const ctx: AppCtx = {
    theme: themeMode,
    route,
    sheet,
    toastVal,
    intensity,
    empty,
    paywall,
    premium: rec.purchased || !!trial, // trial unlocks everything
    purchased: rec.purchased,
    trial,
    buyPremium: () => saveRec({ ...rec, purchased: true }),
    purchase: async () => {
      const r = await IAP.buyPremium();
      // Expo Go has no store module: allow a simulated unlock only in development.
      if (r === 'unavailable' && __DEV__) { saveRec({ ...rec, purchased: true }); return 'ok'; }
      if (r === 'ok') saveRec({ ...rec, purchased: true });
      return r;
    },
    restorePurchase: async () => {
      const r = await IAP.restorePremium();
      if (r === 'ok') saveRec({ ...rec, purchased: true });
      return r;
    },
    priceLabel,
    startTrial: () => saveRec({ ...rec, trialStart: Date.now() }),
    cancelTrial: () => saveRec({ ...rec, trialStart: null }),
    setTheme: setThemeMode,
    setTab: (t) => { setRoute({ flow: 'app', tab: t, stack: null }); setSheet(null); },
    go: (stack) => { setRoute((r) => ({ ...r, flow: 'app', stack })); setSheet(null); },
    back: () => setRoute((r) => ({ ...r, stack: null })),
    goFlow: (flow, extra = {}) => { setRoute({ flow, tab: 'today', stack: null, ...extra }); setSheet(null); },
    setRoute,
    openSheet: (s) => setSheet(s),
    closeSheet: () => setSheet(null),
    setIntensity,
    setEmpty,
    setPremium: (b) => saveRec({ ...rec, purchased: b }),
    openPaywall: (title) => setPaywall({ title }),
    closePaywall: () => setPaywall(null),
    logs: care.logs,
    addLog: (e) =>
      updateCare((c) => ({
        ...c,
        logs: [{ ...e, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, ...c.logs]
          .sort((a, b) => b.at - a.at)
          .slice(0, 300),
      })),
    timer: care.timer,
    setTimer: (t) => updateCare((c) => ({ ...c, timer: t })),
    milestones: care.milestones,
    toggleMilestone: (key) =>
      updateCare((c) => {
        const m = { ...c.milestones };
        if (m[key]) delete m[key];
        else m[key] = Date.now();
        return { ...c, milestones: m };
      }),
    toast: (text) => {
      toastSeq.current += 1;
      setToastVal({ text, id: toastSeq.current });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVal(null), 3000);
    },
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
