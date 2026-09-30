package com.hostel.hostelcomplaintmanagement.controller;

import com.hostel.hostelcomplaintmanagement.service.PasswordResetService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/password")
@CrossOrigin(origins = "http://localhost:4200")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(
            PasswordResetService passwordResetService
    ) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/send-otp")
    public String sendOtp(
            @RequestParam String email
    ) {

        passwordResetService.sendOtp(email);

        return "OTP sent successfully.";
    }

    @PostMapping("/verify-otp")
    public String verifyOtpAndChangePassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword
    ) {

        passwordResetService.verifyOtpAndChangePassword(
                email,
                otp,
                newPassword
        );

        return "Password changed successfully.";
    }
}