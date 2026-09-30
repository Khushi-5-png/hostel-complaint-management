package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.User;
import com.hostel.hostelcomplaintmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

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

    public void requestPasswordReset(String email) {

        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);

        if (user == null) {
            throw new RuntimeException("No account found with this email address.");
        }

        String resetToken = UUID.randomUUID().toString();

        user..\mvnw.cmd compile\mvnw.cmd compile.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30));

        userRepository.save(user);

        String resetLink =
                "http://localhost:4200/reset-password?token=" + resetToken;

        emailService.sendPasswordResetEmail(
                user.getEmail(),
                resetLink
        );
    }

    public void resetPassword(String token, String newPassword) {

        User user = userRepository.findByResetToken(token).orElse(null);

        if (user == null) {
            throw new RuntimeException("Invalid or expired reset token.");
        }

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset token.");
        }

        if (newPassword == null || newPassword.length() < 4) {
            throw new RuntimeException("Password must be at least 4 characters.");
        }

        user.setPassword(newPassword);
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }
}