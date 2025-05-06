package org.epde.eTracker.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;
import org.epde.eTracker.service.IncomeService;
import org.epde.eTracker.util.SessionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeRestController {

    private final IncomeService incomeService;

    @PostMapping
    public RestResponse<IncomeResponse> createIncome(@RequestBody IncomeRequest request, HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    IncomeResponse response = incomeService.createIncome(request, auth.getId());
                    return RestResponse.success(HttpStatus.CREATED.value(), "Income saved successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @GetMapping
    public RestResponse<List<IncomeResponse>> getAllIncomes(
            @RequestParam(required = false) String month,
            HttpSession session
    ) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    List<IncomeResponse> incomes;
                    if (month != null && !month.isBlank()) {
                        incomes = incomeService.getIncomesByMonth(auth.getId(), month);
                    } else {
                        incomes = incomeService.getAllIncomes(auth.getId());
                    }
                    return RestResponse.success(HttpStatus.OK.value(), "Incomes fetched successfully", incomes);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @GetMapping("/{id}")
    public RestResponse<IncomeResponse> getIncomeById(@PathVariable Long id, HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    IncomeResponse response = incomeService.getIncomeById(id);
                    return RestResponse.success(HttpStatus.OK.value(), "Income fetched successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @PutMapping("/{id}")
    public RestResponse<IncomeResponse> updateIncome(@PathVariable Long id, @RequestBody IncomeRequest request, HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    IncomeResponse response = incomeService.updateIncome(id, request);
                    return RestResponse.success(HttpStatus.OK.value(), "Income updated successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }

    @DeleteMapping("/{id}")
    public RestResponse<Void> deleteIncome(@PathVariable Long id, HttpSession session) {
        SessionUtils.runIfLoggedIn(session, auth -> incomeService.deleteIncome(id));
        return RestResponse.success(HttpStatus.NO_CONTENT.value(), "Income deleted successfully", null);
    }

}
