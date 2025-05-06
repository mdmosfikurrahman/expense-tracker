package org.epde.eTracker.repository;

import org.epde.eTracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.userId = :userId")
    Optional<BigDecimal> findTotalExpenseByUserId(Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.month = :month AND e.userId = :userId")
    Optional<BigDecimal> findTotalExpenseByMonthAndUserId(@Param("month") YearMonth month, Long userId);

    List<Expense> findByUserId(Long userId);

    List<Expense> findByUserIdAndMonth(Long userId, YearMonth yearMonth);
}
