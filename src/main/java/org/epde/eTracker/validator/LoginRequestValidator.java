package org.epde.eTracker.validator;

import org.epde.eTracker.dto.request.LoginRequest;
import org.epde.eTracker.exceptions.ValidationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

@Component
public class LoginRequestValidator {
    public void validate(LoginRequest request) {
        Map<String, String> errors = new HashMap<>();

        if (request == null) {
            errors.put("request", "Login request must not be null");
        } else {
            if (!StringUtils.hasText(request.getEmail())) errors.put("email", "Email is required");
            if (!StringUtils.hasText(request.getPassword())) errors.put("password", "Password is required");
        }

        if (!errors.isEmpty()) throw new ValidationException(errors);
    }
}