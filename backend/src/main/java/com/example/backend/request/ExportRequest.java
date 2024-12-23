package com.example.backend.request;

import com.example.backend.model.EXPORT_STATE;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ExportRequest {
    private List<String> orderCode;
    private EXPORT_STATE exportState = EXPORT_STATE.PENDING;
    private String export_address;
    private Date created_at;
    private Date updated_at;
}
