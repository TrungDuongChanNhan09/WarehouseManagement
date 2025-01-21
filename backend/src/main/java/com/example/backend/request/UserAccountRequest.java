package com.example.backend.request;

import com.example.backend.ENUM.USER_ROLE;
import lombok.Data;

@Data
public class UserAccountRequest {
    private String username;
    private String fullName;
    private String password;
    private USER_ROLE role = USER_ROLE.ROLE_STAFF;
}
