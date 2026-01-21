package com.example.Backend.Controllers;

import com.example.Backend.DTO.UserDTO;
import com.example.Backend.Entity.UsersEntity;
import com.example.Backend.Service.UserService;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    // 🔹 Fetch logged-in user's profile
    @GetMapping("/me")
    public ResponseEntity<UsersEntity> getMyProfile() {
        UsersEntity user = userService.getCurrentUser();
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }


    @PutMapping("/me")
    public ResponseEntity<UsersEntity> updateMyProfile(@RequestBody UserDTO request) {
        UsersEntity toUpdate = new UsersEntity();
        toUpdate.setName(request.getName());
        toUpdate.setEmail(request.getEmail());
        toUpdate.setProfile(request.getProfile());

        UsersEntity updatedUser = userService.updateCurrentUser(toUpdate);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO request) {
        try {
            UsersEntity newUser = new UsersEntity();
            newUser.setName(request.getName());
            newUser.setEmail(request.getEmail());
            newUser.setPasswordHash(request.getPassword());
            newUser.setProfile(request.getProfile());
            UsersEntity saved = userService.register(newUser);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> creds) {
        String email = creds.get("email");
        String password = creds.get("password");
        UsersEntity user = userService.login(email, password);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
