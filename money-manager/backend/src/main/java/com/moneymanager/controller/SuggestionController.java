package com.moneymanager.controller;

import com.moneymanager.dto.SuggestionDTO;
import com.moneymanager.security.UserDetailsImpl;
import com.moneymanager.service.SuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    @Autowired
    private SuggestionService suggestionService;

    @GetMapping
    public ResponseEntity<?> getSuggestions() {
        String userId = getCurrentUserId();
        SuggestionDTO suggestions = suggestionService.getSuggestions(userId);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/daily-tip")
    public ResponseEntity<?> getDailyTip() {
        String userId = getCurrentUserId();
        SuggestionDTO suggestions = suggestionService.getSuggestions(userId);
        return ResponseEntity.ok(suggestions.getDailyTip());
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}
