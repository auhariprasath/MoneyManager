package com.moneymanager.service;

import com.moneymanager.dto.BudgetRequest;
import com.moneymanager.model.Budget;
import com.moneymanager.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    public Budget createBudget(String userId, BudgetRequest request) {
        // Check if budget already exists for this category and month
        Optional<Budget> existing = budgetRepository.findByUserIdAndCategoryAndBudgetMonth(
                userId, request.getCategory(), request.getBudgetMonth());
        
        if (existing.isPresent()) {
            throw new RuntimeException("Budget already exists for this category and month");
        }

        Budget budget = Budget.builder()
                .userId(userId)
                .category(request.getCategory())
                .limitAmount(request.getLimitAmount())
                .spentAmount(BigDecimal.ZERO)
                .alertThreshold(request.getAlertThreshold() != null ? 
                        request.getAlertThreshold() : new BigDecimal("80"))
                .budgetMonth(request.getBudgetMonth())
                .notes(request.getNotes())
                .build();

        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgetsByMonth(String userId, YearMonth month) {
        return budgetRepository.findByUserIdAndBudgetMonthOrderByCategoryAsc(userId, month);
    }

    public List<Budget> getAllBudgets(String userId) {
        return budgetRepository.findByUserId(userId);
    }

    public Optional<Budget> getBudgetById(String id) {
        return budgetRepository.findById(id);
    }

    public Budget updateBudget(String id, BudgetRequest request) {
        return budgetRepository.findById(id)
                .map(budget -> {
                    budget.setLimitAmount(request.getLimitAmount());
                    budget.setAlertThreshold(request.getAlertThreshold());
                    budget.setNotes(request.getNotes());
                    return budgetRepository.save(budget);
                })
                .orElseThrow(() -> new RuntimeException("Budget not found"));
    }

    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }

    public void updateSpentAmount(String userId, String category, LocalDate budgetMonth, BigDecimal amount) {
        YearMonth month = YearMonth.from(budgetMonth);
        
        budgetRepository.findByUserIdAndCategoryAndBudgetMonth(userId, category, month)
                .ifPresent(budget -> {
                    BigDecimal newSpent = budget.getSpentAmount().add(amount);
                    budget.setSpentAmount(newSpent);
                    budgetRepository.save(budget);
                });
    }

    public List<Budget> getOverBudgetAlerts(String userId, YearMonth month) {
        return getBudgetsByMonth(userId, month).stream()
                .filter(Budget::isOverBudget)
                .toList();
    }

    public List<Budget> getThresholdAlerts(String userId, YearMonth month) {
        return getBudgetsByMonth(userId, month).stream()
                .filter(b -> !b.isOverBudget() && b.isThresholdExceeded())
                .toList();
    }

    public BigDecimal getTotalBudget(String userId, YearMonth month) {
        return getBudgetsByMonth(userId, month).stream()
                .map(Budget::getLimitAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalSpent(String userId, YearMonth month) {
        return getBudgetsByMonth(userId, month).stream()
                .map(Budget::getSpentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public double getOverallBudgetUsage(String userId, YearMonth month) {
        BigDecimal totalBudget = getTotalBudget(userId, month);
        if (totalBudget.compareTo(BigDecimal.ZERO) == 0) {
            return 0.0;
        }
        BigDecimal totalSpent = getTotalSpent(userId, month);
        return totalSpent.multiply(new BigDecimal("100"))
                .divide(totalBudget, 2, BigDecimal.ROUND_HALF_UP)
                .doubleValue();
    }
}
