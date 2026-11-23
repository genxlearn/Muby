// Supabase Edge Function: delete-account
// Deletes the calling user (identified by their JWT) from Supabase Auth.
// Deploy:  supabase functions deploy delete-account
// The app calls it from Mama › Tài khoản › Xoá tài khoản (Apple guideline 5.1.1(v)).
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const auth = req.headers.get('Authorization') ?? '';
  const jwt = auth.replace(/^Bearer\s+/i, '');
  if (!jwt) return new Response('Missing token', { status: 401 });

  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const admin = createClient(url, serviceKey);

  const { data, error } = await admin.auth.getUser(jwt);
  if (error || !data?.user) return new Response('Invalid token', { status: 401 });

  const { error: delErr } = await admin.auth.admin.deleteUser(data.user.id);
  if (delErr) return new Response(delErr.message, { status: 500 });
  return new Response(JSON.stringify({ deleted: true }), { headers: { 'Content-Type': 'application/json' } });
});
