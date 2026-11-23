/* ============================================================
   AUTH CONFIG
   Real SMS OTP turns on automatically when both values are set at
   build time (Expo inlines EXPO_PUBLIC_* variables):
     EXPO_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
     EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   Put them in app/.env for local runs and in EAS (eas env:create) for
   store builds. Without them the app falls back to 'demo' mode, where
   the OTP is shown on screen and no SMS is sent.
   ============================================================ */
const url = (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
const key = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

export const AUTH_CONFIG = {
  mode: (url && key ? 'supabase' : 'demo') as 'demo' | 'supabase',
  supabaseUrl: url,
  supabaseAnonKey: key,
};
