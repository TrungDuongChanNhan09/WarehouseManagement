package com.example.backend.request;

import com.example.backend.ENUM.EXPORT_STATE;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ExportRequest {
    private List<String> orderCode;
    private EXPORT_STATE exportState = EXPORT_STATE.PENDING;
    private String export_address;
    private LocalDate created_at;
    private LocalDate updated_at;
}
