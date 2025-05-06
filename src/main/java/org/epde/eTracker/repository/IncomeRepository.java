package org.epde.eTracker.repository;

import org.epde.eTracker.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.userId = :userId")
    Optional<BigDecimal> findTotalIncomeByUserId(Long userId);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.month = :month AND i.userId = :userId")
    Optional<BigDecimal> findTotalIncomeByMonthAndUserId(@Param("month") YearMonth month, Long userId);

    List<Income> findByUserId(Long userId);

    List<Income> findByUserIdAndMonth(Long userId, YearMonth month);
}
