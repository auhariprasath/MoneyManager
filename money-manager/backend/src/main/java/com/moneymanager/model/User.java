package com.moneymanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "Users")
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;
    private String currency;
    
    @Builder.Default
    private RiskProfile riskProfile = RiskProfile.MEDIUM;
    
    @Builder.Default
    private List<String> categories = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public enum RiskProfile {
        LOW, MEDIUM, HIGH
    }
    
    @Builder.Default
    private NotificationPreferences notificationPreferences = new NotificationPreferences();
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class NotificationPreferences {
        @Builder.Default
        private boolean budgetAlerts = true;
        @Builder.Default
        private boolean goalMilestones = true;
        @Builder.Default
        private boolean weeklyReports = false;
        @Builder.Default
        private boolean billReminders = true;
    }
}
