// db/client.js

export function createSupabaseClientHIDE() {
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

 /**
     * Performs a diagnostic check on the Supabase connection and client.
     Normal name: async function diagnoseSupabase()
     change to createSupabaseClient()
     and hide the other function as 
     export function createSupabaseClientHIDE()
     */
export async function createSupabaseClient() {
        const supabaseUrl = 'https://kcdlbqotmuyyqvzzbxcn.supabase.co';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw';

        console.log('Starting Supabase Diagnostic...');
        console.log(`Supabase URL: ${supabaseUrl}`);

        try {
            const { createClient } = window.supabase;
            if (typeof createClient !== 'function') {
                throw new Error('createClient is not a function');
            }
            log('✓ Supabase createClient method found');

            supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false }
            });
            console.log('✓ Supabase client created and assigned globally');

            if (typeof supabaseClient.from !== 'function') {
                throw new Error('supabaseClient.from is not a function');
            }
            console.log('✓ Supabase client methods verified');

            const { data, error } = await supabaseClient.from('notes').select('*');

            if (error) {
                console.log('✗ Database read error:');
                console.log(JSON.stringify(error, null, 2));
            } else {
                console.log('✓ Successfully read from database');
                console.log(`Records found: ${data.length}`);
            }
        } catch (err) {
            console.log('✗ Diagnostic failed:');
            console.log(err.message);
            console.log(JSON.stringify(err, null, 2));
        }
    }
