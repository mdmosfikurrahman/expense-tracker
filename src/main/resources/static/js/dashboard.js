document.addEventListener('DOMContentLoaded', () => {
    const monthInput = document.getElementById('month');
    const form = document.getElementById('filter-form');
    const clearBtn = document.getElementById('clear-filter');

    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');

    flatpickr(monthInput, {
        plugins: [new monthSelectPlugin({
            shorthand: false,
            dateFormat: "F, Y",
            altFormat: "F, Y",
            theme: "light"
        })]
    });

    async function loadDashboard(month = '') {
        const url = API.dashboard(month);
        incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = 'Loading...';

        try {
            const res = await fetch(url);
            const { data, message } = await res.json();

            if (res.ok && data) {
                incomeEl.textContent = data.totalIncome.toFixed(2);
                expenseEl.textContent = data.totalExpense.toFixed(2);
                balanceEl.textContent = data.balance.toFixed(2);
            } else {
                incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = '—';
                showToast('error', message || 'Failed to fetch summary.');
            }
        } catch {
            incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = '—';
            showToast('error', 'Network error while fetching dashboard data');
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        loadDashboard(monthInput.value.trim());
    });

    clearBtn.addEventListener('click', () => {
        monthInput.value = '';
        loadDashboard();
    });

    loadDashboard();
});
