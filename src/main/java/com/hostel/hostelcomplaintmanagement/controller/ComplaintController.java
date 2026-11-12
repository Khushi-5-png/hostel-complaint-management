package com.hostel.hostelcomplaintmanagement.controller;

import com.hostel.hostelcomplaintmanagement.entity.Complaint;
import com.hostel.hostelcomplaintmanagement.service.ComplaintService;
import com.hostel.hostelcomplaintmanagement.service.PasswordResetService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/password")
@CrossOrigin(origins = "http://localhost:4200")
public class ComplaintController {

    private final PasswordResetService passwordResetService;

    public ComplaintController(PasswordResetService passwordResetService) {
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

    @CrossOrigin(origins = "http://localhost:4200")
    @RestController
    @RequestMapping("/complaints")

        private final ComplaintService complaintService;

        public ComplaintController(ComplaintService complaintService) {
            this.complaintService = complaintService;
        }

        @PostMapping(consumes = "multipart/form-data")
        public Complaint createComplaint(
                @RequestPart("complaint") Complaint complaint,
                @RequestPart(value = "photo", required = false) MultipartFile photo
        ) {
            return complaintService.createComplaint(complaint, photo);
        }

        @GetMapping
        public List<Complaint> getAllComplaints() {
            return complaintService.getAllComplaints();
        }

        @GetMapping("/{id}")
        public Complaint getComplaintById(@PathVariable Long id) {
            return complaintService.getComplaintById(id);
        }

        @DeleteMapping("/{id}")
        public String deleteComplaint(@PathVariable Long id) {
            complaintService.deleteComplaint(id);
            return "Complaint deleted successfully";
        }

        @PutMapping("/{id}/photo-viewed")
        public Complaint markPhotoAsViewed(@PathVariable Long id) {
            return complaintService.markPhotoAsViewed(id);
        }

        // Update complaint status
        @PutMapping("/{id}/status")
        public Complaint updateStatus(
                @PathVariable Long id,
                @RequestParam String status
        ) {
            return complaintService.updateStatus(id, status);
        }

        @GetMapping("/photo/{filename:.+}")
        public ResponseEntity<Resource> getPhoto(
                @PathVariable String filename
        ) {
            try {
                Path filePath = Paths.get("uploads")
                        .toAbsolutePath()
                        .normalize()
                        .resolve(filename);

                Resource resource =
                        new UrlResource(filePath.toUri());

                if (resource.exists() && resource.isReadable()) {
                    return ResponseEntity.ok()
                            .header("Content-Type", "image/png")
                            .body(resource);
                }

                return ResponseEntity.notFound().build();

            } catch (MalformedURLException e) {
                return ResponseEntity.badRequest().build();
            }
        }
    }
}
