/* ============================================================
   AUTH CONFIG
   - mode 'demo': works out of the box — accounts live on-device and the
     OTP code is shown inside the app (no SMS is sent).
   - mode 'supabase': real SMS OTP. Create a Supabase project, enable the
     Phone provider (Twilio/Vonage/MessageBird), then fill in the URL and
     anon key below and set mode to 'supabase'.
   ============================================================ */
export const AUTH_CONFIG = {
  mode: 'demo' as 'demo' | 'supabase',
  supabaseUrl: 'https://YOUR-PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR-ANON-KEY',
};
