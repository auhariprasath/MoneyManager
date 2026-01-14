package com.example.Backend.Controllers;

import com.example.Backend.DTO.UserDTO;
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
    public ResponseEntity<UsersEntity> updateMyProfile(
            @RequestBody UserDTO request) {

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
}
