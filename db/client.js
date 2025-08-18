// db/client.js
// We import createClient directly from the Supabase library.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Your Supabase URL and key are defined here.
//const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
//wrong const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjU.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';

const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';


// We'll use this variable to store the single instance of our client.
let supabaseClient;

/**
 * Creates and returns a single Supabase client instance.
 * Subsequent calls will return the same instance.
 * @returns {import('@supabase/supabase-js').SupabaseClient} The Supabase client.
 */
export function createSupabaseClient() {
  // If a client instance already exists, just return it.
  if (supabaseClient) {
    return supabaseClient;
  }
  
  // If not, create a new client and store it in our variable.
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
    persistSession: true, // ← Now session saves to localStorage
  });

  // Acknowledge the creation of the client
  console.log('🎉 Supabase client created successfully!');

  // Return the newly created client.
  return supabaseClient;
}

