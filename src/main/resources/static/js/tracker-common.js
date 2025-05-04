function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">×</button>`;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
}

function resetFields(fields) {
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('error');
    });
}

function handleErrors(errors) {
    errors.forEach(({ field, message }) => {
        const el = document.getElementById(field.toLowerCase());
        if (el) el.classList.add('error');
        showToast('error', `${field}: ${message}`);
    });
}
