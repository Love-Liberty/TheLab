// db/client.js
// We import createClient directly from the Supabase library.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Your Supabase URL and key are defined here.
// It's good practice to keep them separate from the function itself.
const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';

/**
 * Creates and returns a Supabase client instance.
 * @returns {import('@supabase/supabase-js').SupabaseClient} The Supabase client.
 */
export function createSupabaseClient() {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });
  return client;
}
