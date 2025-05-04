package org.epde.eTracker.controller;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.request.ExpenseRequest;
import org.epde.eTracker.dto.response.ExpenseResponse;
import org.epde.eTracker.service.ExpenseService;
import org.epde.eTracker.validator.ExpenseRequestValidator;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseRestController {

    private final ExpenseService expenseService;
    private final ExpenseRequestValidator validator;

    @PostMapping
    public RestResponse<ExpenseResponse> create(@RequestBody ExpenseRequest request) {
        validator.validate(request);
        return RestResponse.success(HttpStatus.CREATED.value(), "Expense created successfully", expenseService.createExpense(request));
    }

    @GetMapping
    public RestResponse<List<ExpenseResponse>> getAll() {
        return RestResponse.success(HttpStatus.OK.value(), "All expenses fetched successfully", expenseService.getAllExpenses());
    }

    @GetMapping("/{id}")
    public RestResponse<ExpenseResponse> getById(@PathVariable Long id) {
        return RestResponse.success(HttpStatus.OK.value(), "Expense fetched successfully", expenseService.getExpenseById(id));
    }

    @PutMapping("/{id}")
    public RestResponse<ExpenseResponse> update(@PathVariable Long id, @RequestBody ExpenseRequest request) {
        validator.validate(request);
        return RestResponse.success(HttpStatus.OK.value(), "Expense updated successfully", expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public RestResponse<Void> delete(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return RestResponse.success(HttpStatus.NO_CONTENT.value(), "Expense deleted successfully", null);
    }
}
