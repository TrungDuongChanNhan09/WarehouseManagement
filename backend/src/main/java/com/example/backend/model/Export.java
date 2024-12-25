package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
public class Export {
    @Id
    private String id;
    private List<String> orderCode;
    private int orderQuantity;
    private EXPORT_STATE exportState = EXPORT_STATE.PENDING;
    private String export_address;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
