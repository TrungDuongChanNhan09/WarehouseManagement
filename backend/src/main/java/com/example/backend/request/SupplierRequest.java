package com.example.backend.request;

import lombok.Data;

@Data
public class SupplierRequest {
    private String nameSupplier;
    private String address;
    private String phoneNumber;
    private String email;
}
