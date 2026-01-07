package com.example.Backend.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.Backend.Entity.TransactionEntity;


public interface TransactionRepository extends MongoRepository<TransactionEntity,String> {
    
}
