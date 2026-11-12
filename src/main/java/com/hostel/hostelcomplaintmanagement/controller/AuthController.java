package com.hostel.hostelcomplaintmanagement.controller;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

  private final UserRepository userRepository;

  public AuthController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(
    @RequestParam String collegeRegistrationId,
    @RequestParam String password
  ) {

    User user = userRepository
      .findByCollegeRegistrationId(collegeRegistrationId)
      .orElse(null);

    if (user == null || !user.getPassword().equals(password)) {
      return ResponseEntity
        .badRequest()
        .body(Map.of("message", "Invalid college registration ID or password."));
    }

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Login successful.");
    response.put("name", user.getName());
    response.put("role", user.getRole());
    response.put("collegeRegistrationId", user.getCollegeRegistrationId());

    return ResponseEntity.ok(response);
  }
}
