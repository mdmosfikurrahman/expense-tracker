document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const tableBody = document.querySelector('#expense-table tbody');
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');

    let editingId = null;
    let deleteId = null;

    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    monthSelect.appendChild(new Option('-- Select Month --', '', true, true));
    monthSelect.firstChild.disabled = true;

    monthNames.forEach(month => {
        monthSelect.appendChild(new Option(month, month));
    });

    const currentYear = new Date().getFullYear();
    yearSelect.appendChild(new Option('-- Select Year --', '', true, true));
    yearSelect.firstChild.disabled = true;

    for (let year = currentYear + 2; year >= currentYear - 10; year--) {
        yearSelect.appendChild(new Option(year, year));
    }

    async function loadExpenses() {
        tableBody.innerHTML = '';
        try {
            const res = await fetch(API.expenses);
            const { data } = await res.json();
            if (Array.isArray(data) && data.length) {
                data.forEach(exp => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${exp.category}</td>
                        <td>${exp.amount}</td>
                        <td>${exp.month}</td>
                        <td>
                            <button class="action-btn edit" data-id="${exp.id}">✏️</button>
                            <button class="action-btn delete" data-id="${exp.id}">🗑️</button>
                        </td>`;
                    tableBody.appendChild(row);
                });
                attachRowActions();
            } else {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">No data found</td></tr>`;
            }
        } catch {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Failed to load expenses</td></tr>`;
        }
    }

    function attachRowActions() {
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const res = await fetch(API.expense(id));
                const json = await res.json();
                if (res.ok) {
                    form.category.value = json.data.category;
                    form.amount.value = json.data.amount;
                    form.month._flatpickr.setDate(json.data.month);
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
    }

    confirmBtn.addEventListener('click', async () => {
        if (!deleteId) return;
        const res = await fetch(API.expense(deleteId), { method: 'DELETE' });
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
        resetFields(['category', 'amount', 'month-select', 'year-select']);

        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;

        if (!selectedMonth || !selectedYear) {
            showToast('error', 'Please select both month and year');
            return;
        }

        const payload = {
            category: form.category.value.trim(),
            amount: parseFloat(form.amount.value),
            month: `${selectedMonth}, ${selectedYear}`
        };

        try {
            const res = await fetch(editingId ? API.expense(editingId) : API.expenses, {
                method: editingId ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (res.ok) {
                form.reset();
                monthSelect.value = '';
                yearSelect.value = '';
                editingId = null;
                showToast('success', json.status === 201 ? 'Saved!' : 'Updated!');
                await loadExpenses();
            } else if (typeof json.error === 'object' && !Array.isArray(json.error)) {
                const errors = Object.entries(json.error).map(([field, message]) => ({ field, message }));
                handleErrors(errors);
            } else {
                showToast('error', json.message || 'Unknown error');
            }
        } catch {
            showToast('error', 'Failed to submit data');
        }
    });

    loadExpenses();
});
