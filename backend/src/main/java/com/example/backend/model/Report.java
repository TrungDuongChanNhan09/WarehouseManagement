package com.example.backend.model;

import com.example.backend.ENUM.REPORT_PRIORITY;
import com.example.backend.ENUM.REPORT_STATUS;
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
    private REPORT_STATUS reportStatus = REPORT_STATUS.PENDING;
}
