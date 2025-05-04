package org.epde.eTracker.mapper;

import org.epde.eTracker.dto.request.ExpenseRequest;
import org.epde.eTracker.dto.response.ExpenseResponse;
import org.epde.eTracker.model.Expense;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class ExpenseMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    public static Expense toEntity(ExpenseRequest request) {
        return Expense.builder()
                .category(request.getCategory())
                .amount(request.getAmount())
                .month(YearMonth.parse(request.getMonth(), FORMATTER))
                .build();
    }

    public static ExpenseResponse toResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .category(expense.getCategory())
                .amount(expense.getAmount())
                .month(expense.getMonth().format(FORMATTER))
                .build();
    }

    public static void updateEntity(Expense expense, ExpenseRequest request) {
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setMonth(YearMonth.parse(request.getMonth(), FORMATTER));
    }
}
