package com.hostel.hostelcomplaintmanagement.service;

import com.hostel.hostelcomplaintmanagement.entity.Complaint;
import com.hostel.hostelcomplaintmanagement.repository.ComplaintRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    private final Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;

        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException e) {
            throw new RuntimeException(
                    "Could not create upload directory",
                    e
            );
        }
    }

    public Complaint createComplaint(
            Complaint complaint,
            MultipartFile photo
    ) {

        // New complaints start with Pending status
        if (complaint.getStatus() == null ||
                complaint.getStatus().trim().isEmpty()) {
            complaint.setStatus("Pending");
        }

        // New complaints start with photoViewed = false
        complaint.setPhotoViewed(false);

        // Save uploaded photo
        if (photo != null && !photo.isEmpty()) {

            try {

                String originalFileName =
                        photo.getOriginalFilename();

                String fileExtension = "";

                if (originalFileName != null &&
                        originalFileName.contains(".")) {

                    fileExtension =
                            originalFileName.substring(
                                    originalFileName.lastIndexOf(".")
                            );
                }

                String fileName =
                        UUID.randomUUID() + fileExtension;

                Path filePath =
                        uploadDirectory.resolve(fileName);

                Files.copy(
                        photo.getInputStream(),
                        filePath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                complaint.setPhotoPath(fileName);

            } catch (IOException e) {

                throw new RuntimeException(
                        "Failed to save photo",
                        e
                );
            }
        }

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public Complaint getComplaintById(Long id) {

        return complaintRepository
                .findById(id)
                .orElse(null);
    }

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    public Complaint markPhotoAsViewed(Long id) {

        Complaint complaint =
                complaintRepository
                        .findById(id)
                        .orElse(null);

        if (complaint != null) {

            complaint.setPhotoViewed(true);

            return complaintRepository.save(complaint);
        }

        return null;
    }

    // Update complaint status
    public Complaint updateStatus(
            Long id,
            String status
    ) {

        Complaint complaint =
                complaintRepository
                        .findById(id)
                        .orElse(null);

        if (complaint == null) {
            return null;
        }

        if (!status.equals("Pending") &&
                !status.equals("In Progress") &&
                !status.equals("Resolved")) {

            throw new IllegalArgumentException(
                    "Invalid complaint status"
            );
        }

        complaint.setStatus(status);

        return complaintRepository.save(complaint);
    }
}