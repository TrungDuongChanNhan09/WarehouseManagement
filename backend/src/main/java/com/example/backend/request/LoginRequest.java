package com.example.backend.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String userName;
    private String password;
}