package com.example.Backend.Service;

import com.example.Backend.Entity.UsersEntity;

public interface UserService {
    UsersEntity getCurrentUser();
    UsersEntity updateCurrentUser(UsersEntity updatedUser);
    UsersEntity register(UsersEntity user);
    UsersEntity login(String email, String password);
}
