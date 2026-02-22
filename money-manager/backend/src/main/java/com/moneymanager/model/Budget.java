package com.moneymanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "budget")
public class Budget {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String category;
    private BigDecimal limitAmount;
    private BigDecimal spentAmount;
    
    @Builder.Default
    private BigDecimal alertThreshold = new BigDecimal("80");
    
    private YearMonth budgetMonth;
    
    @Builder.Default
    private boolean alertSent = false;
    
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public BigDecimal getRemainingAmount() {
        return (limitAmount != null ? limitAmount : BigDecimal.ZERO)
                .subtract(spentAmount != null ? spentAmount : BigDecimal.ZERO);
    }
    
    public BigDecimal getUsagePercentage() {
        if (limitAmount == null || limitAmount.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal spent = spentAmount != null ? spentAmount : BigDecimal.ZERO;
        return spent.multiply(new BigDecimal("100")).divide(limitAmount, 2, RoundingMode.HALF_UP);
    }
    
    public boolean isThresholdExceeded() {
        return getUsagePercentage().compareTo(alertThreshold) >= 0;
    }
    
    public boolean isOverBudget() {
        return spentAmount != null && spentAmount.compareTo(limitAmount) > 0;
    }
}
