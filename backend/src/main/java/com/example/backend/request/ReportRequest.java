package com.example.backend.request;

import com.example.backend.model.REPORT_PRIORITY;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReportRequest {
    private String userName;
    private String title;
    private String description;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private REPORT_PRIORITY reportPriority;
}
