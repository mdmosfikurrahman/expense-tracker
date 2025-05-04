package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class IncomeResponse {

    private String source;
    private BigDecimal amount;
    private String month;

}
