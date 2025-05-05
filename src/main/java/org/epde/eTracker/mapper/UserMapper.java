package org.epde.eTracker.mapper;

import org.epde.eTracker.dto.request.RegisterRequest;
import org.epde.eTracker.dto.response.AuthResponse;
import org.epde.eTracker.model.User;

public class UserMapper {
    public static User toEntity(RegisterRequest request, String encryptedPassword) {
        return User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(encryptedPassword)
                .build();
    }

    public static AuthResponse toResponse(User user) {
        return AuthResponse.builder()
                .id(user.getId())
                .fullName(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .build();
    }
}