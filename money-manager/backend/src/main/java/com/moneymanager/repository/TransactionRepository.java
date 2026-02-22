package com.moneymanager.repository;

import com.moneymanager.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    
    List<Transaction> findByUserIdOrderByTransactionDateDesc(String userId);
    
    List<Transaction> findByUserIdAndTypeOrderByTransactionDateDesc(String userId, Transaction.TransactionType type);
    
    List<Transaction> findByUserIdAndCategoryOrderByTransactionDateDesc(String userId, String category);
    
    @Query("{ 'userId': ?0, 'transactionDate': { $gte: ?1, $lte: ?2 } }")
    List<Transaction> findByUserIdAndDateRange(String userId, LocalDate startDate, LocalDate endDate);
    
    @Query("{ 'userId': ?0, 'type': ?1, 'transactionDate': { $gte: ?2, $lte: ?3 } }")
    List<Transaction> findByUserIdAndTypeAndDateRange(String userId, Transaction.TransactionType type, LocalDate startDate, LocalDate endDate);
    
    List<Transaction> findByUserIdAndStruggleMarkerTrue(String userId);
    
    @Query("{ 'userId': ?0, 'category': ?1, 'transactionDate': { $gte: ?2, $lte: ?3 } }")
    List<Transaction> findByUserIdAndCategoryAndDateRange(String userId, String category, LocalDate startDate, LocalDate endDate);
    
    @Query(value = "{ 'userId': ?0 }", fields = "{ 'category': 1 }")
    List<Transaction> findDistinctCategoriesByUserId(String userId);
    
    List<Transaction> findByUserIdAndIsRecurringTrue(String userId);
}
