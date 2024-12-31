package com.example.backend.respone;

import lombok.Data;

@Data
public class ApiResult<T> {
    private T data;
    private String message;
}
