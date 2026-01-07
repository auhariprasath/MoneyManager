package com.example.Backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.Entity.TransactionEntity;
import com.example.Backend.Entity.UsersEntity;
import com.example.Backend.Service.TransactionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;



@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService){
        this.transactionService = transactionService;
    }

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
    
}
