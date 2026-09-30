package com.hostel.hostelcomplaintmanagement.controller;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestParam String collegeRegistrationId,
            @RequestParam String password
    ) {

        User user = userRepository
                .findByCollegeRegistrationId(collegeRegistrationId)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid college registration ID or password.");
        }

        if (!user.getPassword().equals(password)) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid college registration ID or password.");
        }

        return ResponseEntity.ok("Login successful.");
    }
}