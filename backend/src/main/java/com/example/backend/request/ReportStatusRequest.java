package com.example.backend.request;

import com.example.backend.ENUM.REPORT_STATUS;
import lombok.Data;

@Data
public class ReportStatusRequest {
    private REPORT_STATUS reportStatus;
}
