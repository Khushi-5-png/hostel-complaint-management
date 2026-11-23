package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * Service handling the password‑reset flow using a 6‑digit OTP.
 * Works for all user roles (student, warden, superintendent, admin).
 */
@Service
public class PasswordResetService {

  private final UserRepository userRepository;
  private final EmailService emailService;

  private static final int OTP_LENGTH = 6;          // 6‑digit numeric code
  private static final int OTP_EXPIRY_MINUTES = 30; // OTP lives for 30 min

  public PasswordResetService(UserRepository userRepository,
                              EmailService emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  /**
   * Step 1 – called when the UI requests an OTP.
   *
   * @param email the user's registered e‑mail address
   */
  public void sendOtp(String email) {
    // Find the user by e‑mail (case‑insensitive)
    User user = userRepository.findByEmailIgnoreCase(email)
      .orElseThrow(() -> new RuntimeException(
        "No account found with this e‑mail address."));

    // Generate a 6‑digit OTP
    String otp = generateSixDigitOtp();

    // Store OTP & expiry on the user entity
    user.setResetOtp(otp);
    user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
    userRepository.save(user);

    // Send e‑mail (or log to console in demo mode)
    emailService.sendPasswordResetEmail(email, otp);
  }

  /**
   * Step 2 – called after the user submits the OTP and a new password.
   *
   * @param email        user's e‑mail (for safety)
   * @param otp          the OTP the user received
   * @param newPassword  the new password the user wants
   */
  public void verifyOtpAndChangePassword(String email,
                                         String otp,
                                         String newPassword) {
    // Locate the user again
    User user = userRepository.findByEmailIgnoreCase(email)
      .orElseThrow(() -> new RuntimeException(
        "No account found with this e‑mail address."));

    // Validate OTP presence, value, and expiration
    if (user.getResetOtp() == null ||
      !user.getResetOtp().equals(otp) ||
      user.getResetOtpExpiry() == null ||
      user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
      throw new RuntimeException("Invalid or expired OTP. Please request a new code.");
    }

    // Simple password strength check (you can expand this)
    if (newPassword == null || newPassword.length() < 4) {
      throw new RuntimeException("Password must be at least 4 characters.");
    }

    // Apply the new password and clear OTP fields
    user.setPassword(newPassword);
    user.setResetOtp(null);
    user.setResetOtpExpiry(null);
    userRepository.save(user);
  }

  // -----------------------------------------------------------------
  // Helper to generate a zero‑padded 6‑digit numeric OTP
  // -----------------------------------------------------------------
  private String generateSixDigitOtp() {
    Random rnd = new Random();
    int number = rnd.nextInt((int) Math.pow(10, OTP_LENGTH));
    return String.format("%0" + OTP_LENGTH + "d", number);
  }
}
