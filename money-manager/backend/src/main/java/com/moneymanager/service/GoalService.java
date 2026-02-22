package com.moneymanager.service;

import com.moneymanager.dto.GoalRequest;
import com.moneymanager.model.Goal;
import com.moneymanager.repository.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    @Autowired
    private GoalRepository goalRepository;

    public Goal createGoal(String userId, GoalRequest request) {
        Goal goal = Goal.builder()
                .userId(userId)
                .name(request.getName())
                .description(request.getDescription())
                .targetAmount(request.getTargetAmount())
                .currentAmount(BigDecimal.ZERO)
                .targetDate(request.getTargetDate())
                .priority(request.getPriority() != null ? request.getPriority() : Goal.Priority.MEDIUM)
                .status(Goal.GoalStatus.ACTIVE)
                .category(request.getCategory())
                .icon(request.getIcon())
                .color(request.getColor())
                .autoAllocate(request.isAutoAllocate())
                .monthlyAllocation(request.getMonthlyAllocation())
                .build();

        return goalRepository.save(goal);
    }

    public List<Goal> getAllGoals(String userId) {
        return goalRepository.findByUserIdOrderByPriorityDesc(userId);
    }

    public List<Goal> getActiveGoals(String userId) {
        return goalRepository.findByUserIdAndStatusOrderByPriorityDesc(userId, Goal.GoalStatus.ACTIVE);
    }

    public Optional<Goal> getGoalById(String id, String userId) {
        return goalRepository.findByIdAndUserId(id, userId);
    }

    public Goal updateGoal(String id, String userId, GoalRequest request) {
        return goalRepository.findByIdAndUserId(id, userId)
                .map(goal -> {
                    goal.setName(request.getName());
                    goal.setDescription(request.getDescription());
                    goal.setTargetAmount(request.getTargetAmount());
                    goal.setTargetDate(request.getTargetDate());
                    goal.setPriority(request.getPriority());
                    goal.setCategory(request.getCategory());
                    goal.setIcon(request.getIcon());
                    goal.setColor(request.getColor());
                    goal.setAutoAllocate(request.isAutoAllocate());
                    goal.setMonthlyAllocation(request.getMonthlyAllocation());
                    return goalRepository.save(goal);
                })
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    public Goal contributeToGoal(String id, String userId, BigDecimal amount) {
        return goalRepository.findByIdAndUserId(id, userId)
                .map(goal -> {
                    BigDecimal newAmount = goal.getCurrentAmount().add(amount);
                    goal.setCurrentAmount(newAmount);
                    
                    // Check if goal is completed
                    if (newAmount.compareTo(goal.getTargetAmount()) >= 0) {
                        goal.setStatus(Goal.GoalStatus.COMPLETED);
                    }
                    
                    return goalRepository.save(goal);
                })
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    public void deleteGoal(String id, String userId) {
        goalRepository.findByIdAndUserId(id, userId)
                .ifPresent(goalRepository::delete);
    }

    public Goal updateGoalStatus(String id, String userId, Goal.GoalStatus status) {
        return goalRepository.findByIdAndUserId(id, userId)
                .map(goal -> {
                    goal.setStatus(status);
                    return goalRepository.save(goal);
                })
                .orElseThrow(() -> new RuntimeException("Goal not found"));
    }

    public List<Goal> getAutoAllocateGoals(String userId) {
        return goalRepository.findByUserIdAndAutoAllocateTrue(userId);
    }

    public BigDecimal getTotalGoalTarget(String userId) {
        return getActiveGoals(userId).stream()
                .map(Goal::getTargetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalGoalProgress(String userId) {
        return getActiveGoals(userId).stream()
                .map(Goal::getCurrentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public long getCompletedGoalsCount(String userId) {
        return goalRepository.countByUserIdAndStatus(userId, Goal.GoalStatus.COMPLETED);
    }

    public long getActiveGoalsCount(String userId) {
        return goalRepository.countByUserIdAndStatus(userId, Goal.GoalStatus.ACTIVE);
    }
}
