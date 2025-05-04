package org.epde.eTracker.validator;

import org.epde.eTracker.dto.request.ExpenseRequest;
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
public class ExpenseRequestValidator {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMMM, yyyy", Locale.ENGLISH);

    public void validate(ExpenseRequest request) {
        Map<String, String> errors = new HashMap<>();

        if (request == null) {
            errors.put("request", "Expense request must not be null");
        } else {
            if (!StringUtils.hasText(request.getCategory())) {
                errors.put("category", "Category must not be empty");
            }

            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                errors.put("amount", "Amount must be greater than 0");
            }

            try {
                YearMonth.parse(request.getMonth(), FORMATTER);
            } catch (Exception e) {
                errors.put("month", "Invalid month format. Expected format is 'MMMM, yyyy'");
            }
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }
}
