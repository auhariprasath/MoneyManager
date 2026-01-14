package com.example.Backend.Service;

import com.example.Backend.Entity.TransactionEntity;
import java.util.List;

public interface TransactionService {
    TransactionEntity getCurrentTransaction();
    TransactionEntity updateCurrentTransaction(TransactionEntity updateUser);

    // New methods to support listing and creating transactions
    List<TransactionEntity> getAllTransactions();
    TransactionEntity createTransaction(TransactionEntity transaction);
}
