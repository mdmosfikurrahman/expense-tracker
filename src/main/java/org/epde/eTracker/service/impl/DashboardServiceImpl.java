package org.epde.eTracker.service.impl;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.response.DashboardResponse;
import org.epde.eTracker.repository.ExpenseRepository;
import org.epde.eTracker.repository.IncomeRepository;
import org.epde.eTracker.service.DashboardService;
import org.epde.eTracker.util.CurrencyUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    @Override
    public DashboardResponse getDashboardSummary(String month, Long userId) {
        BigDecimal totalIncome;
        BigDecimal totalExpense;

        if (month != null && !month.isBlank()) {
            YearMonth yearMonth = YearMonth.parse(month, FORMATTER);
            totalIncome = incomeRepository.findTotalIncomeByMonthAndUserId(yearMonth, userId).orElse(BigDecimal.ZERO);
            totalExpense = expenseRepository.findTotalExpenseByMonthAndUserId(yearMonth, userId).orElse(BigDecimal.ZERO);
        } else {
            totalIncome = incomeRepository.findTotalIncomeByUserId(userId).orElse(BigDecimal.ZERO);
            totalExpense = expenseRepository.findTotalExpenseByUserId(userId).orElse(BigDecimal.ZERO);
        }

        return DashboardResponse.builder()
                .totalIncome(CurrencyUtil.formatAmount(totalIncome))
                .totalExpense(CurrencyUtil.formatAmount(totalExpense))
                .balance(CurrencyUtil.formatAmount(totalIncome.subtract(totalExpense)))
                .build();
    }
}
