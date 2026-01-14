package com.example.Backend.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "budget")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class BudgetEntity {
    private String id;
    private String userId;
    private String category;
    private int limitAmount;
    private PeriodEntity period; 
}
