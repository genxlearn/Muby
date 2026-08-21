/* ============================================================
   BABY CONTEXT — the baby profile (per signed-in account, persisted)
   plus everything derived from the real date of birth via leapEngine.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BabyProfile, BabyState, computeBabyState } from '../data/leapEngine';

const keyFor = (phone: string | null) => `bww.baby.v1.${phone ?? 'local'}`;

/** Whether a baby profile is already saved for this account (used right after sign-in). */
export async function hasBabyFor(phone: string | null): Promise<boolean> {
  try {
    return !!(await AsyncStorage.getItem(keyFor(phone)));
  } catch {
    return false;
  }
}

/** Fallback shown before onboarding finishes (matches the design sample). */
const SAMPLE_DOB = (() => {
  const d = new Date();
  d.setDate(d.getDate() - 105); // ~15 weeks → mid-Leap 4, like the prototype
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
})();

export interface BabyApi {
  ready: boolean;
  /** Null until onboarding has saved a baby. */
  baby: BabyProfile | null;
  /** Display name — baby's name or the affectionate default. */
  displayName: string;
  /** Derived, always available (uses a sample DOB before onboarding). */
  state: BabyState;
  saveBaby(profile: BabyProfile): Promise<void>;
  clear(): void;
}

const Ctx = createContext<BabyApi | null>(null);

export function useBaby(): BabyApi {
  const c = useContext(Ctx);
  if (!c) throw new Error('useBaby must be used within <BabyProvider>');
  return c;
}

export function BabyProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const phone = auth.session?.phone ?? null;
  const [ready, setReady] = useState(false);
  const [baby, setBaby] = useState<BabyProfile | null>(null);
  // re-derive at least daily so the age rolls over correctly on long-running apps
  const [dayStamp, setDayStamp] = useState(() => new Date().toDateString());

  useEffect(() => {
    let alive = true;
    setReady(false);
    AsyncStorage.getItem(keyFor(phone))
      .then((raw) => {
        if (!alive) return;
        setBaby(raw ? (JSON.parse(raw) as BabyProfile) : null);
      })
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [phone]);

  useEffect(() => {
    const t = setInterval(() => {
      const stamp = new Date().toDateString();
      setDayStamp((prev) => (prev === stamp ? prev : stamp));
    }, 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const saveBaby = useCallback(
    async (profile: BabyProfile) => {
      setBaby(profile);
      await AsyncStorage.setItem(keyFor(phone), JSON.stringify(profile));
    },
    [phone]
  );

  const state = useMemo(
    () => computeBabyState(baby?.dob ?? SAMPLE_DOB, baby?.dueDate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baby?.dob, baby?.dueDate, dayStamp]
  );

  const api = useMemo<BabyApi>(
    () => ({
      ready,
      baby,
      displayName: baby?.name?.trim() || 'Bé yêu',
      state,
      saveBaby,
      clear: () => setBaby(null),
    }),
    [ready, baby, state, saveBaby]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
