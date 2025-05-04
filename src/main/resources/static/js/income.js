document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('income-form');
    const tableBody = document.querySelector('#income-table tbody');
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');

    let editingId = null;
    let deleteId = null;

    flatpickr("#month", {
        plugins: [
            new monthSelectPlugin({
                shorthand: false,
                dateFormat: "F, Y",
                altFormat: "F, Y",
                theme: "light"
            })
        ]
    });

    const loadIncomes = async () => {
        tableBody.innerHTML = '';

        try {
            const res = await fetch('/incomes');
            const json = await res.json();

            if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
                json.data.forEach(income => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${income.source}</td>
                        <td>${income.amount}</td>
                        <td>${income.month}</td>
                        <td>
                            <button class="action-btn edit" data-id="${income.id}">✏️</button>
                            <button class="action-btn delete" data-id="${income.id}">🗑️</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                attachRowActions();
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="4" style="text-align: center; color: #888;">No data found</td>`;
                tableBody.appendChild(row);
            }
        } catch (err) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align: center; color: #888;">Failed to load income data</td>`;
            tableBody.appendChild(row);
        }
    };

    const attachRowActions = () => {
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const res = await fetch(`/incomes/${id}`);
                const json = await res.json();
                if (res.ok) {
                    document.getElementById('source').value = json.data.source;
                    document.getElementById('amount').value = json.data.amount;
                    document.getElementById('month')._flatpickr.setDate(json.data.month);
                    editingId = id;
                    showToast('info', 'Edit mode enabled');
                } else {
                    showToast('error', 'Failed to load income record');
                }
            });
        });

        document.querySelectorAll('.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteId = btn.getAttribute('data-id');
                modal.classList.remove('hidden');
            });
        });
    };

    confirmBtn.addEventListener('click', async () => {
        if (!deleteId) return;
        const res = await fetch(`/incomes/${deleteId}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('success', 'Income deleted successfully');
            await loadIncomes();
        } else {
            showToast('error', 'Failed to delete income');
        }
        modal.classList.add('hidden');
        deleteId = null;
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        deleteId = null;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        ['source', 'amount', 'month'].forEach(field => {
            const input = document.getElementById(field);
            input.classList.remove('error');
        });

        const source = document.getElementById('source').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const month = document.getElementById('month').value.trim();

        const payload = { source, amount, month };

        try {
            let res;
            if (editingId) {
                res = await fetch(`/incomes/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/incomes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const json = await res.json();

            if (res.ok) {
                form.reset();
                editingId = null;
                showToast('success', `Income ${res.status === 201 ? 'saved' : 'updated'} successfully!`);
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
