package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private Long id;
    private String fullName;
    private String email;
}
