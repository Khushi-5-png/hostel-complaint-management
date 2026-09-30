package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

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

    public void sendOtp(String email) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElse(null);

        if (user == null) {
            throw new RuntimeException(
                    "No registered account found with this email address."
            );
        }

        String otp = String.format(
                "%06d",
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );

        user.setResetOtp(otp);
        user.setResetOtpExpiry(
                LocalDateTime.now().plusMinutes(10)
        );

        userRepository.save(user);

        emailService.sendPasswordResetOtp(
                user.getEmail(),
                otp
        );
    }

    public void verifyOtpAndChangePassword(
            String email,
            String otp,
            String newPassword
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElse(null);

        if (user == null) {
            throw new RuntimeException(
                    "Registered account not found."
            );
        }

        if (user.getResetOtp() == null) {
            throw new RuntimeException(
                    "Please request a new OTP."
            );
        }

        if (!user.getResetOtp().equals(otp)) {
            throw new RuntimeException(
                    "Invalid OTP."
            );
        }

        if (
                user.getResetOtpExpiry() == null ||
                        user.getResetOtpExpiry()
                                .isBefore(LocalDateTime.now())
        ) {
            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }

        if (
                newPassword == null ||
                        newPassword.length() < 4
        ) {
            throw new RuntimeException(
                    "Password must be at least 4 characters."
            );
        }

        user.setPassword(newPassword);
        user.setResetOtp(null);
        user.setResetOtpExpiry(null);

        userRepository.save(user);
    }
}