package com.example.Backend.Service;

import com.example.Backend.Entity.UsersEntity;
import com.example.Backend.Repository.UsersRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

import java.util.Optional;

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
            if (updatedUser.getCreatedAt() == null) {
                updatedUser.setCreatedAt(LocalDate.now().toString());
            }
            updatedUser.setUpdatedAt(LocalDate.now().toString());
            return usersRepository.save(updatedUser);
        }
        
        if (updatedUser.getName() != null) existingUser.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPasswordHash() != null) existingUser.setPasswordHash(updatedUser.getPasswordHash());
        if (updatedUser.getProfile() != null) existingUser.setProfile(updatedUser.getProfile());
        
        existingUser.setUpdatedAt(LocalDate.now().toString());

        return usersRepository.save(existingUser);
    }

    @Override
    public UsersEntity register(UsersEntity user) {
        if (usersRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        user.setCreatedAt(LocalDate.now().toString());
        user.setUpdatedAt(LocalDate.now().toString());
        return usersRepository.save(user);
    }

    @Override
    public UsersEntity login(String email, String password) {
        Optional<UsersEntity> user = usersRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPasswordHash().equals(password)) {
            return user.get();
        }
        return null;
    }
}
