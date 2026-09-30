package com.hostel.hostelcomplaintmanagement.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Hostel Complaint Management - Password Reset");
        message.setText(
                "Hello,\n\n" +
                        "We received a request to reset your password.\n\n" +
                        "Click the link below to reset your password:\n" +
                        resetLink +
                        "\n\n" +
                        "This link will expire after a limited time.\n\n" +
                        "If you did not request this, please ignore this email.\n\n" +
                        "Regards,\n" +
                        "Hostel Complaint Management System"
        );

        mailSender.send(message);
    }
}