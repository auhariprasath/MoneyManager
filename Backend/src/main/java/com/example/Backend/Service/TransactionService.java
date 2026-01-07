package com.example.Backend.Service;

import com.example.Backend.Entity.TransactionEntity;

public interface TransactionService {
    TransactionEntity getCurrentTransaction();
    TransactionEntity updateCurrentTransaction(TransactionEntity updateUser);
}
