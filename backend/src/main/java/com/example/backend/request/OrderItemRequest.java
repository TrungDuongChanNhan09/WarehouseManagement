package com.example.backend.request;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class OrderItemRequest {
    private List<String> orderItem_code;
    private String delivery_Address;
    private Date created_at;
    private Date update_at;
    private String orderCode;
}
