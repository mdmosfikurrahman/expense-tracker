package org.epde.eTracker.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseRequest {

    private String category;
    private BigDecimal amount;
    private String month;

}
