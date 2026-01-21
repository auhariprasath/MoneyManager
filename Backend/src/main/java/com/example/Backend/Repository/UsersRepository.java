package com.example.Backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.Backend.Entity.UsersEntity;
import java.util.Optional;

public interface UsersRepository extends MongoRepository<UsersEntity, String> {
    Optional<UsersEntity> findByEmail(String email);
}
