/* ============================================================
   AUTH CONTEXT — passwordless session state + Face ID.
   Restores the persisted session on boot (ready=false until done).
   When Face ID is enabled for the account, the app boots locked and
   unlock() runs the biometric prompt.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AuthBackend, createAuthBackend, normalizePhone, Session } from './backend';

const faceIdKey = (phone: string) => `bww.faceid.v1.${phone}`;

export interface AuthApi {
  ready: boolean;
  session: Session | null;
  /** Send OTP; returns the demo code when running without SMS. */
  sendOtp(rawPhone: string): Promise<{ demoCode?: string }>;
  /** Verify the code — on success the session is set (account created if new). */
  verifyOtp(rawPhone: string, code: string): Promise<boolean>;
  signOut(): Promise<void>;

  /** Device has Face ID / Touch ID hardware with biometrics enrolled. */
  faceIdSupported: boolean;
  /** Face ID unlock is enabled for this account. */
  faceIdEnabled: boolean;
  /** Enable/disable Face ID. Enabling runs the biometric prompt first; resolves false if it fails. */
  setFaceIdEnabled(on: boolean): Promise<boolean>;
  /** True while the restored session is waiting for a biometric unlock. */
  locked: boolean;
  unlock(): Promise<boolean>;
}

const Ctx = createContext<AuthApi | null>(null);

export function useAuth(): AuthApi {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within <AuthProvider>');
  return c;
}

async function biometricsAvailable(): Promise<boolean> {
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch {
    return false;
  }
}

async function promptBiometric(): Promise<boolean> {
  try {
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Mở khóa Muby',
      cancelLabel: 'Để sau',
    });
    return res.success;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const backend = useRef<AuthBackend>(createAuthBackend()).current;
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [faceIdSupported, setFaceIdSupported] = useState(false);
  const [faceIdEnabled, setFaceIdEnabledState] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    (async () => {
      const supported = await biometricsAvailable();
      setFaceIdSupported(supported);
      let s: Session | null = null;
      try {
        s = await backend.restore();
      } catch {}
      if (s) {
        setSession(s);
        let enabled = false;
        try {
          enabled = (await AsyncStorage.getItem(faceIdKey(s.phone))) === '1';
        } catch {}
        setFaceIdEnabledState(enabled);
        // Only lock when the device can actually unlock, so nobody gets stranded.
        setLocked(enabled && supported);
      }
      setReady(true);
    })();
  }, [backend]);

  const api = useMemo<AuthApi>(
    () => ({
      ready,
      session,
      sendOtp: (raw) => backend.sendOtp(normalizePhone(raw)),
      verifyOtp: async (raw, code) => {
        const s = await backend.verifyOtp(normalizePhone(raw), code);
        if (!s) return false;
        let enabled = false;
        try {
          enabled = (await AsyncStorage.getItem(faceIdKey(s.phone))) === '1';
        } catch {}
        setFaceIdEnabledState(enabled);
        setLocked(false); // the OTP itself just proved it's you
        setSession(s);
        return true;
      },
      signOut: async () => {
        await backend.persist(null);
        setSession(null);
        setFaceIdEnabledState(false);
        setLocked(false);
      },
      faceIdSupported,
      faceIdEnabled,
      setFaceIdEnabled: async (on) => {
        if (!session) return false;
        if (on) {
          if (!(await biometricsAvailable())) return false;
          if (!(await promptBiometric())) return false;
        }
        setFaceIdEnabledState(on);
        try {
          if (on) await AsyncStorage.setItem(faceIdKey(session.phone), '1');
          else await AsyncStorage.removeItem(faceIdKey(session.phone));
        } catch {}
        return true;
      },
      locked,
      unlock: async () => {
        const ok = await promptBiometric();
        if (ok) setLocked(false);
        return ok;
      },
    }),
    [ready, session, backend, faceIdSupported, faceIdEnabled, locked]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}
