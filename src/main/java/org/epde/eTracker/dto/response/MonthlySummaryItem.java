package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class MonthlySummaryItem {
    private String month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
}
