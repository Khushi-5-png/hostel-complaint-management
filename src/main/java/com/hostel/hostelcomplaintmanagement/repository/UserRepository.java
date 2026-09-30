package com.hostel.hostelcomplaintmanagement.repository;

import com.hostel.hostelcomplaintmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByCollegeRegistrationId(String collegeRegistrationId);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByResetOtp(String resetOtp);
}