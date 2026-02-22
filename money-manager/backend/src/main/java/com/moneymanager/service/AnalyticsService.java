package com.moneymanager.service;

import com.moneymanager.dto.AnalyticsDTO;
import com.moneymanager.model.Budget;
import com.moneymanager.model.Transaction;
import com.moneymanager.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private TransactionService transactionService;

    public AnalyticsDTO getDashboardAnalytics(String userId, LocalDate startDate, LocalDate endDate) {
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        // Calculate totals
        BigDecimal totalIncome = transactionService.getTotalIncome(userId, startDate, endDate);
        BigDecimal totalExpense = transactionService.getTotalExpense(userId, startDate, endDate);
        BigDecimal netSavings = totalIncome.subtract(totalExpense);
        double savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0 ?
                netSavings.multiply(new BigDecimal("100")).divide(totalIncome, 2, RoundingMode.HALF_UP).doubleValue() : 0.0;
        
        analytics.setTotalIncome(totalIncome);
        analytics.setTotalExpense(totalExpense);
        analytics.setNetSavings(netSavings);
        analytics.setSavingsRate(savingsRate);
        
        // Category breakdown
        analytics.setCategoryBreakdown(getCategoryBreakdown(userId, startDate, endDate));
        
        // Monthly trends
        analytics.setMonthlyTrends(getMonthlyTrends(userId, startDate, endDate));
        
        // Weekly trends
        analytics.setWeeklyTrends(getWeeklyTrends(userId, startDate, endDate));
        
        // Budget status
        analytics.setBudgetStatus(getBudgetStatus(userId, YearMonth.from(endDate)));
        
        // Struggle points
        analytics.setStrugglePoints(getStrugglePoints(userId, startDate, endDate));
        
        // Insights
        analytics.setInsights(generateInsights(userId, startDate, endDate, totalIncome, totalExpense));
        
        return analytics;
    }

    private List<AnalyticsDTO.CategoryBreakdown> getCategoryBreakdown(String userId, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        
        Map<String, BigDecimal> categoryTotals = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));
        
        BigDecimal totalExpense = categoryTotals.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return categoryTotals.entrySet().stream()
                .map(entry -> {
                    BigDecimal amount = entry.getValue();
                    double percentage = totalExpense.compareTo(BigDecimal.ZERO) > 0 ?
                            amount.multiply(new BigDecimal("100")).divide(totalExpense, 2, RoundingMode.HALF_UP).doubleValue() : 0.0;
                    
                    return AnalyticsDTO.CategoryBreakdown.builder()
                            .category(entry.getKey())
                            .amount(amount)
                            .percentage(percentage)
                            .type("EXPENSE")
                            .build();
                })
                .sorted((a, b) -> b.getAmount().compareTo(a.getAmount()))
                .collect(Collectors.toList());
    }

    private List<AnalyticsDTO.MonthlyTrend> getMonthlyTrends(String userId, LocalDate startDate, LocalDate endDate) {
        List<AnalyticsDTO.MonthlyTrend> trends = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");
        
        // Fetch all transactions for the range once
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        
        // Corrected logic:
        Map<YearMonth, List<Transaction>> byMonth = transactions.stream()
                .collect(Collectors.groupingBy(t -> YearMonth.from(t.getTransactionDate())));
        
        LocalDate temp = startDate.withDayOfMonth(1);
        while (!temp.isAfter(endDate)) {
            YearMonth ym = YearMonth.from(temp);
            List<Transaction> monthTxrs = byMonth.getOrDefault(ym, Collections.emptyList());
            
            BigDecimal income = monthTxrs.stream()
                    .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal expense = monthTxrs.stream()
                    .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trends.add(AnalyticsDTO.MonthlyTrend.builder()
                    .month(temp.format(formatter))
                    .income(income)
                    .expense(expense)
                    .savings(income.subtract(expense))
                    .build());
            
            temp = temp.plusMonths(1);
        }
        
        return trends;
    }

    private List<AnalyticsDTO.WeeklyTrend> getWeeklyTrends(String userId, LocalDate startDate, LocalDate endDate) {
        List<AnalyticsDTO.WeeklyTrend> trends = new ArrayList<>();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        
        // Use the same transaction list (already fetched in getMonthlyTrends context, 
        // but here we fetch again or could pass it. Let's fetch again for simplicity but only once).
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
        
        LocalDate current = startDate.with(weekFields.dayOfWeek(), 1);
        int weekNumber = 1;
        
        while (!current.isAfter(endDate)) {
            LocalDate weekStart = current;
            LocalDate weekEnd = current.plusDays(6);
            
            final LocalDate fStart = weekStart;
            final LocalDate fEnd = weekEnd;
            
            List<Transaction> weekTxrs = transactions.stream()
                    .filter(t -> !t.getTransactionDate().isBefore(fStart) && !t.getTransactionDate().isAfter(fEnd))
                    .collect(Collectors.toList());
            
            BigDecimal income = weekTxrs.stream()
                    .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal expense = weekTxrs.stream()
                    .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                    .map(Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            trends.add(AnalyticsDTO.WeeklyTrend.builder()
                    .week("Week " + weekNumber)
                    .income(income)
                    .expense(expense)
                    .savings(income.subtract(expense))
                    .build());
            
            current = current.plusWeeks(1);
            weekNumber++;
        }
        
        return trends;
    }

    private List<AnalyticsDTO.BudgetStatus> getBudgetStatus(String userId, YearMonth month) {
        List<Budget> budgets = budgetService.getBudgetsByMonth(userId, month);
        
        return budgets.stream()
                .map(budget -> AnalyticsDTO.BudgetStatus.builder()
                        .category(budget.getCategory())
                        .budgetLimit(budget.getLimitAmount())
                        .spent(budget.getSpentAmount())
                        .remaining(budget.getRemainingAmount())
                        .usagePercentage(budget.getUsagePercentage().doubleValue())
                        .overBudget(budget.isOverBudget())
                        .thresholdExceeded(budget.isThresholdExceeded())
                        .build())
                .collect(Collectors.toList());
    }

    private List<AnalyticsDTO.StrugglePoint> getStrugglePoints(String userId, LocalDate startDate, LocalDate endDate) {
        List<Transaction> struggleTransactions = transactionRepository.findByUserIdAndStruggleMarkerTrue(userId);
        
        Map<String, List<Transaction>> byCategory = struggleTransactions.stream()
                .filter(t -> !t.getTransactionDate().isBefore(startDate) && !t.getTransactionDate().isAfter(endDate))
                .collect(Collectors.groupingBy(Transaction::getCategory));
        
        return byCategory.entrySet().stream()
                .map(entry -> {
                    List<Transaction> transactions = entry.getValue();
                    BigDecimal total = transactions.stream()
                            .map(Transaction::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    return AnalyticsDTO.StrugglePoint.builder()
                            .category(entry.getKey())
                            .count(transactions.size())
                            .totalAmount(total)
                            .suggestion("Consider reviewing your " + entry.getKey() + " spending habits")
                            .build();
                })
                .sorted((a, b) -> b.getTotalAmount().compareTo(a.getTotalAmount()))
                .collect(Collectors.toList());
    }

    private List<AnalyticsDTO.SpendingInsight> generateInsights(String userId, LocalDate startDate, LocalDate endDate,
                                                                 BigDecimal totalIncome, BigDecimal totalExpense) {
        List<AnalyticsDTO.SpendingInsight> insights = new ArrayList<>();
        
        // Savings rate insight
        double savingsRate = totalIncome.compareTo(BigDecimal.ZERO) > 0 ?
                totalIncome.subtract(totalExpense).multiply(new BigDecimal("100"))
                        .divide(totalIncome, 2, RoundingMode.HALF_UP).doubleValue() : 0.0;
        
        if (savingsRate < 10) {
            insights.add(AnalyticsDTO.SpendingInsight.builder()
                    .type("WARNING")
                    .title("Low Savings Rate")
                    .description("Your savings rate is below 10%. Try to reduce discretionary spending.")
                    .potentialSavings(totalExpense.multiply(new BigDecimal("0.1")))
                    .build());
        } else if (savingsRate > 30) {
            insights.add(AnalyticsDTO.SpendingInsight.builder()
                    .type("POSITIVE")
                    .title("Excellent Savings Rate")
                    .description("Great job! Your savings rate is above 30%.")
                    .build());
        }
        
        // Top spending category insight
        List<AnalyticsDTO.CategoryBreakdown> categories = getCategoryBreakdown(userId, startDate, endDate);
        if (!categories.isEmpty()) {
            AnalyticsDTO.CategoryBreakdown topCategory = categories.get(0);
            if (topCategory.getPercentage() > 40) {
                insights.add(AnalyticsDTO.SpendingInsight.builder()
                        .type("WARNING")
                        .title("High Spending in " + topCategory.getCategory())
                        .description(topCategory.getCategory() + " accounts for " + 
                                String.format("%.1f", topCategory.getPercentage()) + "% of your expenses.")
                        .potentialSavings(topCategory.getAmount().multiply(new BigDecimal("0.2")))
                        .build());
            }
        }
        
        // Budget adherence insight
        List<Budget> budgets = budgetService.getBudgetsByMonth(userId, YearMonth.from(endDate));
        long overBudgetCount = budgets.stream().filter(Budget::isOverBudget).count();
        if (overBudgetCount > 0) {
            insights.add(AnalyticsDTO.SpendingInsight.builder()
                    .type("WARNING")
                    .title("Budget Overruns")
                    .description("You're over budget in " + overBudgetCount + " categories this month.")
                    .build());
        }
        
        return insights;
    }
}
