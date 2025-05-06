document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const form = document.getElementById('filter-form');
    const clearBtn = document.getElementById('clear-filter');

    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');

    populateMonthYearDropdown(monthSelect, yearSelect);

    async function loadDashboard(monthYear = '') {
        const url = API.dashboard(monthYear);
        incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = 'Loading...';

        try {
            const res = await fetch(url);
            const { data, message } = await res.json();

            if (res.ok && data) {
                incomeEl.textContent = data.totalIncome;
                expenseEl.textContent = data.totalExpense;
                balanceEl.textContent = data.balance;
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

        const selectedMonth = monthSelect.value;
        const selectedYear = yearSelect.value;
        const monthYear = selectedMonth && selectedYear ? `${selectedMonth}, ${selectedYear}` : '';

        loadDashboard(monthYear);
    });

    clearBtn.addEventListener('click', () => {
        monthSelect.value = '';
        yearSelect.value = '';
        loadDashboard();
    });

    loadDashboard();
});
