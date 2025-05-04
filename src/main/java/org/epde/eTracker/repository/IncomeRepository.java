package org.epde.eTracker.repository;

import org.epde.eTracker.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    @Query("SELECT SUM(i.amount) FROM Income i")
    Optional<BigDecimal> findTotalIncome();

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.month = :month")
    Optional<BigDecimal> findTotalIncomeByMonth(@Param("month") YearMonth month);
}
