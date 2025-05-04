package org.epde.eTracker.mapper;

import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;
import org.epde.eTracker.model.Income;

import java.time.YearMonth;

public class IncomeMapper {

    public static Income toEntity(IncomeRequest request) {
        return Income.builder()
                .source(request.getSource())
                .amount(request.getAmount())
                .month(YearMonth.parse(request.getMonth()))
                .build();
    }

    public static IncomeResponse toResponse(Income income) {
        return IncomeResponse.builder()
                .source(income.getSource())
                .amount(income.getAmount())
                .month(income.getMonth().toString())
                .build();
    }
}
