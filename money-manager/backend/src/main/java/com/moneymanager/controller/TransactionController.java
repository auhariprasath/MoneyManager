package com.moneymanager.controller;

import com.moneymanager.dto.TransactionRequest;
import com.moneymanager.model.Transaction;
import com.moneymanager.security.UserDetailsImpl;
import com.moneymanager.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> createTransaction(@Valid @RequestBody TransactionRequest request) {
        String userId = getCurrentUserId();
        Transaction transaction = transactionService.createTransaction(userId, request);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping
    public ResponseEntity<?> getAllTransactions(
            @RequestParam(required = false) Transaction.TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        String userId = getCurrentUserId();
        List<Transaction> transactions;
        
        if (type != null && startDate != null && endDate != null) {
            transactions = transactionService.getTransactionsByTypeAndDateRange(userId, type, startDate, endDate);
        } else if (type != null) {
            transactions = transactionService.getTransactionsByType(userId, type);
        } else if (category != null) {
            transactions = transactionService.getTransactionsByCategory(userId, category);
        } else if (startDate != null && endDate != null) {
            transactions = transactionService.getTransactionsByDateRange(userId, startDate, endDate);
        } else {
            transactions = transactionService.getAllTransactions(userId);
        }
        
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTransactionById(@PathVariable String id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable String id, @Valid @RequestBody TransactionRequest request) {
        String userId = getCurrentUserId();
        Transaction transaction = transactionService.updateTransaction(id, userId, request);
        return ResponseEntity.ok(transaction);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable String id) {
        String userId = getCurrentUserId();
        transactionService.deleteTransaction(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTransactions(@RequestParam String query) {
        String userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.searchTransactions(userId, query);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/struggle-points")
    public ResponseEntity<?> getStrugglePoints() {
        String userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.getStrugglePoints(userId);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/recurring")
    public ResponseEntity<?> getRecurringTransactions() {
        String userId = getCurrentUserId();
        List<Transaction> transactions = transactionService.getRecurringTransactions(userId);
        return ResponseEntity.ok(transactions);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
