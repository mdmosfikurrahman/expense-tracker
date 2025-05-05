document.addEventListener('DOMContentLoaded', () => {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const form = document.getElementById('filter-form');
    const clearBtn = document.getElementById('clear-filter');

    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');

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
    const startYear = currentYear - 10;
    const endYear = currentYear + 2;

    const defaultYearOption = document.createElement('option');
    defaultYearOption.value = '';
    defaultYearOption.textContent = '-- Select Year --';
    defaultYearOption.selected = true;
    defaultYearOption.disabled = true;
    yearSelect.appendChild(defaultYearOption);

    for (let year = endYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    async function loadDashboard(monthYear = '') {
        const url = API.dashboard(monthYear);
        incomeEl.textContent = expenseEl.textContent = balanceEl.textContent = 'Loading...';

        try {
            const res = await fetch(url);
            const {data, message} = await res.json();

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
