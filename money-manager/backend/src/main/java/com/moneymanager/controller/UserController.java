package com.moneymanager.controller;

import com.moneymanager.model.User;
import com.moneymanager.security.UserDetailsImpl;
import com.moneymanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String userId = getCurrentUserId();
        return userService.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        String userId = getCurrentUserId();
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/risk-profile")
    public ResponseEntity<?> updateRiskProfile(@RequestBody Map<String, String> request) {
        String userId = getCurrentUserId();
        User.RiskProfile riskProfile = User.RiskProfile.valueOf(request.get("riskProfile"));
        User user = userService.updateRiskProfile(userId, riskProfile);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardSummary() {
        String userId = getCurrentUserId();
        
        Map<String, Object> dashboard = new HashMap<>();
        
        User user = userService.findById(userId).orElse(null);
        dashboard.put("user", user);
        
        return ResponseEntity.ok(dashboard);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
