package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Data
public class Report {
    @Id
    private String id;
    private String userName;
    private String title;
    private String description;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private REPORT_PRIORITY reportPriority;
}
