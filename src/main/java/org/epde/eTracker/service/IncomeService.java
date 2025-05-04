package org.epde.eTracker.service;

import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;

import java.util.List;

public interface IncomeService {

    IncomeResponse createIncome(IncomeRequest request);

    List<IncomeResponse> getAllIncomes();

    IncomeResponse getIncomeById(Long id);

    IncomeResponse updateIncome(Long id, IncomeRequest request);

    void deleteIncome(Long id);
}

