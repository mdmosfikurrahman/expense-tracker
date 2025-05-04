const API = {
    incomes: '/incomes',
    income: id => `/incomes/${id}`,
    expenses: '/expenses',
    expense: id => `/expenses/${id}`,
    dashboard: month => month ? `/dashboard?month=${encodeURIComponent(month)}` : '/dashboard'
};
