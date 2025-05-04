document.addEventListener('DOMContentLoaded', () => {
    const monthInput = document.getElementById('month');
    const form = document.getElementById('filter-form');
    const clearBtn = document.getElementById('clear-filter');

    flatpickr(monthInput, {
        plugins: [new monthSelectPlugin({
            shorthand: false,
            dateFormat: "F, Y",
            altFormat: "F, Y",
            theme: "light"
        })]
    });

    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');

    const loadDashboard = async (month = '') => {
        let url = '/dashboard';
        if (month) {
            url += `?month=${encodeURIComponent(month)}`;
        }

        incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = 'Loading...';

        try {
            const res = await fetch(url);
            const json = await res.json();

            if (res.ok && json.data) {
                incomeEl.textContent = json.data.totalIncome.toFixed(2);
                expenseEl.textContent = json.data.totalExpense.toFixed(2);
                balanceEl.textContent = json.data.balance.toFixed(2);
            } else {
                incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = '—';
                showToast('error', json.message || 'Failed to fetch summary.');
            }
        } catch (err) {
            incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = '—';
            showToast('error', 'Network error while fetching dashboard data');
        }
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        const month = monthInput.value.trim();
        loadDashboard(month);
    });

    clearBtn.addEventListener('click', () => {
        monthInput.value = '';
        loadDashboard();
    });

    loadDashboard();
});
