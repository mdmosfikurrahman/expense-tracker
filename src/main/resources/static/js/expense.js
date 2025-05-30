// expense.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const tableBody = document.querySelector('#expense-table tbody');
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');

    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    const filterForm = document.getElementById('expense-filter-form');
    const filterMonth = document.getElementById('filter-month');
    const filterYear = document.getElementById('filter-year');
    const clearFilterBtn = document.getElementById('clear-expense-filter');

    let editingId = null;
    let deleteId = null;

    populateMonthYearDropdown(monthSelect, yearSelect);
    populateMonthYearDropdown(filterMonth, filterYear);

    async function loadExpenses(monthYear = '') {
        tableBody.innerHTML = '';
        let url = API.expenses;
        if (monthYear) {
            url += `?month=${encodeURIComponent(monthYear)}`;
        }

        try {
            const res = await fetch(url);
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
                    const [editMonth, editYear] = json.data.month.split(',').map(s => s.trim());
                    monthSelect.value = editMonth;
                    yearSelect.value = editYear;
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

    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const m = filterMonth.value;
        const y = filterYear.value;

        if (!m || !y) {
            showToast('error', 'Please select both month and year to filter.');
            return;
        }

        const monthYear = `${m}, ${y}`;
        loadExpenses(monthYear);
    });

    clearFilterBtn.addEventListener('click', () => {
        filterMonth.value = '';
        filterYear.value = '';
        loadExpenses();
    });

    loadExpenses();

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

});
