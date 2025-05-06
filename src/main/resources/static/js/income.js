// income.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('income-form');
    const tableBody = document.querySelector('#income-table tbody');
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    const filterForm = document.getElementById('income-filter-form');
    const filterMonth = document.getElementById('filter-month');
    const filterYear = document.getElementById('filter-year');
    const clearFilterBtn = document.getElementById('clear-income-filter');

    let editingId = null;
    let deleteId = null;

    populateMonthYearDropdown(monthSelect, yearSelect);
    populateMonthYearDropdown(filterMonth, filterYear);

    async function loadIncomes(filterMonthYear = '') {
        tableBody.innerHTML = '';
        let url = API.incomes;
        if (filterMonthYear) {
            url += `?month=${encodeURIComponent(filterMonthYear)}`;
        }

        try {
            const res = await fetch(url);
            const { data } = await res.json();
            if (Array.isArray(data) && data.length) {
                data.forEach(income => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${income.source}</td>
                        <td>${income.amount}</td>
                        <td>${income.month}</td>
                        <td>
                            <button class="action-btn edit" data-id="${income.id}">✏️</button>
                            <button class="action-btn delete" data-id="${income.id}">🗑️</button>
                        </td>`;
                    tableBody.appendChild(row);
                });
                attachRowActions();
            } else {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">No data found</td></tr>`;
            }
        } catch {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888;">Failed to load income data</td></tr>`;
        }
    }

    function attachRowActions() {
        document.querySelectorAll('.edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const res = await fetch(API.income(id));
                const json = await res.json();
                if (res.ok) {
                    form.source.value = json.data.source;
                    form.amount.value = json.data.amount;
                    const [editMonth, editYear] = json.data.month.split(',').map(s => s.trim());
                    monthSelect.value = editMonth;
                    yearSelect.value = editYear;
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
    }

    confirmBtn.addEventListener('click', async () => {
        if (!deleteId) return;
        const res = await fetch(API.income(deleteId), { method: 'DELETE' });
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
        resetFields(['source', 'amount', 'month-select', 'year-select']);

        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;

        if (!selectedMonth || !selectedYear) {
            showToast('error', 'Please select both month and year');
            return;
        }

        const monthFormatted = `${selectedMonth}, ${selectedYear}`;

        const payload = {
            source: form.source.value.trim(),
            amount: parseFloat(form.amount.value),
            month: monthFormatted
        };

        try {
            const res = await fetch(editingId ? API.income(editingId) : API.incomes, {
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
                await loadIncomes();
            } else if (Array.isArray(json.error)) {
                handleErrors(json.error);
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
            showToast('error', 'Please select both month and year to apply filter');
            return;
        }
        loadIncomes(`${m}, ${y}`);
    });

    clearFilterBtn.addEventListener('click', () => {
        filterMonth.value = '';
        filterYear.value = '';
        loadIncomes();
    });

    loadIncomes();

    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    });

});
