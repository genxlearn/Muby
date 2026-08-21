/* ============================================================
   APP CONTEXT — state machine ported from app-clean.jsx.
   Pure immersive flow (no external controls): Auth → Onboarding → App.
   Premium is a reverse trial: 7 days start automatically at signup
   (no card), then the app falls back to Free until the one-time
   199k unlock. Both are persisted per account.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ThemeMode } from '../theme/tokens';

export type Flow = 'auth' | 'onboard' | 'app';
export type Tab = 'today' | 'leap' | 'growth' | 'me';
export type Stack =
  | 'leapdetail' | 'measure' | 'history' | 'library' | 'notifications'
  | 'easy' | 'me' | 'designsystem' | null;
export type Sheet = 'quicklog' | 'soothing' | null;

export interface Route {
  flow: Flow;
  tab: Tab;
  stack: Stack;
  authStep?: string;
  obStep?: string;
}

export interface Toast { text: string; id: number }
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

  /** One-time 199k unlock — persists for this account. */
  buyPremium: () => void;
  /** (Re)start the 7-day reverse trial — normally only fired at signup. */
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
  /** Normalized phone of the signed-in account — premium/trial persist per account. */
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
    toast: (text) => {
      toastSeq.current += 1;
      setToastVal({ text, id: toastSeq.current });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToastVal(null), 3000);
    },
  };

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}
