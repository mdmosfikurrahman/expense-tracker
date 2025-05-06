package org.epde.eTracker.util;

import jakarta.servlet.http.HttpSession;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.response.AuthResponse;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.function.Consumer;

public class SessionUtils {

    public static AuthResponse getLoggedInUser(HttpSession session) {
        Object user = session.getAttribute("loggedInUser");
        if (user instanceof AuthResponse) {
            return (AuthResponse) user;
        }
        return null;
    }

    public static Optional<AuthResponse> requireAuth(HttpSession session) {
        AuthResponse auth = getLoggedInUser(session);
        return Optional.ofNullable(auth);
    }

    public static <T> RestResponse<T> unauthorizedResponse() {
        return RestResponse.error(
                HttpStatus.UNAUTHORIZED.value(),
                "Unauthorized access. Please log in.",
                null
        );
    }

    public static void runIfLoggedIn(HttpSession session, Consumer<AuthResponse> action) {
        AuthResponse auth = getLoggedInUser(session);
        if (auth == null) {
            throw new RuntimeException("Unauthorized access");
        }
        action.accept(auth);
    }
}
