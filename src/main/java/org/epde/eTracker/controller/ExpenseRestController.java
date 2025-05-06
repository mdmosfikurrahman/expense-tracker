package org.epde.eTracker.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.request.ExpenseRequest;
import org.epde.eTracker.dto.response.ExpenseResponse;
import org.epde.eTracker.service.ExpenseService;
import org.epde.eTracker.util.SessionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseRestController {

    private final ExpenseService expenseService;

    @PostMapping
    public RestResponse<ExpenseResponse> create(@RequestBody ExpenseRequest request, HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    ExpenseResponse response = expenseService.createExpense(request, auth.getId());
                    return RestResponse.success(HttpStatus.CREATED.value(), "Expense created successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @GetMapping
    public RestResponse<List<ExpenseResponse>> getAllExpenses(
            @RequestParam(required = false) String month,
            HttpSession session
    ) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    List<ExpenseResponse> expenses = (month != null && !month.isBlank())
                            ? expenseService.getExpensesByMonth(auth.getId(), month)
                            : expenseService.getAllExpenses(auth.getId());
                    return RestResponse.success(HttpStatus.OK.value(), "Expenses fetched successfully", expenses);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @GetMapping("/{id}")
    public RestResponse<ExpenseResponse> getById(@PathVariable Long id, HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    ExpenseResponse response = expenseService.getExpenseById(id);
                    return RestResponse.success(HttpStatus.OK.value(), "Expense fetched successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @PutMapping("/{id}")
    public RestResponse<ExpenseResponse> update(@PathVariable Long id, @RequestBody ExpenseRequest request, HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    ExpenseResponse response = expenseService.updateExpense(id, request);
                    return RestResponse.success(HttpStatus.OK.value(), "Expense updated successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @DeleteMapping("/{id}")
    public RestResponse<Void> delete(@PathVariable Long id, HttpSession session) {
        SessionUtils.runIfLoggedIn(session, auth -> expenseService.deleteExpense(id));
        return RestResponse.success(HttpStatus.NO_CONTENT.value(), "Expense deleted successfully", null);
    }
}
