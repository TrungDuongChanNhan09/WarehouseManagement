package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Data
@Document(
    "ImportShipment"
)
public class ImportShipment {
    @Id
    private String id;
    private LocalDate createdAt;
    private String suppiler;
    private List<String> items;
}
