package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public User findByCollegeRegistrationId(String collegeRegistrationId) {
    return userRepository
      .findByCollegeRegistrationId(collegeRegistrationId)
      .orElse(null);
  }

  public User findByEmail(String email) {
    return userRepository
      .findByEmailIgnoreCase(email)
      .orElse(null);
  }

  // Save a single student
  public User addStudent(User user) {
    if (userRepository.findByCollegeRegistrationId(user.getCollegeRegistrationId()).isPresent()) {
      throw new IllegalArgumentException("A student with this College Registration ID already exists.");
    }

    if (userRepository.findByEmailIgnoreCase(user.getEmail()).isPresent()) {
      throw new IllegalArgumentException("This email address is already registered.");
    }

    user.setRole("STUDENT");

    if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
      user.setPassword("1234");
    }

    return userRepository.save(user);
  }

  // Bulk Import from CSV / Excel file
  public Map<String, Object> importStudentsFromCsv(MultipartFile file) throws Exception {
    int importedCount = 0;
    int skippedCount = 0;

    try (BufferedReader reader = new BufferedReader(
      new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

      String line;
      boolean isHeader = true;

      while ((line = reader.readLine()) != null) {
        line = line.trim();
        if (line.isEmpty()) continue;

        // Skip the header row (name, registrationId, email)
        if (isHeader) {
          isHeader = false;
          if (line.toLowerCase().contains("name") || line.toLowerCase().contains("registration")) {
            continue;
          }
        }

        // Split columns by comma
        String[] parts = line.split(",");
        if (parts.length >= 3) {
          String name = parts[0].trim();
          String regId = parts[1].trim();
          String email = parts[2].trim().toLowerCase();
          String password = parts.length >= 4 && !parts[3].trim().isEmpty() ? parts[3].trim() : "1234";

          // Skip if already in database
          if (userRepository.findByCollegeRegistrationId(regId).isPresent() ||
            userRepository.findByEmailIgnoreCase(email).isPresent()) {
            skippedCount++;
            continue;
          }

          User student = new User();
          student.setName(name);
          student.setCollegeRegistrationId(regId);
          student.setEmail(email);
          student.setPassword(password);
          student.setRole("STUDENT");

          userRepository.save(student);
          importedCount++;
        }
      }
    }

    Map<String, Object> result = new HashMap<>();
    result.put("message", "Import complete! " + importedCount + " students added.");
    result.put("importedCount", importedCount);
    result.put("skippedCount", skippedCount);
    return result;
  }

  // View all registered students
  public List<User> getAllStudents() {
    return userRepository.findAll().stream()
      .filter(u -> "STUDENT".equalsIgnoreCase(u.getRole()))
      .collect(Collectors.toList());
  }

  // Remove a student
  public void deleteStudent(Long id) {
    userRepository.deleteById(id);
  }
}
