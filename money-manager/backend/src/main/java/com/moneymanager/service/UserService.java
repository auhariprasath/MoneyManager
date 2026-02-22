package com.moneymanager.service;

import com.moneymanager.dto.RegisterRequest;
import com.moneymanager.model.User;
import com.moneymanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User createUser(RegisterRequest request) {
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .currency("USD")
                .riskProfile(User.RiskProfile.MEDIUM)
                .categories(Arrays.asList(
                    "Food", "Transportation", "Housing", "Utilities", 
                    "Entertainment", "Healthcare", "Shopping", "Education",
                    "Salary", "Freelance", "Investments", "Other"
                ))
                .notificationPreferences(new User.NotificationPreferences())
                .build();
        
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public User updateUser(String userId, User updatedUser) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setFullName(updatedUser.getFullName());
                    user.setPhoneNumber(updatedUser.getPhoneNumber());
                    user.setCurrency(updatedUser.getCurrency());
                    user.setRiskProfile(updatedUser.getRiskProfile());
                    user.setCategories(updatedUser.getCategories());
                    user.setNotificationPreferences(updatedUser.getNotificationPreferences());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateRiskProfile(String userId, User.RiskProfile riskProfile) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setRiskProfile(riskProfile);
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
