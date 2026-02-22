package com.moneymanager.controller;

import com.moneymanager.dto.GoalRequest;
import com.moneymanager.model.Goal;
import com.moneymanager.security.UserDetailsImpl;
import com.moneymanager.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    @Autowired
    private GoalService goalService;

    @PostMapping
    public ResponseEntity<?> createGoal(@Valid @RequestBody GoalRequest request) {
        String userId = getCurrentUserId();
        Goal goal = goalService.createGoal(userId, request);
        return ResponseEntity.ok(goal);
    }

    @GetMapping
    public ResponseEntity<?> getAllGoals(@RequestParam(required = false) String status) {
        String userId = getCurrentUserId();
        List<Goal> goals;
        
        if ("active".equalsIgnoreCase(status)) {
            goals = goalService.getActiveGoals(userId);
        } else {
            goals = goalService.getAllGoals(userId);
        }
        
        return ResponseEntity.ok(goals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGoalById(@PathVariable String id) {
        String userId = getCurrentUserId();
        return goalService.getGoalById(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable String id, @Valid @RequestBody GoalRequest request) {
        String userId = getCurrentUserId();
        Goal goal = goalService.updateGoal(id, userId, request);
        return ResponseEntity.ok(goal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable String id) {
        String userId = getCurrentUserId();
        goalService.deleteGoal(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/contribute")
    public ResponseEntity<?> contributeToGoal(@PathVariable String id, @RequestBody Map<String, BigDecimal> request) {
        String userId = getCurrentUserId();
        BigDecimal amount = request.get("amount");
        Goal goal = goalService.contributeToGoal(id, userId, amount);
        return ResponseEntity.ok(goal);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateGoalStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        String userId = getCurrentUserId();
        Goal.GoalStatus status = Goal.GoalStatus.valueOf(request.get("status"));
        Goal goal = goalService.updateGoalStatus(id, userId, status);
        return ResponseEntity.ok(goal);
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getGoalsSummary() {
        String userId = getCurrentUserId();
        
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalTarget", goalService.getTotalGoalTarget(userId));
        summary.put("totalProgress", goalService.getTotalGoalProgress(userId));
        summary.put("completedCount", goalService.getCompletedGoalsCount(userId));
        summary.put("activeCount", goalService.getActiveGoalsCount(userId));
        
        return ResponseEntity.ok(summary);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
