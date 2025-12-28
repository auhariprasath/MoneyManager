package com.example.Backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UsersController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile(){
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(user);
    }

    @PutMapping("path/{id}")
    public ResponseEntity<User> updateMyProfile(@RequestBody User updatedUser) {
        User user = userService.updateCurrentUser(updatedUser);
        return ResponseEntity.ok(user);
    }
}
