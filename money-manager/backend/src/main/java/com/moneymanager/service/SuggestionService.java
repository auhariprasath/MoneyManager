package com.moneymanager.service;

import com.moneymanager.dto.AnalyticsDTO;
import com.moneymanager.dto.SuggestionDTO;
import com.moneymanager.model.Goal;
import com.moneymanager.model.Transaction;
import com.moneymanager.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private GoalService goalService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserService userService;

    public SuggestionDTO getSuggestions(String userId) {
        SuggestionDTO suggestions = new SuggestionDTO();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(3).withDayOfMonth(1);
        
        // Get analytics
        AnalyticsDTO analytics = analyticsService.getDashboardAnalytics(userId, startDate, endDate);
        
        // Generate spending suggestions
        suggestions.setSpendingSuggestions(generateSpendingSuggestions(userId, analytics));
        
        // Generate investment suggestions
        suggestions.setInvestmentSuggestions(generateInvestmentSuggestions(userId, analytics));
        
        // Generate goal suggestions
        suggestions.setGoalSuggestions(generateGoalSuggestions(userId));
        
        // Generate budget optimizations
        suggestions.setBudgetOptimizations(generateBudgetOptimizations(userId, analytics));
        
        // Daily tip
        suggestions.setDailyTip(generateDailyTip(analytics));
        
        return suggestions;
    }

    private List<SuggestionDTO.SpendingSuggestion> generateSpendingSuggestions(String userId, AnalyticsDTO analytics) {
        List<SuggestionDTO.SpendingSuggestion> suggestions = new ArrayList<>();
        
        // Analyze category breakdown for high spending
        if (analytics.getCategoryBreakdown() != null) {
            analytics.getCategoryBreakdown().stream()
                    .filter(cat -> cat.getPercentage() > 30)
                    .forEach(cat -> {
                        BigDecimal suggestedLimit = cat.getAmount().multiply(new BigDecimal("0.8"));
                        suggestions.add(SuggestionDTO.SpendingSuggestion.builder()
                                .category(cat.getCategory())
                                .title("Reduce " + cat.getCategory() + " Spending")
                                .description("You're spending " + String.format("%.1f", cat.getPercentage()) + 
                                        "% on " + cat.getCategory() + ". Consider setting a limit.")
                                .currentSpending(cat.getAmount())
                                .suggestedLimit(suggestedLimit)
                                .potentialSavings(cat.getAmount().subtract(suggestedLimit))
                                .priority("HIGH")
                                .build());
                    });
        }
        
        // Check for struggle points
        if (analytics.getStrugglePoints() != null && !analytics.getStrugglePoints().isEmpty()) {
            analytics.getStrugglePoints().forEach(sp -> {
                suggestions.add(SuggestionDTO.SpendingSuggestion.builder()
                        .category(sp.getCategory())
                        .title("Address Struggle Points in " + sp.getCategory())
                        .description("You've marked " + sp.getCount() + " transactions as struggle points. " + sp.getSuggestion())
                        .currentSpending(sp.getTotalAmount())
                        .potentialSavings(sp.getTotalAmount().multiply(new BigDecimal("0.3")))
                        .priority("MEDIUM")
                        .build());
            });
        }
        
        return suggestions;
    }

    private List<SuggestionDTO.InvestmentSuggestion> generateInvestmentSuggestions(String userId, AnalyticsDTO analytics) {
        List<SuggestionDTO.InvestmentSuggestion> suggestions = new ArrayList<>();
        
        User user = userService.findById(userId).orElse(null);
        if (user == null) return suggestions;
        
        BigDecimal monthlySurplus = analytics.getNetSavings().divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP);
        
        if (monthlySurplus.compareTo(new BigDecimal("100")) > 0) {
            User.RiskProfile riskProfile = user.getRiskProfile();
            
            switch (riskProfile) {
                case LOW:
                    suggestions.add(SuggestionDTO.InvestmentSuggestion.builder()
                            .type("SAVINGS")
                            .title("High-Yield Savings Account")
                            .description("With your low risk tolerance, consider a high-yield savings account for your surplus.")
                            .suggestedAmount(monthlySurplus.multiply(new BigDecimal("0.5")))
                            .expectedReturn(4.5)
                            .riskLevel("LOW")
                            .timeHorizon("SHORT")
                            .options(List.of("Online Savings", "CDs", "Money Market"))
                            .build());
                    break;
                    
                case MEDIUM:
                    suggestions.add(SuggestionDTO.InvestmentSuggestion.builder()
                            .type("BALANCED")
                            .title("Balanced Investment Portfolio")
                            .description("Consider a mix of stocks and bonds for moderate growth with managed risk.")
                            .suggestedAmount(monthlySurplus.multiply(new BigDecimal("0.6")))
                            .expectedReturn(8.0)
                            .riskLevel("MEDIUM")
                            .timeHorizon("MEDIUM")
                            .options(List.of("Index Funds", "ETFs", "Balanced Mutual Funds"))
                            .build());
                    break;
                    
                case HIGH:
                    suggestions.add(SuggestionDTO.InvestmentSuggestion.builder()
                            .type("GROWTH")
                            .title("Growth-Oriented Investments")
                            .description("With your high risk tolerance, consider growth stocks and emerging markets.")
                            .suggestedAmount(monthlySurplus.multiply(new BigDecimal("0.7")))
                            .expectedReturn(12.0)
                            .riskLevel("HIGH")
                            .timeHorizon("LONG")
                            .options(List.of("Growth Stocks", "Small-Cap Funds", "International Markets"))
                            .build());
                    break;
            }
            
            // Emergency fund suggestion
            suggestions.add(SuggestionDTO.InvestmentSuggestion.builder()
                    .type("EMERGENCY_FUND")
                    .title("Build Emergency Fund")
                    .description("Aim for 3-6 months of expenses in an easily accessible account.")
                    .suggestedAmount(monthlySurplus.multiply(new BigDecimal("0.2")))
                    .expectedReturn(3.5)
                    .riskLevel("LOW")
                    .timeHorizon("SHORT")
                    .options(List.of("High-Yield Savings", "Money Market Account"))
                    .build());
        }
        
        return suggestions;
    }

    private List<SuggestionDTO.GoalSuggestion> generateGoalSuggestions(String userId) {
        List<SuggestionDTO.GoalSuggestion> suggestions = new ArrayList<>();
        
        List<Goal> goals = goalService.getActiveGoals(userId);
        
        goals.forEach(goal -> {
            if (!goal.isOnTrack()) {
                int monthsToAchieve = (int) Math.ceil(
                        goal.getRemainingAmount().divide(
                                goal.getSuggestedMonthlySaving().max(new BigDecimal("1")), 
                                0, RoundingMode.UP).doubleValue());
                
                suggestions.add(SuggestionDTO.GoalSuggestion.builder()
                        .goalId(goal.getId())
                        .title("Catch Up on Goal: " + goal.getName())
                        .description("You're behind schedule. Consider increasing your monthly contribution.")
                        .suggestedMonthlySaving(goal.getSuggestedMonthlySaving().multiply(new BigDecimal("1.2")))
                        .monthsToAchieve(monthsToAchieve)
                        .achievable(monthsToAchieve <= 24)
                        .build());
            } else {
                suggestions.add(SuggestionDTO.GoalSuggestion.builder()
                        .goalId(goal.getId())
                        .title("Goal On Track: " + goal.getName())
                        .description("Great job! You're on track to achieve this goal.")
                        .suggestedMonthlySaving(goal.getSuggestedMonthlySaving())
                        .monthsToAchieve((int) goal.getDaysRemaining() / 30)
                        .achievable(true)
                        .build());
            }
        });
        
        return suggestions;
    }

    private List<SuggestionDTO.BudgetOptimization> generateBudgetOptimizations(String userId, AnalyticsDTO analytics) {
        List<SuggestionDTO.BudgetOptimization> optimizations = new ArrayList<>();
        
        if (analytics.getBudgetStatus() != null) {
            analytics.getBudgetStatus().forEach(budget -> {
                if (budget.isOverBudget()) {
                    optimizations.add(SuggestionDTO.BudgetOptimization.builder()
                            .category(budget.getCategory())
                            .recommendation("INCREASE")
                            .currentBudget(budget.getBudgetLimit())
                            .suggestedBudget(budget.getSpent().multiply(new BigDecimal("1.1")))
                            .reason("You're consistently over budget. Consider increasing the limit or reducing spending.")
                            .build());
                } else if (budget.getUsagePercentage() < 50) {
                    optimizations.add(SuggestionDTO.BudgetOptimization.builder()
                            .category(budget.getCategory())
                            .recommendation("DECREASE")
                            .currentBudget(budget.getBudgetLimit())
                            .suggestedBudget(budget.getBudgetLimit().multiply(new BigDecimal("0.8")))
                            .reason("You're using less than 50% of this budget. Consider reallocating to other categories.")
                            .build());
                }
            });
        }
        
        return optimizations;
    }

    private SuggestionDTO.FinancialTip generateDailyTip(AnalyticsDTO analytics) {
        if (analytics.getSavingsRate() < 10) {
            return SuggestionDTO.FinancialTip.builder()
                    .title("Boost Your Savings")
                    .content("Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Small changes add up!")
                    .category("SAVINGS")
                    .build();
        } else if (analytics.getInsights() != null && !analytics.getInsights().isEmpty()) {
            AnalyticsDTO.SpendingInsight insight = analytics.getInsights().get(0);
            return SuggestionDTO.FinancialTip.builder()
                    .title(insight.getTitle())
                    .content(insight.getDescription())
                    .category(insight.getType())
                    .build();
        }
        
        return SuggestionDTO.FinancialTip.builder()
                .title("Track Everything")
                .content("The first step to financial freedom is knowing where your money goes. Keep tracking!")
                .category("GENERAL")
                .build();
    }
}
