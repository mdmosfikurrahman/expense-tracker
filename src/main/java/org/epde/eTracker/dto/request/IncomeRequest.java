package org.epde.eTracker.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class IncomeRequest {

    private String source;
    private BigDecimal amount;
    private String month;

}
