package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

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
}