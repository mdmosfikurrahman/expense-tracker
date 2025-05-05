package org.epde.eTracker.service;

import org.epde.eTracker.dto.request.RegisterRequest;
import org.epde.eTracker.dto.request.LoginRequest;
import org.epde.eTracker.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}