package org.epde.eTracker.repository;

import org.epde.eTracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("SELECT SUM(e.amount) FROM Expense e")
    Optional<BigDecimal> findTotalExpense();

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.month = :month")
    Optional<BigDecimal> findTotalExpenseByMonth(@Param("month") YearMonth month);

}
