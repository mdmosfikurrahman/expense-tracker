package org.epde.eTracker.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.response.DashboardResponse;
import org.epde.eTracker.service.DashboardService;
import org.epde.eTracker.util.SessionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardRestController {

    private final DashboardService dashboardService;

    @GetMapping
    public RestResponse<DashboardResponse> getDashboardSummary(@RequestParam(required = false) String month,
                                                               HttpSession session) {
        return SessionUtils.requireAuth(session)
                .map(auth -> {
                    DashboardResponse response = dashboardService.getDashboardSummary(month, auth.getId());
                    return RestResponse.success(HttpStatus.OK.value(), "Dashboard summary fetched successfully", response);
                })
                .orElseGet(SessionUtils::unauthorizedResponse);
    }
}
