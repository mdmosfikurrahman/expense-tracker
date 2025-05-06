package org.epde.eTracker.service;

import org.epde.eTracker.dto.request.ExpenseRequest;
import org.epde.eTracker.dto.response.ExpenseResponse;

import java.util.List;

public interface ExpenseService {

    ExpenseResponse createExpense(ExpenseRequest request, Long userId);

    List<ExpenseResponse> getAllExpenses(Long userId);

    ExpenseResponse getExpenseById(Long id);

    ExpenseResponse updateExpense(Long id, ExpenseRequest request);

    void deleteExpense(Long id);

    List<ExpenseResponse> getExpensesByMonth(Long userId, String month);

}
