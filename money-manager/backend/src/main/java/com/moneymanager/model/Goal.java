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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "goal")
public class Goal {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private String name;
    private String description;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount;
    private LocalDate targetDate;
    
    @Builder.Default
    private Priority priority = Priority.MEDIUM;
    
    @Builder.Default
    private GoalStatus status = GoalStatus.ACTIVE;
    
    private String category;
    private String icon;
    private String color;
    
    @Builder.Default
    private boolean autoAllocate = false;
    
    private BigDecimal monthlyAllocation;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum Priority {
        LOW, MEDIUM, HIGH
    }
    
    public enum GoalStatus {
        ACTIVE, COMPLETED, CANCELLED
    }
    
    public BigDecimal getRemainingAmount() {
        return targetAmount.subtract(currentAmount != null ? currentAmount : BigDecimal.ZERO);
    }
    
    public double getProgressPercentage() {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        BigDecimal current = currentAmount != null ? currentAmount : BigDecimal.ZERO;
        return current.multiply(new BigDecimal("100"))
                .divide(targetAmount, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }
    
    public long getDaysRemaining() {
        if (targetDate == null) return 0;
        return ChronoUnit.DAYS.between(LocalDate.now(), targetDate);
    }
    
    public BigDecimal getSuggestedMonthlySaving() {
        if (targetDate == null) return getRemainingAmount();
        long monthsRemaining = ChronoUnit.MONTHS.between(LocalDate.now(), targetDate);
        if (monthsRemaining <= 0) {
            return getRemainingAmount();
        }
        return getRemainingAmount().divide(new BigDecimal(monthsRemaining), 2, RoundingMode.HALF_UP);
    }
    
    public boolean isOnTrack() {
        if (targetDate == null || targetAmount == null || createdAt == null) return true;
        
        long totalDays = ChronoUnit.DAYS.between(createdAt.toLocalDate(), targetDate);
        long daysPassed = ChronoUnit.DAYS.between(createdAt.toLocalDate(), LocalDate.now());
        
        if (totalDays <= 0) return true;
        
        double expectedProgress = (double) Math.max(0, daysPassed) / totalDays * 100;
        return getProgressPercentage() >= expectedProgress;
    }
}
