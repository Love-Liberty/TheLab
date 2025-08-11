// db/client.js

export function createSupabaseClient() {
          const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    throw new Error('Supabase client library not loaded');
  }

  const client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  return client;
}
