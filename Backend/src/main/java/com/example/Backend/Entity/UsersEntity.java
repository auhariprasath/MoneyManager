package com.example.Backend.Entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersEntity {
    @Id
    private String id;
    private String name;
    private String email;
    private String passwordHash;
    private ProfileEntity profile;
    private String createdAt;
    private String updatedAt;
}
