package com.moneymanager.controller;

import com.moneymanager.dto.AnalyticsDTO;
import com.moneymanager.security.UserDetailsImpl;
import com.moneymanager.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        String userId = getCurrentUserId();
        
        // Default to last 3 months if dates not provided
        if (startDate == null) {
            endDate = LocalDate.now();
            startDate = endDate.minusMonths(3).withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        AnalyticsDTO analytics = analyticsService.getDashboardAnalytics(userId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getQuickSummary() {
        String userId = getCurrentUserId();
        
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.withDayOfMonth(1);
        
        AnalyticsDTO analytics = analyticsService.getDashboardAnalytics(userId, startDate, endDate);
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("monthlyIncome", analytics.getTotalIncome());
        summary.put("monthlyExpense", analytics.getTotalExpense());
        summary.put("netSavings", analytics.getNetSavings());
        summary.put("savingsRate", analytics.getSavingsRate());
        
        return ResponseEntity.ok(summary);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
