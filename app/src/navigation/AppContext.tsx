/* ============================================================
   APP CONTEXT — state machine ported from app-clean.jsx.
   Pure immersive flow (no external controls): Auth → Onboarding → App.
   ============================================================ */
import React, { createContext, useContext, useRef, useState } from 'react';
import { ThemeMode } from '../theme/tokens';

export type Flow = 'auth' | 'onboard' | 'app';
export type Tab = 'today' | 'leap' | 'growth' | 'me';
export type Stack =
  | 'leapdetail' | 'measure' | 'history' | 'library' | 'notifications' | 'designsystem' | null;
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
  premium: boolean;       // effective unlock (purchased OR trial)
  purchased: boolean;
  trial: Trial | null;

  startTrial: () => void;
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

export function AppProvider({
  themeMode,
  setThemeMode,
  children,
}: {
  themeMode: ThemeMode;
  setThemeMode: (m: ThemeMode) => void;
  children: React.ReactNode;
}) {
  const [route, setRoute] = useState<Route>({ flow: 'auth', tab: 'today', stack: null, authStep: 'A1' });
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toastVal, setToastVal] = useState<Toast | null>(null);
  const [intensity, setIntensity] = useState(2);
  const [empty, setEmpty] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [trial, setTrial] = useState<Trial | null>(null);
  const [paywall, setPaywall] = useState<Paywall | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastSeq = useRef(0);

  const ctx: AppCtx = {
    theme: themeMode,
    route,
    sheet,
    toastVal,
    intensity,
    empty,
    paywall,
    premium: purchased || !!trial, // trial unlocks everything
    purchased,
    trial,
    startTrial: () => setTrial({ daysLeft: 30 }),
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
    setPremium: setPurchased,
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
