package org.epde.eTracker.validator;

import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.exceptions.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Component
public class IncomeRequestValidator {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    public void validate(IncomeRequest request) {
        Map<String, String> errors = new HashMap<>();

        if (request == null) {
            errors.put("request", "Income request must not be null");
        } else {
            validateSource(request.getSource(), errors);
            validateAmount(request.getAmount(), errors);
            validateMonth(request.getMonth(), errors);
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }

    private void validateSource(String source, Map<String, String> errors) {
        if (!StringUtils.hasText(source)) {
            errors.put("source", "Source must not be empty");
        }
    }

    private void validateAmount(BigDecimal amount, Map<String, String> errors) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            errors.put("amount", "Amount must be greater than 0");
        }
    }

    private void validateMonth(String month, Map<String, String> errors) {
        if (!StringUtils.hasText(month)) {
            errors.put("month", "Month must not be empty");
        } else {
            try {
                YearMonth.parse(month, FORMATTER);
            } catch (Exception e) {
                errors.put("month", "Invalid month format. Expected format is 'MMMM, yyyy' (e.g., 'January, 2025')");
            }
        }
    }
}
