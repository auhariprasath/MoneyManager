package com.moneymanager.dto;

import com.moneymanager.model.Goal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoalRequest {
    @NotBlank(message = "Goal name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Target amount is required")
    @Positive(message = "Target amount must be positive")
    private BigDecimal targetAmount;
    
    @NotNull(message = "Target date is required")
    private LocalDate targetDate;
    
    private Goal.Priority priority;
    private String category;
    private String icon;
    private String color;
    private boolean autoAllocate;
    private BigDecimal monthlyAllocation;
}
