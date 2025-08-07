// Initialize Supabase client
const supabase = window.supabase.createClient(
    'YOUR_SUPABASE_URL', 
    'YOUR_SUPABASE_ANON_KEY'
);

document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('reset-form');
    const messageDiv = document.getElementById('message');

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        messageDiv.innerHTML = 'Invalid or missing reset token.';
        resetForm.style.display = 'none';
    }

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value;

        try {
            const { data, error } = await supabase.auth.updateUser(token, {
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
