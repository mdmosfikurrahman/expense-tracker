package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExpenseResponse {
    private Long id;
    private String category;
    private String amount;
    private String month;
}

