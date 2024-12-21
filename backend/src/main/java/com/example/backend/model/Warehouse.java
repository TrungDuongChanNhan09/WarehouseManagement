package com.example.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class Warehouse {
    @Id
    private String id;
    private String wareHouseName;
    private String address;
    private String email;
    private String phone;
}

