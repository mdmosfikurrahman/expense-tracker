package org.epde.eTracker.controller;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;
import org.epde.eTracker.service.IncomeService;
import org.epde.eTracker.validator.IncomeRequestValidator;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/incomes")
public class IncomeRestController {

    private final IncomeService incomeService;
    private final IncomeRequestValidator validator;

    @PostMapping
    public RestResponse<IncomeResponse> createIncome(@RequestBody IncomeRequest request) {
        validator.validate(request);
        IncomeResponse response = incomeService.createIncome(request);
        return RestResponse.success(HttpStatus.CREATED.value(), "Income saved successfully", response);
    }

    @GetMapping
    public RestResponse<List<IncomeResponse>> getAllIncomes() {
        List<IncomeResponse> incomes = incomeService.getAllIncomes();
        return RestResponse.success(HttpStatus.OK.value(), "All incomes fetched successfully", incomes);
    }
}
