document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('income-form');
    const tableBody = document.querySelector('#income-table tbody');
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');

    let editingId = null;
    let deleteId = null;

    flatpickr("#month", {
        plugins: [new monthSelectPlugin({shorthand: false, dateFormat: "F, Y", altFormat: "F, Y", theme: "light"})]
    });

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
                    form.month._flatpickr.setDate(json.data.month);
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
        resetFields(['source', 'amount', 'month']);

        const payload = {
            source: form.source.value.trim(),
            amount: parseFloat(form.amount.value),
            month: form.month.value.trim()
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
                editingId = null;
                showToast('success', res.status === 201 ? 'Saved!' : 'Updated!');
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
