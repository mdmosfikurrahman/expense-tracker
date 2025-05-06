package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {

    private String totalIncome;
    private String totalExpense;
    private String balance;

}
