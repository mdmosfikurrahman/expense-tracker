package org.epde.eTracker.service.impl;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.request.LoginRequest;
import org.epde.eTracker.dto.request.RegisterRequest;
import org.epde.eTracker.dto.response.AuthResponse;
import org.epde.eTracker.exceptions.NotFoundException;
import org.epde.eTracker.mapper.UserMapper;
import org.epde.eTracker.model.User;
import org.epde.eTracker.repository.UserRepository;
import org.epde.eTracker.service.AuthService;
import org.epde.eTracker.validator.LoginRequestValidator;
import org.epde.eTracker.validator.RegisterRequestValidator;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RegisterRequestValidator registerValidator;
    private final LoginRequestValidator loginValidator;

    @Override
    public AuthResponse register(RegisterRequest request) {
        registerValidator.validate(request);
        String encrypted = encrypt(request.getPassword());
        User user = userRepository.save(UserMapper.toEntity(request, encrypted));
        return UserMapper.toResponse(user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        loginValidator.validate(request);
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (!Objects.equals(user.getPassword(), encrypt(request.getPassword()))) {
            throw new NotFoundException("Invalid credentials");
        }

        return UserMapper.toResponse(user);
    }

    private String encrypt(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) hexString.append(String.format("%02x", b));
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
}