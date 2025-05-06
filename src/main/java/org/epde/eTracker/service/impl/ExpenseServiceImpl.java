package org.epde.eTracker.service.impl;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.request.ExpenseRequest;
import org.epde.eTracker.dto.response.ExpenseResponse;
import org.epde.eTracker.exceptions.NotFoundException;
import org.epde.eTracker.mapper.ExpenseMapper;
import org.epde.eTracker.model.Expense;
import org.epde.eTracker.repository.ExpenseRepository;
import org.epde.eTracker.service.ExpenseService;
import org.epde.eTracker.validator.ExpenseRequestValidator;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseRequestValidator validator;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    @Override
    public ExpenseResponse createExpense(ExpenseRequest request, Long userId) {
        validator.validate(request);
        Expense saved = expenseRepository.save(ExpenseMapper.toEntity(request, userId));
        return ExpenseMapper.toResponse(saved);
    }

    @Override
    public List<ExpenseResponse> getAllExpenses(Long userId) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        if (expenses.isEmpty()) {
            throw new NotFoundException("No expense records found.");
        }
        return expenses.stream().map(ExpenseMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found with ID: " + id));
        return ExpenseMapper.toResponse(expense);
    }

    @Override
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        validator.validate(request);
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Expense not found with ID: " + id));
        ExpenseMapper.updateEntity(existing, request);
        return ExpenseMapper.toResponse(expenseRepository.save(existing));
    }

    @Override
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new NotFoundException("Expense not found with ID: " + id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public List<ExpenseResponse> getExpensesByMonth(Long userId, String month) {
        YearMonth yearMonth = YearMonth.parse(month, FORMATTER);
        List<Expense> expenses = expenseRepository.findByUserIdAndMonth(userId, yearMonth);

        if (expenses.isEmpty()) {
            throw new NotFoundException("No expenses found for " + month);
        }

        return expenses.stream()
                .map(ExpenseMapper::toResponse)
                .collect(Collectors.toList());
    }


}
