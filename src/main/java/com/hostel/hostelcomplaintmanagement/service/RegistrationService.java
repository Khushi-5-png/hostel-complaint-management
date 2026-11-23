package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RegistrationService {

  private static final int OTP_LENGTH = 6;
  private static final int OTP_EXPIRY_MINUTES = 5;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private EmailService emailService;   // reuse the existing EmailService

  private final SecureRandom random = new SecureRandom();

  /** Generate a numeric OTP of length {@value #OTP_LENGTH}. */
  private String generateOtp() {
    int max = (int) Math.pow(10, OTP_LENGTH) - 1;
    int value = random.nextInt(max + 1);
    return String.format("%0" + OTP_LENGTH + "d", value);
  }

  /** Step 1 – called when a user submits their e‑mail (and other sign‑up data). */
  public void sendRegistrationOtp(String email, String name, String collegeRegId, String rawPassword, String role) {
    // 1️⃣ Find or create a placeholder user (disabled)
    User user = userRepository.findByEmail(email).orElseGet(User::new);

    user.setEmail(email);
    user.setName(name);
    user.setCollegeRegistrationId(collegeRegId);
    user.setPassword(rawPassword);   // you may hash it later
    user.setRole(role);
    user.setEnabled(false);          // not yet verified

    // 2️⃣ Generate OTP and set expiry
    String otp = generateOtp();
    user.setRegistrationOtp(otp);
    user.setRegistrationOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));

    // 3️⃣ Persist user (creates or updates the row)
    userRepository.save(user);

    // 4️⃣ Send OTP (currently just logs)
    emailService.sendRegistrationOtp(email, otp);
  }

  /** Step 2 – verify the OTP and finally enable the account. */
  public boolean verifyRegistrationOtp(String email, String otp) {
    Optional<User> opt = userRepository.findByEmail(email);
    if (opt.isEmpty()) {
      return false;
    }

    User user = opt.get();

    // Check OTP presence and expiry
    if (user.getRegistrationOtp() == null ||
      user.getRegistrationOtpExpiry() == null ||
      LocalDateTime.now().isAfter(user.getRegistrationOtpExpiry())) {
      return false;
    }

    // Compare OTP (case‑sensitive, numeric)
    if (!user.getRegistrationOtp().equals(otp)) {
      return false;
    }

    // OTP is good – enable the account and clear OTP fields
    user.setEnabled(true);
    user.setRegistrationOtp(null);
    user.setRegistrationOtpExpiry(null);
    userRepository.save(user);
    return true;
  }
}
