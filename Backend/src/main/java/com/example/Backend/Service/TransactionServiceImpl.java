package com.example.Backend.Service;

import com.example.Backend.Entity.TransactionEntity;
import com.example.Backend.Repository.TransactionRepository;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @Override
    public TransactionEntity getCurrentTransaction() {
        return transactionRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public TransactionEntity updateCurrentTransaction(TransactionEntity updatedTransaction) {

        TransactionEntity existingTransaction =
                transactionRepository.findAll()
                        .stream()
                        .findFirst()
                        .orElse(null);

        // CREATE
        if (existingTransaction == null) {
            updatedTransaction.setDate(LocalDate.now().toString());
            return transactionRepository.save(updatedTransaction);
        }

        // UPDATE (partial update)
        if (updatedTransaction.getType() != null)
            existingTransaction.setType(updatedTransaction.getType());

        if (updatedTransaction.getCategory() != null)
            existingTransaction.setCategory(updatedTransaction.getCategory());

        if (updatedTransaction.getNotes() != null)
            existingTransaction.setNotes(updatedTransaction.getNotes());

        existingTransaction.setDate(LocalDate.now().toString());

        return transactionRepository.save(existingTransaction);
    }
}
