package com.example.backend.request;

import com.example.backend.ENUM.EXPORT_STATE;
import lombok.Data;

@Data
public class ExportStateRequest {
    private EXPORT_STATE exportState;
}
