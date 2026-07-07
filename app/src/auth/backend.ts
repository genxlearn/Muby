/* ============================================================
   AUTH BACKEND — pluggable phone-auth service.

   - DemoAuthBackend (default): fully working offline auth. Accounts are
     stored on-device (SHA-256 password hash via expo-crypto); the OTP is
     generated locally and RETURNED so the UI can display it — there is no
     SMS provider in demo mode.
   - SupabaseAuthBackend: real SMS OTP via Supabase Auth REST (requires a
     Supabase project with a phone provider such as Twilio). Fill in
     src/auth/config.ts and switch mode to 'supabase'.
   ============================================================ */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { AUTH_CONFIG } from './config';

export interface Session {
  phone: string;            // normalized +84…
  accessToken?: string;     // present for supabase sessions
  refreshToken?: string;
}

export interface AuthBackend {
  /** Send an OTP to the phone. Demo mode returns the code for on-screen display. */
  sendOtp(phone: string, purpose: 'register' | 'reset'): Promise<{ demoCode?: string }>;
  verifyOtp(phone: string, code: string): Promise<boolean>;
  /** Create the account (call after verifyOtp for 'register'). */
  signUp(phone: string, password: string): Promise<Session>;
  signIn(phone: string, password: string): Promise<Session>;
  /** Set a new password (call after verifyOtp for 'reset'). */
  resetPassword(phone: string, newPassword: string): Promise<void>;
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
  constructor(public code: 'wrong-credentials' | 'exists' | 'not-found' | 'otp-invalid' | 'network', message: string) {
    super(message);
  }
}

/* ============================================================
   DEMO BACKEND (on-device)
   ============================================================ */
const K_USERS = 'bww.users.v1';
const K_SESSION = 'bww.session.v1';

interface StoredUsers { [phone: string]: { hash: string; createdAt: number } }

async function hashPassword(phone: string, password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `bww|${phone}|${password}`);
}

class DemoAuthBackend implements AuthBackend {
  private otps: Record<string, { code: string; exp: number }> = {};

  private async users(): Promise<StoredUsers> {
    const raw = await AsyncStorage.getItem(K_USERS);
    return raw ? (JSON.parse(raw) as StoredUsers) : {};
  }

  async sendOtp(phone: string): Promise<{ demoCode?: string }> {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    this.otps[phone] = { code, exp: Date.now() + 5 * 60 * 1000 };
    return { demoCode: code };
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    const rec = this.otps[phone];
    return !!rec && rec.exp > Date.now() && rec.code === code;
  }

  async signUp(phone: string, password: string): Promise<Session> {
    const users = await this.users();
    // Re-registering an existing number simply resets its password after OTP —
    // gentler than blocking, and right for a demo store.
    users[phone] = { hash: await hashPassword(phone, password), createdAt: Date.now() };
    await AsyncStorage.setItem(K_USERS, JSON.stringify(users));
    const session = { phone };
    await this.persist(session);
    return session;
  }

  async signIn(phone: string, password: string): Promise<Session> {
    const users = await this.users();
    const rec = users[phone];
    if (!rec || rec.hash !== (await hashPassword(phone, password))) {
      throw new AuthError('wrong-credentials', 'SĐT hoặc mật khẩu chưa đúng. Thử lại nhé?');
    }
    const session = { phone };
    await this.persist(session);
    return session;
  }

  async resetPassword(phone: string, newPassword: string): Promise<void> {
    const users = await this.users();
    if (!users[phone]) throw new AuthError('not-found', 'SĐT chưa đăng ký.');
    users[phone].hash = await hashPassword(phone, newPassword);
    await AsyncStorage.setItem(K_USERS, JSON.stringify(users));
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
  private verified: Record<string, Session> = {};

  private async call(path: string, body: unknown, token?: string): Promise<any> {
    let res: Response;
    try {
      res = await fetch(`${this.base}/auth/v1/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: AUTH_CONFIG.supabaseAnonKey,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new AuthError('network', 'Mạng lag chút xíu. Mình thử lại nhé.');
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = (json as any).msg || (json as any).error_description || 'Có lỗi xảy ra. Thử lại nhé.';
      throw new AuthError('wrong-credentials', msg);
    }
    return json;
  }

  async sendOtp(phone: string): Promise<{ demoCode?: string }> {
    await this.call('otp', { phone });
    return {};
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
    try {
      const json = await this.call('verify', { type: 'sms', phone, token: code });
      this.verified[phone] = { phone, accessToken: json.access_token, refreshToken: json.refresh_token };
      return true;
    } catch {
      return false;
    }
  }

  async signUp(phone: string, password: string): Promise<Session> {
    // verifyOtp already created the session; set the chosen password on it.
    const s = this.verified[phone];
    if (!s?.accessToken) throw new AuthError('otp-invalid', 'Mã chưa được xác thực.');
    await fetch(`${this.base}/auth/v1/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', apikey: AUTH_CONFIG.supabaseAnonKey, Authorization: `Bearer ${s.accessToken}` },
      body: JSON.stringify({ password }),
    });
    await this.persist(s);
    return s;
  }

  async signIn(phone: string, password: string): Promise<Session> {
    let res: Response;
    try {
      res = await fetch(`${this.base}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: AUTH_CONFIG.supabaseAnonKey },
        body: JSON.stringify({ phone, password }),
      });
    } catch {
      throw new AuthError('network', 'Mạng lag chút xíu. Mình thử lại nhé.');
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new AuthError('wrong-credentials', 'SĐT hoặc mật khẩu chưa đúng. Thử lại nhé?');
    const session = { phone, accessToken: json.access_token, refreshToken: json.refresh_token };
    await this.persist(session);
    return session;
  }

  async resetPassword(phone: string, newPassword: string): Promise<void> {
    await this.signUp(phone, newPassword); // same flow: verified OTP session + password update
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
