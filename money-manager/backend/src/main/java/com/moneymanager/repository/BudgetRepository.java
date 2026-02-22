package com.moneymanager.repository;

import com.moneymanager.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends MongoRepository<Budget, String> {
    
    List<Budget> findByUserIdAndBudgetMonth(String userId, YearMonth budgetMonth);
    
    Optional<Budget> findByUserIdAndCategoryAndBudgetMonth(String userId, String category, YearMonth budgetMonth);
    
    List<Budget> findByUserId(String userId);
    
    List<Budget> findByUserIdAndBudgetMonthOrderByCategoryAsc(String userId, YearMonth budgetMonth);
    
    boolean existsByUserIdAndCategoryAndBudgetMonth(String userId, String category, YearMonth budgetMonth);
}
