package com.moneymanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Transactions")
public class Transaction {
    @Id
    private String id;
    
    @Indexed
    private String userId;
    
    private TransactionType type;
    private BigDecimal amount;
    private String category;
    private String description;
    private LocalDate transactionDate;
    
    @Builder.Default
    private boolean isRecurring = false;
    
    private RecurringDetails recurringDetails;
    
    @Builder.Default
    private boolean struggleMarker = false;
    
    private String paymentMethod;
    private String tags;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum TransactionType {
        INCOME, EXPENSE
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecurringDetails {
        private RecurringFrequency frequency;
        private LocalDate endDate;
        private String dayOfMonth;
    }
    
    public enum RecurringFrequency {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }
}
