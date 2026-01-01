package com.example.Backend.Service;

import com.example.Backend.Entity.UsersEntity;
import com.example.Backend.Repository.UsersRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserServiceImpl implements UserService {

    private final UsersRepository usersRepository;

    public UserServiceImpl(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    @Override
    public UsersEntity getCurrentUser() {
        return usersRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }

    @Override
    public UsersEntity updateCurrentUser(UsersEntity updatedUser) {
        UsersEntity existingUser = usersRepository.findAll()
                .stream()
                .findFirst()
                .orElse(null);

        if (existingUser == null) {
            // If no user exists, create a new one (Upsert behavior)
            if (updatedUser.getCreatedAt() == null) {
                updatedUser.setCreatedAt(LocalDate.now().toString());
            }
            updatedUser.setUpdatedAt(LocalDate.now().toString());
            return usersRepository.save(updatedUser);
        }

        // Update existing user fields
        if (updatedUser.getName() != null) existingUser.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPasswordHash() != null) existingUser.setPasswordHash(updatedUser.getPasswordHash());
        if (updatedUser.getProfile() != null) existingUser.setProfile(updatedUser.getProfile());
        
        existingUser.setUpdatedAt(LocalDate.now().toString());

        return usersRepository.save(existingUser);
    }
}
