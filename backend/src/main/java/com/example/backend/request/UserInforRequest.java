package com.example.backend.request;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class UserInforRequest {
    private String gender;
    private String identification;
    private Timestamp dateOfBirth;
    private String address;
    private String email;
}
