document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        resetFields(['firstName', 'lastName', 'email', 'password']);

        const payload = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value.trim()
        };

        try {
            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (res.ok) {
                showToast('success', 'Registration successful! Please login.');
                window.location.href = '/login';
            } else if (Array.isArray(json.error)) {
                handleErrors(json.error);
            } else {
                showToast('error', json.message || 'Registration failed');
            }
        } catch {
            showToast('error', 'Registration request failed');
        }
    });
});