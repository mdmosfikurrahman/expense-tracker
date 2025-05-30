package org.epde.eTracker.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IncomeResponse {

    private Long id;
    private String source;
    private String amount;
    private String month;

}
