package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;
import org.epde.eTracker.model.User;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
    private User user;
}
