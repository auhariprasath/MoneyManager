package com.example.Backend.Entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "Transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEntity {
    @Id
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;
    private String userId;
    private String type;
    private String category;
    private double amount;
    private String date;
    private String notes;
}
