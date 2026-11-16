package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PasswordResetService {

  private final UserRepository userRepository;
  private final EmailService emailService;

  public PasswordResetService(
    UserRepository userRepository,
    EmailService emailService
  ) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  // 1. Generate & Send 6-Digit Real OTP Email
  public void sendOtp(String email) {

    String cleanEmail = email.trim().toLowerCase();

    User user = userRepository.findByEmailIgnoreCase(cleanEmail).orElse(null);

    // If user doesn't exist yet, automatically register as a student so password reset always works
    if (user == null) {
      user = new User();
      user.setName("Student");
      user.setCollegeRegistrationId(cleanEmail.split("@")[0]);
      user.setEmail(cleanEmail);
      user.setPassword("1234");
      user.setRole("STUDENT");
      user = userRepository.save(user);
    }

    // Generate a random 6-digit OTP
    String otp = String.format("%06d", new Random().nextInt(900000) + 100000);

    user.setResetOtp(otp);
    user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(10));
    userRepository.save(user);

    // Send real email via Gmail
    emailService.sendPasswordResetOtp(cleanEmail, otp);
  }

  // 2. Verify OTP & Update Password in PostgreSQL
  public void verifyOtpAndChangePassword(
    String email,
    String otp,
    String newPassword
  ) {

    String cleanEmail = email.trim().toLowerCase();
    User user = userRepository.findByEmailIgnoreCase(cleanEmail).orElse(null);

    if (user == null) {
      throw new RuntimeException("No account found with this email address.");
    }

    if (user.getResetOtp() == null || !user.getResetOtp().equals(otp.trim())) {
      throw new RuntimeException("Invalid OTP code. Please check your email.");
    }

    if (user.getResetOtpExpiry() == null ||
      user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("OTP has expired. Please request a new one.");
    }

    if (newPassword == null || newPassword.trim().length() < 4) {
      throw new RuntimeException("Password must be at least 4 characters long.");
    }

    // Update password in database and clear OTP
    user.setPassword(newPassword.trim());
    user.setResetOtp(null);
    user.setResetOtpExpiry(null);

    userRepository.save(user);
  }
}
