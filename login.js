// ----------------------------------------------------------
//  Supabase login script (browser)
// ----------------------------------------------------------
// 1️⃣  Add the Supabase JS CDN to your HTML page:
//
//    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//
// 2️⃣  Include this file after the CDN script.
//
// 3️⃣  The page must contain:
//     • an element with id="login-form"
//     • inputs with ids="email" and "password"
//     • a div with id="message" for feedback
// ----------------------------------------------------------

// Initialize Supabase client (replace with your own URL & anon key)
const supabase = window.supabase.createClient(
  'https://kcdlbqotmuyyqvzzbxcn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw'
);

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const messageDiv = document.getElementById('message');

  // If the form is missing, abort early
  if (!loginForm) {
    console.error('Login form not found – check your HTML.');
    return;
  }

  // Handle form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent page reload

    // Grab user input
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
      messageDiv.textContent = 'Please enter both email and password.';
      messageDiv.style.color = 'red';
      return;
    }

    try {
      // Sign‑in with email & password (Supabase v2 API)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Forward Supabase error to the UI
        throw error;
      }

      // Success – you now have a session (JWT) in data.session
      messageDiv.textContent = '✅ Login successful! Redirecting…';
      messageDiv.style.color = 'green';

      // Optional: Store the access token for later use (e.g., localStorage)
      // localStorage.setItem('supabase_token', data.session.access_token);

      // Redirect to a protected page after a short pause
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
    } catch (err) {
      // Show any error that occurred
      messageDiv.textContent = `❌ Error: ${err.message}`;
      messageDiv.style.color = 'red';
    }
  });
});
