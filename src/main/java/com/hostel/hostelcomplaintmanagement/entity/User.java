package com.hostel.hostelcomplaintmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  @Column(name = "college_registration_id", nullable = false, unique = true)
  private String collegeRegistrationId;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String password;

  @Column(nullable = false)
  private String role;

  // ----- Existing OTP fields (used elsewhere) -----
  @Column(name = "reset_otp")
  private String resetOtp;

  @Column(name = "reset_otp_expiry")
  private LocalDateTime resetOtpExpiry;

  // ----- NEW reset‑token fields required by PasswordResetService -----
  @Column(name = "reset_token")
  private String resetToken;

  @Column(name = "reset_token_expiry")
  private LocalDateTime resetTokenExpiry;

  // ----- NEW fields for registration OTP -----
  @Column(name = "registration_otp")
  private String registrationOtp;

  @Column(name = "registration_otp_expiry")
  private LocalDateTime registrationOtpExpiry;

  // Account activation flag (false = not yet verified)
  @Column(name = "enabled")
  private boolean enabled = false;

  // ------------------- Constructors -------------------
  public User() {
  }

  // ------------------- Getters -------------------
  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getCollegeRegistrationId() {
    return collegeRegistrationId;
  }

  public String getEmail() {
    return email;
  }

  public String getPassword() {
    return password;
  }

  public String getRole() {
    return role;
  }

  public String getResetOtp() {
    return resetOtp;
  }

  public LocalDateTime getResetOtpExpiry() {
    return resetOtpExpiry;
  }

  public String getResetToken() {
    return resetToken;
  }

  public LocalDateTime getResetTokenExpiry() {
    return resetTokenExpiry;
  }

  // New getters for registration OTP
  public String getRegistrationOtp() {
    return registrationOtp;
  }

  public LocalDateTime getRegistrationOtpExpiry() {
    return registrationOtpExpiry;
  }

  // Account enabled flag
  public boolean isEnabled() {
    return enabled;
  }

  // ------------------- Setters -------------------
  public void setId(Long id) {
    this.id = id;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setCollegeRegistrationId(String collegeRegistrationId) {
    this.collegeRegistrationId = collegeRegistrationId;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public void setResetOtp(String resetOtp) {
    this.resetOtp = resetOtp;
  }

  public void setResetOtpExpiry(LocalDateTime resetOtpExpiry) {
    this.resetOtpExpiry = resetOtpExpiry;
  }

  public void setResetToken(String resetToken) {
    this.resetToken = resetToken;
  }

  public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
    this.resetTokenExpiry = resetTokenExpiry;
  }

  // New setters for registration OTP
  public void setRegistrationOtp(String registrationOtp) {
    this.registrationOtp = registrationOtp;
  }

  public void setRegistrationOtpExpiry(LocalDateTime registrationOtpExpiry) {
    this.registrationOtpExpiry = registrationOtpExpiry;
  }

  // Account enabled flag setter
  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }
}
