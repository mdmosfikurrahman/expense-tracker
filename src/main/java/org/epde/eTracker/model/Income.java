package org.epde.eTracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.YearMonth;

@Data
@Builder
@Entity
@Table(name = "incomes")
@NoArgsConstructor
@AllArgsConstructor
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;

    private BigDecimal amount;

    private YearMonth month;

    @Column(nullable = false)
    private Long userId;

}
