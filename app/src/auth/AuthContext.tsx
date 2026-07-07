/* ============================================================
   AUTH CONTEXT — session state + phone-auth actions.
   Restores the persisted session on boot (ready=false until done).
   ============================================================ */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthBackend, createAuthBackend, normalizePhone, Session } from './backend';

export interface AuthApi {
  ready: boolean;
  session: Session | null;
  /** Send OTP; returns the demo code when running without SMS. */
  sendOtp(rawPhone: string, purpose: 'register' | 'reset'): Promise<{ demoCode?: string }>;
  verifyOtp(rawPhone: string, code: string): Promise<boolean>;
  signUp(rawPhone: string, password: string): Promise<void>;
  signIn(rawPhone: string, password: string): Promise<void>;
  resetPassword(rawPhone: string, newPassword: string): Promise<void>;
  signOut(): Promise<void>;
}

const Ctx = createContext<AuthApi | null>(null);

export function useAuth(): AuthApi {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within <AuthProvider>');
  return c;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const backend = useRef<AuthBackend>(createAuthBackend()).current;
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    backend
      .restore()
      .then((s) => setSession(s))
      .catch(() => {})
      .finally(() => setReady(true));
  }, [backend]);

  const api = useMemo<AuthApi>(
    () => ({
      ready,
      session,
      sendOtp: (raw, purpose) => backend.sendOtp(normalizePhone(raw), purpose),
      verifyOtp: (raw, code) => backend.verifyOtp(normalizePhone(raw), code),
      signUp: async (raw, password) => {
        const s = await backend.signUp(normalizePhone(raw), password);
        setSession(s);
      },
      signIn: async (raw, password) => {
        const s = await backend.signIn(normalizePhone(raw), password);
        setSession(s);
      },
      resetPassword: (raw, newPassword) => backend.resetPassword(normalizePhone(raw), newPassword),
      signOut: async () => {
        await backend.persist(null);
        setSession(null);
      },
    }),
    [ready, session, backend]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
