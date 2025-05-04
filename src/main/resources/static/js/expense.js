document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const tableBody = document.querySelector('#expense-table tbody');
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

    const loadExpenses = async () => {
        tableBody.innerHTML = '';
        try {
            const res = await fetch('/expenses');
            const json = await res.json();

            if (res.ok && Array.isArray(json.data) && json.data.length > 0) {
                json.data.forEach(exp => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${exp.category}</td>
                        <td>${exp.amount}</td>
                        <td>${exp.month}</td>
                        <td>
                            <button class="action-btn edit" data-id="${exp.id}">✏️</button>
                            <button class="action-btn delete" data-id="${exp.id}">🗑️</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                attachRowActions();
            } else {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">No data found</td></tr>`;
            }
        } catch (err) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Failed to load expenses</td></tr>`;
        }
    };

    const attachRowActions = () => {
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const res = await fetch(`/expenses/${id}`);
                const json = await res.json();
                if (res.ok) {
                    document.getElementById('category').value = json.data.category;
                    document.getElementById('amount').value = json.data.amount;
                    document.getElementById('month')._flatpickr.setDate(json.data.month);
                    editingId = id;
                    showToast('info', 'Edit mode enabled');
                } else {
                    showToast('error', 'Failed to load expense record');
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
        const res = await fetch(`/expenses/${deleteId}`, {method: 'DELETE'});
        if (res.ok) {
            showToast('success', 'Expense deleted successfully');
            await loadExpenses();
        } else {
            showToast('error', 'Failed to delete expense');
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

        ['category', 'amount', 'month'].forEach(field => {
            document.getElementById(field).classList.remove('error');
        });

        const category = document.getElementById('category').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const month = document.getElementById('month').value.trim();
        const payload = {category, amount, month};

        try {
            let res;
            if (editingId) {
                res = await fetch(`/expenses/${editingId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/expenses', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(payload)
                });
            }

            const json = await res.json();
            if (res.ok) {
                form.reset();
                editingId = null;
                showToast('success', `Expense ${res.status === 201 ? 'saved' : 'updated'} successfully!`);
                await loadExpenses();
            } else if (json.error && typeof json.error === 'object') {
                Object.entries(json.error).forEach(([field, message]) => {
                    const input = document.getElementById(field);
                    if (input) input.classList.add('error');
                    showToast('error', `${field}: ${message}`);
                });
            } else {
                showToast('error', json.message || 'An unknown error occurred.');
            }
        } catch (err) {
            showToast('error', 'Failed to submit data');
        }
    });

    loadExpenses();
});