// Initialize Supabase client
const supabase = window.supabase.createClient(
'https://kcdlbqotmuyyqvzzbxcn.supabase.co', 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZGxicW90bXV5eXF2enpieGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTY3MjUsImV4cCI6MjA2OTk3MjcyNX0.jn1qV-Hz_z8pDVlQiR20Kwv_12BDL_z9rcHZvdbdahw'
);      

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const messageDiv = document.getElementById('message');

    // Extract token from URL hash instead of search params
    const token = window.location.hash.split('token=')[1]?.split('&')[0];

    if (!token) {
        messageDiv.innerHTML = 'Invalid or missing reset token.';
        resetForm.style.display = 'none';
        return;
    }

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;

        try {
            // Correct method signature
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) {
                throw error;
            }

            // Success message
            messageDiv.innerHTML = 'Password reset successfully!';
            messageDiv.style.color = 'green';
            resetForm.style.display = 'none';

            // Optional: Redirect to login page after a few seconds
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 3000);

        } catch (error) {
            // Error handling
            messageDiv.innerHTML = `Error: ${error.message}`;
            messageDiv.style.color = 'red';
        }
    });
});
