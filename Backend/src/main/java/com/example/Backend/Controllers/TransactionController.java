package com.example.Backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.Entity.TransactionEntity;
import com.example.Backend.Service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;


@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService){
        this.transactionService = transactionService;
    }

    // existing single-entity endpoints (keeps backward compatibility)
    @GetMapping("/spending")
    public ResponseEntity<TransactionEntity> getMyTransaction() {
        TransactionEntity t = transactionService.getCurrentTransaction();
        if(t==null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(t);
    }

    @PutMapping("/spending")
    public ResponseEntity<TransactionEntity> updateMyTransaction(@RequestBody TransactionEntity updatedUser) {
        TransactionEntity t = transactionService.updateCurrentTransaction(updatedUser);
        return ResponseEntity.ok(t);
    }

    // New: return all transactions
    @GetMapping("/all")
    public ResponseEntity<List<TransactionEntity>> getAllTransactions() {
        List<TransactionEntity> list = transactionService.getAllTransactions();
        return ResponseEntity.ok(list);
    }

    // New: create a transaction
    @PostMapping("")
    public ResponseEntity<TransactionEntity> createTransaction(@RequestBody TransactionEntity transaction) {
        TransactionEntity saved = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(saved);
    }
    
}
