package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

  private final UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  // Save a new hosteller student
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

  // View all registered hostel students
  public List<User> getAllStudents() {
    return userRepository.findAll().stream()
      .filter(u -> "STUDENT".equalsIgnoreCase(u.getRole()))
      .collect(Collectors.toList());
  }

  // Remove a student if she vacates the hostel
  public void deleteStudent(Long id) {
    userRepository.deleteById(id);
  }
}
