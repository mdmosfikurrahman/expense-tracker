document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('income-form');
    const tableBody = document.querySelector('#income-table tbody');

    const loadIncomes = async () => {
        try {
            const res = await fetch('/incomes');
            const json = await res.json();
            tableBody.innerHTML = '';

            json.data.forEach(income => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${income.source}</td>
                    <td>${income.amount}</td>
                    <td>${income.month}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (err) {
            showToast('error', 'Failed to load income data');
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        ['source', 'amount', 'month'].forEach(field => {
            const input = document.getElementById(field);
            input.classList.remove('error');
        });

        const source = document.getElementById('source').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const month = document.getElementById('month').value.trim();

        try {
            const res = await fetch('/incomes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source, amount, month })
            });

            const json = await res.json();

            if (res.ok) {
                form.reset();
                showToast('success', 'Income saved successfully!');
                await loadIncomes();
            } else if (json.error && Array.isArray(json.error)) {
                json.error.forEach(err => {
                    const field = err.field.toLowerCase();
                    const input = document.getElementById(field);
                    if (input) {
                        input.classList.add('error');
                    }
                    showToast('error', `${err.field}: ${err.message}`);
                });
            } else {
                showToast('error', json.message || 'An unknown error occurred.');
            }
        } catch (err) {
            showToast('error', 'Failed to submit data');
        }
    });

    loadIncomes();
});

function showToast(type, message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 5000);
}
