//login.js
import { createSupabaseClient } from './client.js';
console.log('login.js');
const supabase = createSupabaseClient();

async function signup() {
  console.log('signup()');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else alert("Check your email to confirm signup.");
}

async function login() {
  console.log('Supabase client:', supabase);

  console.log('login()');
  try {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const { error, session } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else alert("Logged in!");
  } catch (err) {
    console.error('Login error:', err);
    alert('Unexpected error: ' + err.message);
  }
}
