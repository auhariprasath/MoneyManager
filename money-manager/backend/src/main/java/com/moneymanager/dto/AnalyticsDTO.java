package com.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netSavings;
    private double savingsRate;
    
    private List<CategoryBreakdown> categoryBreakdown;
    private List<MonthlyTrend> monthlyTrends;
    private List<WeeklyTrend> weeklyTrends;
    private List<BudgetStatus> budgetStatus;
    
    private List<StrugglePoint> strugglePoints;
    private List<SpendingInsight> insights;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryBreakdown {
        private String category;
        private BigDecimal amount;
        private double percentage;
        private String type;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTrend {
        private String month;
        private BigDecimal income;
        private BigDecimal expense;
        private BigDecimal savings;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyTrend {
        private String week;
        private BigDecimal income;
        private BigDecimal expense;
        private BigDecimal savings;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetStatus {
        private String category;
        private BigDecimal budgetLimit;
        private BigDecimal spent;
        private BigDecimal remaining;
        double usagePercentage;
        private boolean overBudget;
        private boolean thresholdExceeded;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StrugglePoint {
        private String category;
        private int count;
        private BigDecimal totalAmount;
        private String suggestion;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpendingInsight {
        private String type;
        private String title;
        private String description;
        private BigDecimal potentialSavings;
    }
}
