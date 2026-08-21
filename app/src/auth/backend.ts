/* ============================================================
   AUTH BACKEND — pluggable passwordless phone auth (OTP only).

   - DemoAuthBackend (default): fully working offline auth. The OTP is
     generated locally and RETURNED so the UI can display it — there is
     no SMS provider in demo mode. Verifying the code signs you in
     (and creates the account on first use).
   - SupabaseAuthBackend: real SMS OTP via Supabase Auth REST (requires
     a Supabase project with a phone provider such as Twilio). Fill in
     src/auth/config.ts and switch mode to 'supabase'.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_CONFIG } from './config';

export interface Session {
  phone: string;            // normalized +84…
  accessToken?: string;     // present for supabase sessions
  refreshToken?: string;
}

export interface AuthBackend {
  /** Send an OTP to the phone. Demo mode returns the code for on-screen display. */
  sendOtp(phone: string): Promise<{ demoCode?: string }>;
  /** Verify the code. On success the account exists (created if new) and a session is persisted. */
  verifyOtp(phone: string, code: string): Promise<Session | null>;
  restore(): Promise<Session | null>;
  persist(session: Session | null): Promise<void>;
}

/** '+84' + digits, from local input like '912 345 678'. */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  const rest = digits.startsWith('84') ? digits.slice(2) : digits.replace(/^0/, '');
  return '+84' + rest;
}

export class AuthError extends Error {
  constructor(public code: 'otp-invalid' | 'network' | 'unknown', message: string) {
    super(message);
  }
}

/* ============================================================
   DEMO BACKEND (on-device)
   ============================================================ */
const K_USERS = 'bww.users.v2';
const K_SESSION = 'bww.session.v1';

interface StoredUsers { [phone: string]: { createdAt: number } }

class DemoAuthBackend implements AuthBackend {
  private otps: Record<string, { code: string; exp: number }> = {};

  async sendOtp(phone: string): Promise<{ demoCode?: string }> {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.otps[phone] = { code, exp: Date.now() + 5 * 60 * 1000 };
    return { demoCode: code };
  }

  async verifyOtp(phone: string, code: string): Promise<Session | null> {
    const rec = this.otps[phone];
    if (!rec || rec.exp <= Date.now() || rec.code !== code) return null;
    delete this.otps[phone];
    const raw = await AsyncStorage.getItem(K_USERS);
    const users: StoredUsers = raw ? JSON.parse(raw) : {};
    if (!users[phone]) {
      users[phone] = { createdAt: Date.now() };
      await AsyncStorage.setItem(K_USERS, JSON.stringify(users));
    }
    const session: Session = { phone };
    await this.persist(session);
    return session;
  }

  async restore(): Promise<Session | null> {
    const raw = await AsyncStorage.getItem(K_SESSION);
    return raw ? (JSON.parse(raw) as Session) : null;
  }

  async persist(session: Session | null): Promise<void> {
    if (session) await AsyncStorage.setItem(K_SESSION, JSON.stringify(session));
    else await AsyncStorage.removeItem(K_SESSION);
  }
}

/* ============================================================
   SUPABASE BACKEND (real SMS via Supabase Auth REST)
   ============================================================ */
class SupabaseAuthBackend implements AuthBackend {
  private base = AUTH_CONFIG.supabaseUrl.replace(/\/$/, '');

  private async call(path: string, body: unknown): Promise<any> {
    let res: Response;
    try {
      res = await fetch(`${this.base}/auth/v1/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: AUTH_CONFIG.supabaseAnonKey },
        body: JSON.stringify(body),
      });
    } catch {
      throw new AuthError('network', 'Mạng lag chút xíu. Mình thử lại nhé.');
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json as any).msg || (json as any).error_description || 'Có lỗi xảy ra. Thử lại nhé.';
      throw new AuthError('unknown', msg);
    }
    return json;
  }

  async sendOtp(phone: string): Promise<{ demoCode?: string }> {
    await this.call('otp', { phone, create_user: true });
    return {};
  }

  async verifyOtp(phone: string, code: string): Promise<Session | null> {
    try {
      const json = await this.call('verify', { type: 'sms', phone, token: code });
      const session: Session = { phone, accessToken: json.access_token, refreshToken: json.refresh_token };
      await this.persist(session);
      return session;
    } catch (e) {
      if (e instanceof AuthError && e.code === 'network') throw e;
      return null;
    }
  }

  async restore(): Promise<Session | null> {
    const raw = await AsyncStorage.getItem(K_SESSION);
    return raw ? (JSON.parse(raw) as Session) : null;
  }

  async persist(session: Session | null): Promise<void> {
    if (session) await AsyncStorage.setItem(K_SESSION, JSON.stringify(session));
    else await AsyncStorage.removeItem(K_SESSION);
  }
}

export function createAuthBackend(): AuthBackend {
  return AUTH_CONFIG.mode === 'supabase' ? new SupabaseAuthBackend() : new DemoAuthBackend();
}
