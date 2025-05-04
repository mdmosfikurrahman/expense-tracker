package org.epde.eTracker.dto.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseResponse {

    private String category;
    private BigDecimal amount;
    private String month;

}
