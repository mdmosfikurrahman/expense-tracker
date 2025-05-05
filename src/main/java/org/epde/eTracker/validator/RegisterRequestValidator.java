package org.epde.eTracker.validator;

import org.epde.eTracker.dto.request.RegisterRequest;
import org.epde.eTracker.exceptions.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Component
public class RegisterRequestValidator {
    public void validate(RegisterRequest request) {
        Map<String, String> errors = new HashMap<>();

        if (request == null) {
            errors.put("request", "Register request must not be null");
        } else {
            if (!StringUtils.hasText(request.getFirstName())) errors.put("firstName", "First name is required");
            if (!StringUtils.hasText(request.getLastName())) errors.put("lastName", "Last name is required");
            if (!StringUtils.hasText(request.getEmail())) errors.put("email", "Email is required");
            if (!StringUtils.hasText(request.getPassword())) errors.put("password", "Password is required");
        }

        if (!errors.isEmpty()) throw new ValidationException(errors);
    }
}