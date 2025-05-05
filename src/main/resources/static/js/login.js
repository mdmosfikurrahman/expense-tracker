document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resetFields(['email', 'password']);

        const payload = {
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        try {
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (res.ok) {
                window.location.href = '/';
            } else if (Array.isArray(json.error)) {
                handleErrors(json.error);
            } else {
                showToast('error', json.message || 'Login failed');
            }
        } catch {
            showToast('error', 'Login request failed');
        }
    });
});