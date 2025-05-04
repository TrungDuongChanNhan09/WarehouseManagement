package com.example.backend.respone;

import com.example.backend.model.Order;
import lombok.Data;

@Data
public class ApiOrderRespone {
    private String message;
    private Order data;
}
