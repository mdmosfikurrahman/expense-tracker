package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;

}
