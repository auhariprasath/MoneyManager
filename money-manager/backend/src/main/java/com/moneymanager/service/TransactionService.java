package com.moneymanager.service;

import com.moneymanager.dto.TransactionRequest;
import com.moneymanager.model.Transaction;
import com.moneymanager.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private BudgetService budgetService;

    public Transaction createTransaction(String userId, TransactionRequest request) {
        Transaction transaction = Transaction.builder()
                .userId(userId)
                .type(request.getType())
                .amount(request.getAmount())
                .category(request.getCategory())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate())
                .isRecurring(request.isRecurring())
                .recurringDetails(request.getRecurringDetails())
                .struggleMarker(request.isStruggleMarker())
                .paymentMethod(request.getPaymentMethod())
                .tags(request.getTags())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        
        // Update budget if it's an expense
        if (request.getType() == Transaction.TransactionType.EXPENSE) {
            budgetService.updateSpentAmount(userId, request.getCategory(), 
                    request.getTransactionDate().withDayOfMonth(1), request.getAmount());
        }
        
        return saved;
    }

    public List<Transaction> getAllTransactions(String userId) {
        return transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
    }

    public List<Transaction> getTransactionsByType(String userId, Transaction.TransactionType type) {
        return transactionRepository.findByUserIdAndTypeOrderByTransactionDateDesc(userId, type);
    }

    public List<Transaction> getTransactionsByCategory(String userId, String category) {
        return transactionRepository.findByUserIdAndCategoryOrderByTransactionDateDesc(userId, category);
    }

    public List<Transaction> getTransactionsByDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public List<Transaction> getTransactionsByTypeAndDateRange(String userId, Transaction.TransactionType type, 
                                                               LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByUserIdAndTypeAndDateRange(userId, type, startDate, endDate);
    }

    public Optional<Transaction> getTransactionById(String id) {
        return transactionRepository.findById(id);
    }

    public Transaction updateTransaction(String id, String userId, TransactionRequest request) {
        return transactionRepository.findById(id)
                .map(transaction -> {
                    // Revert old budget impact
                    if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
                        budgetService.updateSpentAmount(userId, transaction.getCategory(),
                                transaction.getTransactionDate().withDayOfMonth(1), 
                                transaction.getAmount().negate());
                    }
                    
                    transaction.setType(request.getType());
                    transaction.setAmount(request.getAmount());
                    transaction.setCategory(request.getCategory());
                    transaction.setDescription(request.getDescription());
                    transaction.setTransactionDate(request.getTransactionDate());
                    transaction.setRecurring(request.isRecurring());
                    transaction.setRecurringDetails(request.getRecurringDetails());
                    transaction.setStruggleMarker(request.isStruggleMarker());
                    transaction.setPaymentMethod(request.getPaymentMethod());
                    transaction.setTags(request.getTags());
                    
                    Transaction updated = transactionRepository.save(transaction);
                    
                    // Apply new budget impact
                    if (request.getType() == Transaction.TransactionType.EXPENSE) {
                        budgetService.updateSpentAmount(userId, request.getCategory(),
                                request.getTransactionDate().withDayOfMonth(1), request.getAmount());
                    }
                    
                    return updated;
                })
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public void deleteTransaction(String id, String userId) {
        transactionRepository.findById(id).ifPresent(transaction -> {
            // Revert budget impact
            if (transaction.getType() == Transaction.TransactionType.EXPENSE) {
                budgetService.updateSpentAmount(userId, transaction.getCategory(),
                        transaction.getTransactionDate().withDayOfMonth(1), 
                        transaction.getAmount().negate());
            }
            transactionRepository.delete(transaction);
        });
    }

    public List<Transaction> getStrugglePoints(String userId) {
        return transactionRepository.findByUserIdAndStruggleMarkerTrue(userId);
    }

    public List<Transaction> getRecurringTransactions(String userId) {
        return transactionRepository.findByUserIdAndIsRecurringTrue(userId);
    }

    public BigDecimal getTotalIncome(String userId, LocalDate startDate, LocalDate endDate) {
        return getTransactionsByTypeAndDateRange(userId, Transaction.TransactionType.INCOME, startDate, endDate)
                .stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getTotalExpense(String userId, LocalDate startDate, LocalDate endDate) {
        return getTransactionsByTypeAndDateRange(userId, Transaction.TransactionType.EXPENSE, startDate, endDate)
                .stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public List<Transaction> searchTransactions(String userId, String query) {
        // Simple search by category or description
        return getAllTransactions(userId).stream()
                .filter(t -> t.getCategory().toLowerCase().contains(query.toLowerCase()) ||
                        (t.getDescription() != null && 
                         t.getDescription().toLowerCase().contains(query.toLowerCase())))
                .toList();
    }
}
