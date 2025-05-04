package org.epde.eTracker.mapper;

import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;
import org.epde.eTracker.model.Income;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public class IncomeMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    public static Income toEntity(IncomeRequest request) {
        return Income.builder()
                .source(request.getSource())
                .amount(request.getAmount())
                .month(YearMonth.parse(request.getMonth(), FORMATTER))
                .build();
    }

    public static IncomeResponse toResponse(Income income) {
        return IncomeResponse.builder()
                .source(income.getSource())
                .amount(income.getAmount())
                .month(income.getMonth().format(FORMATTER))
                .build();
    }
}
