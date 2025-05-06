// tracker-common.js

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

function populateMonthYearDropdown(monthEl, yearEl) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const defaultMonth = new Option('-- Select Month --', '', true, true);
    defaultMonth.disabled = true;
    monthEl.appendChild(defaultMonth);

    monthNames.forEach(month => {
        monthEl.appendChild(new Option(month, month));
    });

    const currentYear = new Date().getFullYear();
    const defaultYear = new Option('-- Select Year --', '', true, true);
    defaultYear.disabled = true;
    yearEl.appendChild(defaultYear);

    for (let year = currentYear + 2; year >= currentYear - 10; year--) {
        yearEl.appendChild(new Option(year, year));
    }
}
