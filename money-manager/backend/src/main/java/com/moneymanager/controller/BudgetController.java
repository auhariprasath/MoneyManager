package com.moneymanager.controller;

import com.moneymanager.dto.BudgetRequest;
import com.moneymanager.model.Budget;
import com.moneymanager.security.UserDetailsImpl;
import com.moneymanager.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @PostMapping
    public ResponseEntity<?> createBudget(@Valid @RequestBody BudgetRequest request) {
        String userId = getCurrentUserId();
        Budget budget = budgetService.createBudget(userId, request);
        return ResponseEntity.ok(budget);
    }

    @GetMapping
    public ResponseEntity<?> getBudgets(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        
        String userId = getCurrentUserId();
        List<Budget> budgets;
        
        if (month != null) {
            budgets = budgetService.getBudgetsByMonth(userId, month);
        } else {
            budgets = budgetService.getAllBudgets(userId);
        }
        
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBudgetById(@PathVariable String id) {
        return budgetService.getBudgetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBudget(@PathVariable String id, @Valid @RequestBody BudgetRequest request) {
        Budget budget = budgetService.updateBudget(id, request);
        return ResponseEntity.ok(budget);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBudget(@PathVariable String id) {
        budgetService.deleteBudget(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/alerts")
    public ResponseEntity<?> getBudgetAlerts(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        
        String userId = getCurrentUserId();
        
        Map<String, Object> alerts = new HashMap<>();
        alerts.put("overBudget", budgetService.getOverBudgetAlerts(userId, month));
        alerts.put("thresholdExceeded", budgetService.getThresholdAlerts(userId, month));
        
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getBudgetSummary(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        
        String userId = getCurrentUserId();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBudget", budgetService.getTotalBudget(userId, month));
        summary.put("totalSpent", budgetService.getTotalSpent(userId, month));
        summary.put("overallUsage", budgetService.getOverallBudgetUsage(userId, month));
        
        return ResponseEntity.ok(summary);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
