package com.hostel.hostelcomplaintmanagement.controller;

import com.hostel.hostelcomplaintmanagement.service.PasswordResetService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password")
@CrossOrigin(origins = "http://localhost:4200")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot")
    public String forgotPassword(@RequestParam String email) {

        passwordResetService.requestPasswordReset(email);

        return "Password reset email sent successfully.";
    }

    @PostMapping("/reset")
    public String resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {

        passwordResetService.resetPassword(token, newPassword);

        return "Password reset successfully.";
    }
}