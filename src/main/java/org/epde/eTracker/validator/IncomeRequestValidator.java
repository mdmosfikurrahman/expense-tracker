package org.epde.eTracker.validator;

import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.exceptions.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@Component
public class IncomeRequestValidator {

    public void validate(IncomeRequest request) {
        Map<String, String> errors = new HashMap<>();

        if (request == null) {
            errors.put("request", "Income request must not be null");
        } else {
            if (!StringUtils.hasText(request.getSource())) {
                errors.put("source", "Source must not be empty");
            }

            if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
                errors.put("amount", "Amount must be greater than 0");
            }

            if (!StringUtils.hasText(request.getMonth())) {
                errors.put("month", "Month must not be empty");
            } else {
                try {
                    YearMonth.parse(request.getMonth());
                } catch (Exception e) {
                    errors.put("month", "Invalid month format. Expected format is YYYY-MM");
                }
            }
        }

        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
    }
}
