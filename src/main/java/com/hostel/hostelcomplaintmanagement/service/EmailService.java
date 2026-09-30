package com.hostel.hostelcomplaintmanagement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetOtp(
            String toEmail,
            String otp
    ) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(senderEmail);
            message.setTo(toEmail);

            message.setSubject(
                    "Hostel Complaint Management - Password Reset OTP"
            );

            message.setText(
                    "Hello,\n\n" +
                            "Your password reset OTP is:\n\n" +
                            otp + "\n\n" +
                            "This OTP is valid for 10 minutes.\n\n" +
                            "If you did not request a password reset, " +
                            "please ignore this email.\n\n" +
                            "Regards,\n" +
                            "Hostel Complaint Management System"
            );

            mailSender.send(message);

            System.out.println(
                    "OTP email sent successfully to: " + toEmail
            );

        } catch (Exception e) {

            System.out.println(
                    "OTP email sending failed: " + e.getMessage()
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to send OTP email. Please check Gmail configuration."
            );
        }
    }
}