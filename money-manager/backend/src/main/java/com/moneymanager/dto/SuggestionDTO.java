package com.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionDTO {
    private List<SpendingSuggestion> spendingSuggestions;
    private List<InvestmentSuggestion> investmentSuggestions;
    private List<GoalSuggestion> goalSuggestions;
    private List<BudgetOptimization> budgetOptimizations;
    private FinancialTip dailyTip;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpendingSuggestion {
        private String category;
        private String title;
        private String description;
        private BigDecimal currentSpending;
        private BigDecimal suggestedLimit;
        private BigDecimal potentialSavings;
        private String priority;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvestmentSuggestion {
        private String type;
        private String title;
        private String description;
        private BigDecimal suggestedAmount;
        private double expectedReturn;
        private String riskLevel;
        private String timeHorizon;
        private List<String> options;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoalSuggestion {
        private String goalId;
        private String title;
        private String description;
        private BigDecimal suggestedMonthlySaving;
        private int monthsToAchieve;
        private boolean achievable;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BudgetOptimization {
        private String category;
        private String recommendation;
        private BigDecimal currentBudget;
        private BigDecimal suggestedBudget;
        private String reason;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FinancialTip {
        private String title;
        private String content;
        private String category;
    }
}
