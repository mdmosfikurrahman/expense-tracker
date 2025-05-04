package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;

    private Map<String, BigDecimal> categorySummary;
    private List<MonthlySummaryItem> monthlySummary;
}
