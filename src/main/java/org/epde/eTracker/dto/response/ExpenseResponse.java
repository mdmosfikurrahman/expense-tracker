package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ExpenseResponse {

    private Long id;
    private String category;
    private BigDecimal amount;
    private String month;

}
