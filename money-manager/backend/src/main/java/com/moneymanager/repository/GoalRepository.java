package com.moneymanager.repository;

import com.moneymanager.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GoalRepository extends MongoRepository<Goal, String> {
    
    List<Goal> findByUserIdOrderByPriorityDesc(String userId);
    
    List<Goal> findByUserIdAndStatusOrderByPriorityDesc(String userId, Goal.GoalStatus status);
    
    Optional<Goal> findByIdAndUserId(String id, String userId);
    
    List<Goal> findByUserIdAndAutoAllocateTrue(String userId);
    
    long countByUserIdAndStatus(String userId, Goal.GoalStatus status);
}
