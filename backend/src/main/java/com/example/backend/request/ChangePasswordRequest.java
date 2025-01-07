package com.example.backend.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String oldPass;
    private String newPass;
}
