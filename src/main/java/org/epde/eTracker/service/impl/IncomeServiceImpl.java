package org.epde.eTracker.service.impl;

import lombok.RequiredArgsConstructor;
import org.epde.eTracker.dto.request.IncomeRequest;
import org.epde.eTracker.dto.response.IncomeResponse;
import org.epde.eTracker.exceptions.NotFoundException;
import org.epde.eTracker.mapper.IncomeMapper;
import org.epde.eTracker.model.Income;
import org.epde.eTracker.repository.IncomeRepository;
import org.epde.eTracker.service.IncomeService;
import org.epde.eTracker.validator.IncomeRequestValidator;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;
    private final IncomeRequestValidator incomeRequestValidator;

    @Override
    public IncomeResponse createIncome(IncomeRequest request) {
        incomeRequestValidator.validate(request);

        Income income = IncomeMapper.toEntity(request);
        Income saved = incomeRepository.save(income);

        return IncomeMapper.toResponse(saved);
    }

    @Override
    public List<IncomeResponse> getAllIncomes() {
        List<Income> incomes = incomeRepository.findAll();

        if (incomes.isEmpty()) {
            throw new NotFoundException("No income records found.");
        }

        return incomes.stream()
                .map(IncomeMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public IncomeResponse getIncomeById(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Income not found with ID: " + id));
        return IncomeMapper.toResponse(income);
    }

    @Override
    public IncomeResponse updateIncome(Long id, IncomeRequest request) {
        incomeRequestValidator.validate(request);

        Income existing = incomeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Income not found with ID: " + id));

        IncomeMapper.updateEntity(existing, request);

        Income saved = incomeRepository.save(existing);
        return IncomeMapper.toResponse(saved);
    }

    @Override
    public void deleteIncome(Long id) {
        if (!incomeRepository.existsById(id)) {
            throw new NotFoundException("Income not found with ID: " + id);
        }
        incomeRepository.deleteById(id);
    }

}
