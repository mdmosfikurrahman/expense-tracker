package org.epde.eTracker.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.request.LoginRequest;
import org.epde.eTracker.dto.request.RegisterRequest;
import org.epde.eTracker.dto.response.AuthResponse;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthRestController {
    private final AuthService authService;

    @PostMapping("/register")
    public RestResponse<AuthResponse> register(@RequestBody RegisterRequest request) {
        return RestResponse.success(HttpStatus.CREATED.value(), "Registered successfully", authService.register(request));
    }

    @PostMapping("/login")
    public RestResponse<AuthResponse> login(@RequestBody LoginRequest request, HttpSession session) {
        AuthResponse authResponse = authService.login(request);

        session.setAttribute("loggedInUser", authResponse.getUser());

        return RestResponse.success(HttpStatus.OK.value(), "Login successful", authResponse);
    }


    @PostMapping("/logout")
    public RestResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return RestResponse.success(HttpStatus.OK.value(), "Logged out successfully", null);
    }
}