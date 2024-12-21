package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(
        "suppliers"
)
public class Supplier {
    @Id
    private String id;
    private String nameSupplier;
    private String address;
    private String phoneNumber;
    private String email;
}
