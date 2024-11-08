package com.example.backend.respone;

import com.example.backend.model.USER_ROLE;
import lombok.Data;

@Data
public class AuthRespone {
    private String jwt;
    private String message;
    private USER_ROLE role;
}
