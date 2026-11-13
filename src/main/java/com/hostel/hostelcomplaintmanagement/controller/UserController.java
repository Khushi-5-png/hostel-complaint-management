package com.hostel.hostelcomplaintmanagement.controller;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  // Endpoint for Warden to add a new hosteller student
  @PostMapping("/student")
  public ResponseEntity<?> addStudent(@RequestBody User user) {
    try {
      User savedStudent = userService.addStudent(user);
      return ResponseEntity.ok(Map.of(
        "message", "Student added successfully!",
        "student", savedStudent
      ));
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    } catch (Exception e) {
      e.printStackTrace();
      String errorMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
      return ResponseEntity.internalServerError().body(Map.of("message", "Error: " + errorMsg));
    }
  }

  // Endpoint for Warden to view all registered students
  @GetMapping("/students")
  public List<User> getAllStudents() {
    return userService.getAllStudents();
  }

  // Endpoint to remove a student
  @DeleteMapping("/student/{id}")
  public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
    userService.deleteStudent(id);
    return ResponseEntity.ok(Map.of("message", "Student removed successfully."));
  }
}
