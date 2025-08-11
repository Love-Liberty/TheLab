// db/client.js

export function createSupabaseClient() {
  const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for brevity

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    throw new Error('Supabase client library not loaded');
  }

  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  return client;
}
