document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('income-form');
    const tableBody = document.querySelector('#income-table tbody');
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');

    let editingId = null;
    let deleteId = null;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const defaultMonthOption = document.createElement('option');
    defaultMonthOption.value = '';
    defaultMonthOption.textContent = '-- Select Month --';
    defaultMonthOption.selected = true;
    defaultMonthOption.disabled = true;
    monthSelect.appendChild(defaultMonthOption);

    monthNames.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    const currentYear = new Date().getFullYear();
    const defaultYearOption = document.createElement('option');
    defaultYearOption.value = '';
    defaultYearOption.textContent = '-- Select Year --';
    defaultYearOption.selected = true;
    defaultYearOption.disabled = true;
    yearSelect.appendChild(defaultYearOption);

    for (let year = currentYear + 2; year >= currentYear - 10; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    async function loadIncomes() {
        tableBody.innerHTML = '';
        try {
            const res = await fetch(API.incomes);
            const {data} = await res.json();
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
        const res = await fetch(API.income(deleteId), {method: 'DELETE'});
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
                headers: {'Content-Type': 'application/json'},
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

    loadIncomes();
});
