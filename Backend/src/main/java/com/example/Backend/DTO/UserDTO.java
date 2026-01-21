package com.example.Backend.DTO;

import com.example.Backend.Entity.ProfileEntity;
import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
    private ProfileEntity profile;
}
