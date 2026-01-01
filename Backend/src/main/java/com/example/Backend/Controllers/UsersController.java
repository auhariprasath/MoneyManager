package com.example.Backend.Controllers;

import com.example.Backend.Entity.UsersEntity;
import com.example.Backend.Service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UsersEntity> getMyProfile() {
        UsersEntity user = userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UsersEntity> updateMyProfile(@RequestBody UsersEntity updatedUser) {
        UsersEntity user = userService.updateCurrentUser(updatedUser);
        return ResponseEntity.ok(user);
    }
}
