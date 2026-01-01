package com.example.Backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.Backend.Entity.UsersEntity;

public interface UsersRepository extends MongoRepository<UsersEntity, String> {
}
