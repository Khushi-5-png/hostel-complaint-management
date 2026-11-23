package com.hostel.hostelcomplaintmanagement.service;

import org.springframework.stereotype.Service;

/** Simple email service – currently just logs to the console. */
@Service
public class EmailService {

  public void sendPasswordResetEmail(String email, String otp) {
    System.out.println("[EmailService] Password‑reset OTP for " + email + ": " + otp);
  }

  /** NEW: send the registration OTP when a user signs up. */
  public void sendRegistrationOtp(String email, String otp) {
    System.out.println("[EmailService] Registration OTP for " + email + ": " + otp);
    // Replace with a real email sender when you’re ready.
  }
}
