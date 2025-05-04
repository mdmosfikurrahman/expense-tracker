package org.epde.eTracker.controller;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.common.RestResponse;
import org.epde.eTracker.dto.response.DashboardResponse;
import org.epde.eTracker.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
public class DashboardRestController {

    private final DashboardService dashboardService;

    @GetMapping
    public RestResponse<DashboardResponse> getDashboardSummary(@RequestParam(required = false) String month) {
        DashboardResponse response = dashboardService.getDashboardSummary(month);
        return RestResponse.success(HttpStatus.OK.value(), "Dashboard summary fetched successfully", response);
    }
}
