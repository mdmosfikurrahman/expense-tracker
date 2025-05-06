package org.epde.eTracker.service;

import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;

import java.util.List;

public interface IncomeService {

    IncomeResponse createIncome(IncomeRequest request, Long userId);

    List<IncomeResponse> getAllIncomes(Long userId);

    IncomeResponse getIncomeById(Long id);

    IncomeResponse updateIncome(Long id, IncomeRequest request);

    void deleteIncome(Long id);

    List<IncomeResponse> getIncomesByMonth(Long userId, String month);

}

