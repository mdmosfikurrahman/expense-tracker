package org.epde.eTracker.service;

import org.epde.eTracker.dto.response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboardSummary(String month, Long userId);
}
