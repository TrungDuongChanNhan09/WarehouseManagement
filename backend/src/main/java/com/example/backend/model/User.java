package com.example.backend.model;

import java.util.Date;

import com.example.backend.ENUM.USER_ROLE;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@Document(
        collection = "users"
)
public class User {
    @Id
    private String id;
    private String fullName;
    private String email;
    private String userName;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private USER_ROLE role = USER_ROLE.ROLE_STAFF;
    private String gender;
    private String identification;
    private Date dateOfBirth;
    private String address;
    private String image;
    private String status = "off";
}
